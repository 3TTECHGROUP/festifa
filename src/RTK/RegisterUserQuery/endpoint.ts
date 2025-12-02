export const REGISTER_PATH = '/auth/register'
export const VERIFY_EMAIL_PATH = '/auth/verify-email'
export const RESEND_VERIFICATION_PATH = '/auth/email-verification/resend'
export const PASSWORD_RESET_PATH = '/auth/password-reset'
export const PASSWORD_RESET_VERIFY_PATH = '/auth/password-reset/verify'
export const PASSWORD_RESET_CONFIRM_PATH = '/auth/password-reset/confirm'
export const LOGIN_PATH = '/auth/login'
export const LOGOUT_PATH = '/auth/logout'
export const PASSWORD_RESET_ENDPOINT = '/auth/password-reset'
export const PROFILE_PATH = '/auth/profile'
export const FIREBASE_AUTH_PATH = '/auth/firebase'

export type RegisterRequest = {
  email: string
  password: string
}

export type RegisterResponse = {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    referral_code: string
    referral: string
    picture: string
    phone_number: string
    email_verfied: boolean
    created_at: string
    last_login: string
  }
}


export type VerifyEmailRequest = { email: string; code: string }
export type VerifiedUser = {
  id: string
  email: string
  name: string | null
  referral_code: string | null
  referral: string | null
  picture: string | null
  phone_number: string | null
  email_verified: boolean
  created_at: string
  last_login: string | null
  currency: string | null
}

export type VerifyEmailResponse = { success: boolean; message: string; data: VerifiedUser }
export type ResendVerificationRequest = { email: string }
export type ResendVerificationResponse = { success: boolean; message: string }


export type PasswordResetRequest = { email: string }
export type PasswordResetResponse = { success: boolean; message: string }

export type PasswordResetVerifyRequest = { email: string; code: string }
export type PasswordResetVerifyResponse = { success: boolean; message: string }

export type PasswordResetConfirmRequest = { email: string; password: string }
export type PasswordResetConfirmResponse = { success: boolean; message: string }

export type LoginRequest = { email: string; password: string; remember?: boolean }
export type LoginUser = {
  id: string
  email: string
  name: string | null
  referral_code: string | null
  referral: string | null
  picture: string | null
  phone_number: string | null
  email_verified: boolean
  created_at: string
  last_login: string | null
  currency: string | null
}
export type LoginResponse = { success: boolean; message: string; data: LoginUser }

export type LogoutResponse = { success: boolean; message: string }
export type ProfileResponse = { success: boolean; message: string; data: LoginUser }

export type FirebaseAuthRequest = { id_token: string }
export type FirebaseAuthResponse = { success: boolean; message: string; data: LoginUser }