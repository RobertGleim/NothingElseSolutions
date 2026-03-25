from flask import Blueprint, request, jsonify
import os
import requests
import smtplib
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import re
import html as html_escape
from threading import Thread
import traceback

from flask import current_app

contact_bp = Blueprint('contact', __name__)

# Store contacts in memory (in production, use a database)
contacts = []

def send_email_notification(contact_data):
    """Send email notification for new contact submission"""
    try:
        # Get email configuration from environment
        smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')
        recipient_email = os.getenv('CONTACT_EMAIL', 'customerservice@nothingelsesolutions.com')
        
        print(f"[SMTP DEBUG] Host: {smtp_host}, Port: {smtp_port}, User: {smtp_user}, Recipient: {recipient_email}")
        
        if not smtp_user or not smtp_password:
            print("[SMTP ERROR] SMTP credentials not configured, skipping email notification")
            return False
        
        print("[SMTP DEBUG] Credentials found, proceeding with connection")
        
        # Create message
        # Prevent header injection
        safe_subject = contact_data.get('subject', '').replace('\n', ' ').replace('\r', ' ')
        safe_from = smtp_user
        safe_reply = contact_data.get('email', '').replace('\n', '').replace('\r', '')

        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Contact: {safe_subject}"
        msg['From'] = safe_from
        msg['To'] = recipient_email
        msg['Reply-To'] = safe_reply
        
        # Plain text version
        text = f"""
New Contact Form Submission

From: {contact_data['name']}
Email: {contact_data['email']}
Subject: {contact_data['subject']}

Message:
{contact_data['message']}

---
Submitted: {contact_data['created_at']}
        """
        
        # HTML version - escape user content to avoid XSS in emails
        escaped_name = html_escape.escape(contact_data.get('name', ''))
        escaped_email = html_escape.escape(contact_data.get('email', ''))
        escaped_subject = html_escape.escape(contact_data.get('subject', ''))
        escaped_message = html_escape.escape(contact_data.get('message', ''))

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%); padding: 20px; border-radius: 10px 10px 0 0;">
                <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
            </div>
            <div style="padding: 20px; background: #f9f9f9; border: 1px solid #e0e0e0;">
                <p><strong>From:</strong> {escaped_name}</p>
                <p><strong>Email:</strong> <a href="mailto:{escaped_email}">{escaped_email}</a></p>
                <p><strong>Subject:</strong> {escaped_subject}</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0;">
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">{escaped_message}</div>
                <hr style="border: none; border-top: 1px solid #e0e0e0;">
                <p style="color: #888; font-size: 12px;">Submitted: {contact_data['created_at']}</p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))
        
        # Send email with timeouts and safer handshake. If port is 465 use SSL.
        smtp_timeout = int(os.getenv('SMTP_TIMEOUT', 15))
        use_ssl = os.getenv('SMTP_USE_SSL', 'False').lower() in ('1', 'true', 'yes') or smtp_port == 465
        print(f"[SMTP DEBUG] SSL Mode: {use_ssl}, Timeout: {smtp_timeout}s")
        
        # Attempt SMTP connection. If a plain STARTTLS connection times out,
        # try SSL on port 465 as a fallback (some hosts prefer SMTPS).
        try:
            if use_ssl:
                print(f"[SMTP DEBUG] Attempting SMTP_SSL connection to {smtp_host}:{smtp_port}")
                with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=smtp_timeout) as server:
                    print("[SMTP DEBUG] Connected via SMTP_SSL, logging in...")
                    server.login(smtp_user, smtp_password)
                    print("[SMTP DEBUG] Login successful, sending mail...")
                    server.sendmail(smtp_user, recipient_email, msg.as_string())
                    print("[SMTP DEBUG] Mail sent successfully via SMTP_SSL")
            else:
                print(f"[SMTP DEBUG] Attempting SMTP connection to {smtp_host}:{smtp_port}")
                with smtplib.SMTP(smtp_host, smtp_port, timeout=smtp_timeout) as server:
                    print("[SMTP DEBUG] Connected, sending EHLO...")
                    server.ehlo()
                    try:
                        print("[SMTP DEBUG] Attempting STARTTLS...")
                        server.starttls()
                        print("[SMTP DEBUG] STARTTLS successful, sending EHLO...")
                        server.ehlo()
                    except Exception as e:
                        print(f"[SMTP DEBUG] STARTTLS failed (continuing anyway): {e}")
                        # STARTTLS may fail on some servers; continue to attempt login
                        pass
                    print("[SMTP DEBUG] Logging in...")
                    server.login(smtp_user, smtp_password)
                    print("[SMTP DEBUG] Login successful, sending mail...")
                    server.sendmail(smtp_user, recipient_email, msg.as_string())
                    print("[SMTP DEBUG] Mail sent successfully via SMTP")
        except (TimeoutError, socket.timeout) as e:
            print(f"[SMTP ERROR] Connection timed out ({smtp_host}:{smtp_port}): {e}. Trying SMTPS on port 465...")
            try:
                print("[SMTP DEBUG] Attempting SMTP_SSL fallback on port 465...")
                with smtplib.SMTP_SSL(smtp_host, 465, timeout=smtp_timeout) as server:
                    print("[SMTP DEBUG] Connected via SMTP_SSL (465), logging in...")
                    server.login(smtp_user, smtp_password)
                    print("[SMTP DEBUG] Login successful, sending mail...")
                    server.sendmail(smtp_user, recipient_email, msg.as_string())
                    print("[SMTP DEBUG] Mail sent successfully via SMTP_SSL (465)")
            except Exception as e2:
                print(f"[SMTP ERROR] SMTPS fallback failed: {e2}")
                traceback.print_exc()
                raise
        
        print(f"Email notification sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"[SMTP ERROR] Failed to send email notification: {e}")
        traceback.print_exc()
        return False


@contact_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
def submit_contact():
    """Handle contact form submissions"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response, 200
    
    try:
        # Parse JSON safely, with fallbacks for form-encoded bodies or malformed payloads.
        data = None
        try:
            data = request.get_json(silent=True)
        except Exception:
            data = None

        raw = None
        if not data:
            # Try reading raw body and decode as UTF-8 JSON
            try:
                raw = request.get_data(cache=True)
                if raw:
                    import json
                    try:
                        data = json.loads(raw.decode('utf-8'))
                    except Exception:
                        data = None
            except Exception:
                raw = None

        if not data:
            # Fallback to form data (application/x-www-form-urlencoded)
            try:
                data = request.form.to_dict() or {}
            except Exception:
                data = {}

        if not data:
            print(f"Invalid request body; raw bytes: {raw!r}")
            return jsonify({'error': 'Invalid JSON or empty body'}), 400

        # Basic validation and sanitization
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip()
        subject = (data.get('subject') or '').strip()
        message = (data.get('message') or '').strip()

        # Required checks
        if not name or not email or not subject or not message:
            return jsonify({'error': 'name, email, subject and message are required'}), 400

        # Length limits
        if len(name) > 200 or len(subject) > 200 or len(message) > 5000:
            return jsonify({'error': 'Input too long'}), 400

        # Simple email format validation
        email_re = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
        if not email_re.match(email) or len(email) > 254:
            return jsonify({'error': 'Invalid email address'}), 400

        # Prevent header injection
        for v in (name, email, subject):
            if '\n' in v or '\r' in v:
                return jsonify({'error': 'Invalid input'}), 400
        
        # Create contact record
        contact = {
            'id': len(contacts) + 1,
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'created_at': datetime.utcnow().isoformat(),
            'status': 'new'
        }
        
        # Store contact
        contacts.append(contact)
        
        # Log the contact submission
        print(f"New contact submission from {name} ({email})")
        print(f"Subject: {subject}")

        # Deliver notifications before acknowledging success so the frontend
        # can fall back cleanly when SMTP is unavailable.
        email_sent = send_email_notification(contact)
        
        # Optional: Send to n8n webhook for additional processing
        webhook_url = os.getenv('CONTACT_WEBHOOK_URL')
        webhook_sent = False
        if webhook_url:
            try:
                requests.post(webhook_url, json=contact, timeout=5)
                webhook_sent = True
            except Exception as e:
                print(f"Failed to send webhook notification: {e}")

        if not email_sent and not webhook_sent:
            return jsonify({
                'error': 'Failed to deliver contact notification'
            }), 502
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!',
            'delivery': 'backend'
        }), 201
        
    except Exception as e:
        print(f"Error processing contact form: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to process your message'}), 500


@contact_bp.route('/', methods=['GET'], strict_slashes=False)
def get_contacts():
    """Get all contacts (admin only - add auth later)"""
    return jsonify(contacts), 200


@contact_bp.route('/_smtp_test', methods=['GET'])
def smtp_test():
    """Check outbound TCP connectivity to the configured SMTP host on common ports.

    Returns JSON with per-port connection success/failure and any error message.
    Useful to confirm whether the hosting environment allows outbound SMTP.
    """
    smtp_host = os.getenv('SMTP_HOST', 'mail.privateemail.com')
    ports = [587, 465]
    results = {}
    import socket
    timeout = float(os.getenv('SMTP_TIMEOUT', 5))
    for p in ports:
        try:
            sock = socket.create_connection((smtp_host, p), timeout=timeout)
            sock.close()
            results[str(p)] = {'ok': True, 'error': None}
        except Exception as e:
            results[str(p)] = {'ok': False, 'error': str(e)}

    return jsonify({'host': smtp_host, 'results': results}), 200
