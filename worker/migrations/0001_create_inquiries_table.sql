CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',

  consent_given INTEGER NOT NULL DEFAULT 1,

  ai_summary TEXT,
  ai_project_type TEXT,

  email_status TEXT NOT NULL DEFAULT 'pending',

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
ON inquiries(created_at DESC);