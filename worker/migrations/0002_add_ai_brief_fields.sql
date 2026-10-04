ALTER TABLE inquiries
ADD COLUMN ai_brief_json TEXT;

ALTER TABLE inquiries
ADD COLUMN ai_status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE inquiries
ADD COLUMN ai_error TEXT;

ALTER TABLE inquiries
ADD COLUMN ai_processed_at TEXT;