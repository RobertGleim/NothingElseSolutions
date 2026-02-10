from flask import Blueprint, request, jsonify
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import re
import html as html_escape

# Rate limiter (initialized in app.py)
from app import limiter

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
        recipient_email = os.getenv('CONTACT_EMAIL', 'nothingelsestore@nothingelsesolutions.com')
        
        if not smtp_user or not smtp_password:
            print("SMTP credentials not configured, skipping email notification")
            return False
        
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
        
        # Send email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, recipient_email, msg.as_string())
        
        print(f"Email notification sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        return False


@contact_bp.route('/', methods=['POST', 'OPTIONS'])
@limiter.limit("10 per minute")
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
        data = request.get_json() or {}

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
        print(f"New contact submission from {data['name']} ({data['email']})")
        print(f"Subject: {data['subject']}")
        
        # Send email notification
        send_email_notification(contact)
        
        # Optional: Send to n8n webhook for additional processing
        webhook_url = os.getenv('CONTACT_WEBHOOK_URL')
        if webhook_url:
            try:
                requests.post(webhook_url, json=contact, timeout=5)
            except Exception as e:
                print(f"Failed to send webhook notification: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        }), 201
        
    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({'error': 'Failed to process your message'}), 500


@contact_bp.route('/', methods=['GET'])
def get_contacts():
    """Get all contacts (admin only - add auth later)"""
    return jsonify(contacts), 200
