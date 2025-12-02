import { api } from '@/service/api'
import { REGISTER_PATH, RESEND_VERIFICATION_PATH, VERIFY_EMAIL_PATH, PASSWORD_RESET_PATH, PASSWORD_RESET_VERIFY_PATH, PASSWORD_RESET_CONFIRM_PATH, LOGIN_PATH, LOGOUT_PATH, PROFILE_PATH, FIREBASE_AUTH_PATH, type RegisterRequest, type RegisterResponse, type ResendVerificationRequest, type ResendVerificationResponse, type VerifyEmailRequest, type VerifyEmailResponse, type PasswordResetRequest, type PasswordResetResponse, type PasswordResetVerifyRequest, type PasswordResetVerifyResponse, type PasswordResetConfirmRequest, type PasswordResetConfirmResponse, type LoginRequest, type LoginResponse, type LogoutResponse, type ProfileResponse, type FirebaseAuthRequest, type FirebaseAuthResponse } from './endpoint'



export const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: REGISTER_PATH, method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({ url: VERIFY_EMAIL_PATH, method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    resendVerification: builder.mutation<ResendVerificationResponse, ResendVerificationRequest>({
      query: (body) => ({ url: RESEND_VERIFICATION_PATH, method: 'POST', body }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: LOGIN_PATH, method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({ url: LOGOUT_PATH, method: 'POST' })
    }),
    profile: builder.mutation<ProfileResponse, void>({
      query: () => ({ url: PROFILE_PATH, method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    passwordReset: builder.mutation<PasswordResetResponse, PasswordResetRequest>({
      query: (body) => ({ url: PASSWORD_RESET_PATH, method: 'POST', body }),
    }),
    passwordResetVerify: builder.mutation<PasswordResetVerifyResponse, PasswordResetVerifyRequest>({
      query: (body) => ({ url: PASSWORD_RESET_VERIFY_PATH, method: 'POST', body }),
    }),
    passwordResetConfirm: builder.mutation<PasswordResetConfirmResponse, PasswordResetConfirmRequest>({
      query: (body) => ({ url: PASSWORD_RESET_CONFIRM_PATH, method: 'POST', body }),
    }),
    firebaseAuth: builder.mutation<FirebaseAuthResponse, FirebaseAuthRequest>({
      query: (body) => ({ url: FIREBASE_AUTH_PATH, method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
})

export const { useRegisterMutation, useVerifyEmailMutation, useResendVerificationMutation, usePasswordResetMutation, usePasswordResetVerifyMutation, usePasswordResetConfirmMutation, useLoginMutation, useLogoutMutation, useProfileMutation, useFirebaseAuthMutation } = registerApi
