import "vite/client";

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_AWS_S3_BUCKET: string;
    readonly VITE_AWS_REGION: string;
    readonly VITE_AWS_ACCESS_KEY_ID: string;
    readonly VITE_AWS_SECRET_ACCESS_KEY: string;
  }
}

export {};
