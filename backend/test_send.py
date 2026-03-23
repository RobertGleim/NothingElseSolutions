import os, smtplib, sys
host=os.environ.get('SMTP_HOST')
port=int(os.environ.get('SMTP_PORT','587'))
user=os.environ.get('SMTP_USER')
pw=os.environ.get('SMTP_PASSWORD')
use_tls=os.environ.get('SMTP_USE_TLS','True')
from_addr=user
# send to admin email from .env if present
admin='admin@nothingelsesolutions.com'
msg='Subject: Test Email from repo\n\nThis is a test sent from the repo using Namecheap SMTP.'
try:
    s=smtplib.SMTP(host,port,timeout=20)
    s.ehlo()
    if str(use_tls).lower() in ('true','1','yes'):
        s.starttls()
        s.ehlo()
    s.login(user,pw)
    s.sendmail(from_addr,[admin],msg)
    s.quit()
    print('EMAIL_SENT')
except Exception as e:
    print('EMAIL_ERROR',repr(e))
    sys.exit(2)
