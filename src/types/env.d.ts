/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_TEST_EMAIL: string
  readonly VITE_TEST_PASSWORD: string
  readonly VITE_TEST_USER_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
