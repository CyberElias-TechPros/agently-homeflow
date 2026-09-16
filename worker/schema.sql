-- Agently Homeflow - Complete D1 Schema
-- Production-grade property management platform

-- Users table with all roles
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner','manager','accountant','tenant','realtor','contractor','admin','inspector')),
  avatar_url TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  email_verified INTEGER DEFAULT 0,
  phone_verified INTEGER DEFAULT 0,
  bio TEXT,
  company_name TEXT,
  license_number TEXT,
  rating REAL DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  manager_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment','house','office','commercial','land')),
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Lagos',
  state TEXT DEFAULT 'Lagos',
  country TEXT DEFAULT 'Nigeria',
  zip_code TEXT,
  latitude REAL,
  longitude REAL,
  total_units INTEGER NOT NULL DEFAULT 1,
  total_area REAL,
  year_built INTEGER,
  market_value REAL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','under_maintenance','sold')),
  amenities TEXT, -- JSON array
  images TEXT, -- JSON array of URLs
  documents TEXT, -- JSON
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_manager ON properties(manager_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Units table
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area REAL,
  rent REAL NOT NULL,
  security_deposit REAL,
  status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant','occupied','maintenance','reserved')),
  tenant_id TEXT,
  lease_id TEXT,
  amenities TEXT, -- JSON
  images TEXT, -- JSON
  virtual_tour_url TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_units_property ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_tenant ON units(tenant_id);

-- Tenants table (lease holders - can be separate from users for flexibility)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- link to user if they have account
  unit_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lease_start TEXT NOT NULL,
  lease_end TEXT NOT NULL,
  rent_amount REAL NOT NULL,
  rent_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (rent_frequency IN ('monthly','quarterly','yearly')),
  payment_day INTEGER DEFAULT 1,
  security_deposit REAL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid','owing','unpaid')),
  balance REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','evicted','moved_out')),
  emergency_contact TEXT, -- JSON
  employment_info TEXT, -- JSON
  documents TEXT, -- JSON
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_tenants_unit ON tenants(unit_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Leases table (detailed lease agreements)
CREATE TABLE IF NOT EXISTS leases (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  monthly_rent REAL NOT NULL,
  security_deposit REAL NOT NULL,
  rent_frequency TEXT DEFAULT 'monthly',
  payment_day INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','expired','terminated','renewed')),
  terms TEXT, -- JSON array of terms
  documents TEXT, -- JSON
  auto_renew INTEGER DEFAULT 0,
  renewal_notice_days INTEGER DEFAULT 30,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  lease_id TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer','card','cash','mobile_money','ussd','cheque')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed','cancelled','refunded')),
  reference_number TEXT,
  receipt_number TEXT UNIQUE,
  gateway_transaction_id TEXT,
  gateway_response TEXT, -- JSON
  fees REAL DEFAULT 0,
  notes TEXT,
  processed_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (processed_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_property ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT,
  category TEXT NOT NULL CHECK (category IN ('repairs','taxes','utilities','insurance','marketing','legal','management','cleaning','security','other')),
  subcategory TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'NGN',
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  vendor TEXT,
  vendor_id TEXT,
  receipt_url TEXT,
  approved_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  recurring INTEGER DEFAULT 0,
  recurring_frequency TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_expenses_property ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Maintenance requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  tenant_id TEXT,
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','emergency')),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('plumbing','electrical','hvac','appliance','structural','cleaning','security','general','other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','assigned','in_progress','waiting_parts','completed','cancelled')),
  images TEXT, -- JSON array
  estimated_cost REAL,
  actual_cost REAL,
  scheduled_date TEXT,
  completed_date TEXT,
  rating INTEGER,
  feedback TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (reported_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_assigned ON maintenance_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);

-- Applications (tenant applications)
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  applicant_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  employment_status TEXT,
  employer_name TEXT,
  monthly_income REAL,
  move_in_date TEXT,
  references_text TEXT,
  kyc_documents TEXT, -- JSON
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','screening','approved','rejected','withdrawn')),
  score INTEGER,
  reviewed_by TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (applicant_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_applications_property ON applications(property_id);
CREATE INDEX IF NOT EXISTS idx_applications_unit ON applications(unit_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Listings (for realtors)
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rent REAL NOT NULL,
  images TEXT, -- JSON
  virtual_tour_url TEXT,
  video_url TEXT,
  featured INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_verification','published','taken','expired')),
  verified_by TEXT,
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  amenities TEXT, -- JSON
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (agent_id) REFERENCES users(id),
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_listings_agent ON listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_property ON listings(property_id);

-- Leads (for realtors)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','viewing_scheduled','negotiation','converted','lost')),
  scheduled_viewing TEXT,
  notes TEXT,
  source TEXT DEFAULT 'website',
  score INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_listing ON leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT,
  inspector_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  completed_date TEXT,
  type TEXT NOT NULL CHECK (type IN ('move_in','move_out','routine','complaint','safety','compliance')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
  checklist TEXT, -- JSON
  findings TEXT, -- JSON
  recommendations TEXT, -- JSON
  images TEXT, -- JSON
  report_url TEXT,
  overall_score INTEGER,
  next_inspection_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (inspector_id) REFERENCES users(id)
);

-- Messages / Communications
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  recipient_id TEXT,
  recipient_group TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct','announcement','emergency','system')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','read','archived')),
  attachments TEXT, -- JSON
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON
  read INTEGER DEFAULT 0,
  action_url TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Documents storage metadata
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  property_id TEXT,
  unit_id TEXT,
  tenant_id TEXT,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_key TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL CHECK (category IN ('lease','id','receipt','invoice','inspection','maintenance','property_image','avatar','other')),
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Payment plans
CREATE TABLE IF NOT EXISTS payment_plans (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  lease_id TEXT,
  total_amount REAL NOT NULL,
  installments TEXT NOT NULL, -- JSON array
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','active','completed','defaulted')),
  approved_by TEXT,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Activity logs / Audit
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  property_id TEXT,
  details TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_logs(created_at);
