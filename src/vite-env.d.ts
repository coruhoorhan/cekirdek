/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG?: string
  readonly VITE_ENABLE_CSP?: string
  readonly VITE_ENABLE_HSTS?: string
  readonly VITE_LOG_LEVEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
