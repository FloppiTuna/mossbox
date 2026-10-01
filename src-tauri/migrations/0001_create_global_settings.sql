CREATE TABLE global_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('string', 'integer', 'boolean', 'float', 'json')),
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
) WITHOUT ROWID;
