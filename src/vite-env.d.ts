/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_NON_TELEGRAM: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
