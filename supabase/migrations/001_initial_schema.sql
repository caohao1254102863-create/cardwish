-- ============================================================
-- Digital Card Platform — Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname        TEXT,
  avatar_url      TEXT,
  preferred_locale TEXT DEFAULT 'en' CHECK (preferred_locale IN ('en', 'zh-CN')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name_zh         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  icon            TEXT,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CARD TEMPLATES
-- ============================================================
CREATE TABLE card_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_zh         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  description_zh  TEXT,
  description_en  TEXT,
  price_cents     INTEGER NOT NULL CHECK (price_cents > 0),
  currency        TEXT DEFAULT 'USD',
  images          JSONB DEFAULT '[]',
  tags            JSONB DEFAULT '[]',
  status          TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'draft')),
  designer_id     UUID,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT UNIQUE NOT NULL,
  creator_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id     UUID NOT NULL REFERENCES card_templates(id),
  message         TEXT,
  recipient_name  TEXT,
  delivery_address_simulation TEXT,
  total_cents     INTEGER NOT NULL CHECK (total_cents > 0),
  currency        TEXT DEFAULT 'USD',
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'expired', 'cancelled')),
  share_code      TEXT UNIQUE NOT NULL,
  paid_at         TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payer_id                UUID REFERENCES profiles(id),
  stripe_session_id       TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_cents            INTEGER NOT NULL CHECK (amount_cents > 0),
  currency                TEXT DEFAULT 'USD',
  status                  TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payer_message           TEXT,
  metadata                JSONB DEFAULT '{}',
  paid_at                 TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WALLETS
-- ============================================================
CREATE TABLE wallets (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance_cents       INTEGER DEFAULT 0 CHECK (balance_cents >= 0),
  total_earned_cents  INTEGER DEFAULT 0,
  total_withdrawn_cents INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EARNINGS (ledger)
-- ============================================================
CREATE TABLE earnings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id),
  order_id          UUID NOT NULL REFERENCES orders(id),
  payment_id        UUID NOT NULL REFERENCES payments(id),
  amount_cents      INTEGER NOT NULL CHECK (amount_cents >= 0),
  platform_fee_cents INTEGER NOT NULL CHECK (platform_fee_cents >= 0),
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GENERATED CARDS
-- ============================================================
CREATE TABLE generated_cards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  image_url       TEXT NOT NULL,
  thumbnail_url   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RECEIVED CARDS
-- ============================================================
CREATE TABLE received_cards (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id),
  generated_card_id UUID NOT NULL REFERENCES generated_cards(id) ON DELETE CASCADE,
  payer_id          UUID REFERENCES profiles(id),
  is_new            BOOLEAN DEFAULT TRUE,
  viewed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WITHDRAWAL REQUESTS
-- ============================================================
CREATE TABLE withdrawal_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  amount_cents    INTEGER NOT NULL CHECK (amount_cents > 0),
  method          TEXT NOT NULL CHECK (method IN ('wechat', 'alipay', 'bank_transfer', 'stripe_transfer')),
  account_info    JSONB,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes     TEXT,
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_orders_creator_id ON orders(creator_id);
CREATE INDEX idx_orders_share_code ON orders(share_code);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);
CREATE INDEX idx_earnings_user_id ON earnings(user_id);
CREATE INDEX idx_earnings_order_id ON earnings(order_id);
CREATE INDEX idx_withdrawal_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_received_cards_user_id ON received_cards(user_id);
CREATE INDEX idx_card_templates_category ON card_templates(category_id);
CREATE INDEX idx_card_templates_status ON card_templates(status);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: public read-only
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (true);

-- Card Templates: public read for online cards
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Online cards public read" ON card_templates FOR SELECT USING (status = 'online');

-- Orders: creator-only read/write
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users update own orders" ON orders FOR UPDATE USING (auth.uid() = creator_id);

-- Payments: payer reads own; webhook uses service role
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (auth.uid() = payer_id);

-- Wallets: owner-only read
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Earnings: owner-only read
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own earnings" ON earnings FOR SELECT USING (auth.uid() = user_id);

-- Received cards: owner-only read
ALTER TABLE received_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own received cards" ON received_cards FOR SELECT USING (auth.uid() = user_id);

-- Withdrawal requests: owner read/write
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own withdrawals" ON withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own withdrawals" ON withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Generated cards: public read (via service role)
ALTER TABLE generated_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Generated cards public read" ON generated_cards FOR SELECT USING (true);

-- ============================================================
-- RPC: Credit wallet atomically
-- ============================================================
CREATE OR REPLACE FUNCTION credit_wallet(p_user_id UUID, p_amount_cents INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE wallets
  SET balance_cents = balance_cents + p_amount_cents,
      total_earned_cents = total_earned_cents + p_amount_cents,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
