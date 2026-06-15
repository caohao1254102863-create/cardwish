// ============================================================
// User Types
// ============================================================
export interface Profile {
  id: string
  nickname: string | null
  avatar_url: string | null
  preferred_locale: 'en' | 'zh-CN'
  created_at: string
  updated_at: string
}

// ============================================================
// Card Catalog Types
// ============================================================
export interface Category {
  id: string
  slug: string
  name: string // localized
  name_zh: string
  name_en: string
  icon: string | null
  sort_order: number
  created_at: string
}

export interface CardTemplate {
  id: string
  category_id: string
  category_slug?: string
  name: string // localized
  name_zh: string
  name_en: string
  description: string | null // localized
  description_zh: string | null
  description_en: string | null
  price_cents: number
  currency: string
  images: CardImage[]
  tags: string[]
  status: 'online' | 'offline' | 'draft'
  designer_id: string | null
  sort_order: number
  created_at: string
}

export interface CardImage {
  url: string
  alt_zh?: string
  alt_en?: string
}

// ============================================================
// Order Types
// ============================================================
export interface Order {
  id: string
  order_number: string
  creator_id: string
  template_id: string
  message: string | null
  recipient_name: string | null
  delivery_address_simulation: string | null
  total_cents: number
  currency: string
  status: 'pending' | 'paid' | 'delivered' | 'expired' | 'cancelled'
  share_code: string
  paid_at: string | null
  delivered_at: string | null
  expires_at: string
  created_at: string
  updated_at: string
  // Joined fields
  card_name?: string
  category_slug?: string
  payer_nickname?: string
}

// ============================================================
// Payment Types
// ============================================================
export interface Payment {
  id: string
  order_id: string
  payer_id: string | null
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  amount_cents: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  payer_message: string | null
  metadata: Record<string, any>
  paid_at: string | null
  created_at: string
}

// ============================================================
// Wallet & Earnings Types
// ============================================================
export interface Wallet {
  id: string
  user_id: string
  balance_cents: number
  total_earned_cents: number
  total_withdrawn_cents: number
  created_at: string
  updated_at: string
}

export interface Earning {
  id: string
  user_id: string
  order_id: string
  payment_id: string
  amount_cents: number
  platform_fee_cents: number
  description: string | null
  created_at: string
  // Joined fields
  card_name?: string
}

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount_cents: number
  method: 'wechat' | 'alipay' | 'bank_transfer' | 'stripe_transfer'
  account_info: Record<string, any>
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  admin_notes: string | null
  processed_at: string | null
  created_at: string
}

// ============================================================
// Generated Card Types
// ============================================================
export interface GeneratedCard {
  id: string
  order_id: string
  image_url: string
  thumbnail_url: string | null
  created_at: string
}

export interface ReceivedCard {
  id: string
  user_id: string
  generated_card_id: string
  payer_id: string | null
  is_new: boolean
  viewed_at: string | null
  created_at: string
  // Joined fields
  message?: string
  recipient_name?: string
  payer_nickname?: string
  payer_message?: string
  category_slug?: string
  card_name?: string
}

// ============================================================
// API Request/Response Types
// ============================================================
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface CheckoutRequest {
  template_id: string
  message: string
  recipient_name: string
  delivery_address_simulation: string
}

export interface CheckoutResponse {
  order: Order
  share_url: string
}

export interface CreatePaymentSessionRequest {
  success_url: string
  cancel_url: string
  payer_message?: string
  locale?: string
}

export interface CreatePaymentSessionResponse {
  checkout_url: string
}

export interface WithdrawRequest {
  amount_cents: number
  method: string
  account_info: Record<string, any>
}
