from django.core import mail
from django.test import TestCase

class EmailTestCase(TestCase):
    def test_send_email(self):
        mail.send_mail(
            'Subject here',
            'Here is the message.',
            'mocksexton@yahoo.com',
            ['joshjheeren@gmail.com'],
            fail_silently=False,
        )

        # Check if the email was captured in mail.outbox
        self.assertEqual(len(mail.outbox), 1)  # Check if an email was sent

        # Print email content for verification
        email = mail.outbox[0]
        print("Email Subject:", email.subject)
        print("Email Body:", email.body)
        print("Email From:", email.from_email)
        print("Email To:", email.to)
        