// i18n configuration. English is the DEFAULT and lives at the root (`/`) so the
// already-indexed URLs and canonical setup don't change; Japanese lives at `/ja`.
export const locales = ['en', 'ja'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
}
