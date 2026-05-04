import 'vite/client'

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AWS_S3_BUCKET: string
  readonly VITE_AWS_REGION: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly glob: (pattern: string) => Record<string, { default: any }>
}
