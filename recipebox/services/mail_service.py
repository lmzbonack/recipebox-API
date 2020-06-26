from threading import Thread

from flask import current_app
from flask_mail import Message

from recipebox.extensions import mail

def send_async_email(app, msg):
    print("send_async_email called", flush=True)
    with app.app_context():
        try:
            mail.send(msg)
        except ConnectionRefusedError:
            raise InternalServerError("[MAIL SERVER] not working")


def send_email(subject, sender, recipients, text_body, html_body):
    print("send_email called", flush=True)
    app = current_app._get_current_object()
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    Thread(target=send_async_email, args=(app, msg)).start()
