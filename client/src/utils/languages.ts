export const LANGUAGE_CODES = [
  "en",
  "hi",
  "mr",
  "es",
  "fr",
  "de",
  "ja",
  "ko",
  "zh",
  "ar",
] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

const languageNames = new Intl.DisplayNames(["en"], {
  type: "language",
});

export const getLanguageName = (code: string): string => {
  return languageNames.of(code) ?? code;
};
