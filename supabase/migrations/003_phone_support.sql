-- Add phone support to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone) WHERE phone IS NOT NULL;

-- Add payment_method to payments table for PayPal support
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'paypal'));
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
