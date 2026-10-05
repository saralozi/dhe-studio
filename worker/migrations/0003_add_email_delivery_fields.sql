ALTER TABLE inquiries
ADD COLUMN resend_email_id TEXT;

ALTER TABLE inquiries
ADD COLUMN email_error TEXT;

ALTER TABLE inquiries
ADD COLUMN email_sent_at TEXT;