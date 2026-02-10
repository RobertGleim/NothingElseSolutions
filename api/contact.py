from http.server import BaseHTTPRequestHandler
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['name', 'email', 'subject', 'message']
            for field in required_fields:
                if not data.get(field):
                    self.send_error_response(400, f'{field} is required')
                    return
            
            # Create contact record
            contact = {
                'name': data['name'],
                'email': data['email'],
                'subject': data['subject'],
                'message': data['message'],
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Send email notification
            email_sent = self.send_email_notification(contact)
            
            # Log
            print(f"Contact from {data['name']} ({data['email']}) - Email sent: {email_sent}")
            
            self.send_success_response({
                'success': True,
                'message': 'Thank you for your message. We will get back to you soon!'
            })
            
        except Exception as e:
            print(f"Error: {e}")
            self.send_error_response(500, 'Failed to process your message')
    
    def send_email_notification(self, contact_data):
        try:
            smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
            smtp_port = int(os.environ.get('SMTP_PORT', 587))
            smtp_user = os.environ.get('SMTP_USER')
            smtp_password = os.environ.get('SMTP_PASSWORD')
            recipient_email = os.environ.get('CONTACT_EMAIL', 'nothingelsestore@nothingelsesolutions.com')
            
            if not smtp_user or not smtp_password:
                print("SMTP not configured")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"New Contact: {contact_data['subject']}"
            msg['From'] = smtp_user
            msg['To'] = recipient_email
            msg['Reply-To'] = contact_data['email']
            
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
            
            html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
                </div>
                <div style="padding: 20px; background: #f9f9f9; border: 1px solid #e0e0e0;">
                    <p><strong>From:</strong> {contact_data['name']}</p>
                    <p><strong>Email:</strong> <a href="mailto:{contact_data['email']}">{contact_data['email']}</a></p>
                    <p><strong>Subject:</strong> {contact_data['subject']}</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0;">
                    <p><strong>Message:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">{contact_data['message']}</div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(text, 'plain'))
            msg.attach(MIMEText(html, 'html'))
            
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_user, recipient_email, msg.as_string())
            
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False
    
    def send_success_response(self, data):
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'error': message}).encode())
