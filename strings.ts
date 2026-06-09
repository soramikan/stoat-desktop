const localeCandidates = [
  process.env.LANGUAGE,
  process.env.LC_ALL,
  process.env.LC_MESSAGES,
  process.env.LANG,
  Intl.DateTimeFormat().resolvedOptions().locale,
]
  .filter((locale): locale is string => Boolean(locale))
  .flatMap((locale) => locale.split(":"));

function resolveLocale(locale: string) {
  return locale.toLowerCase().replace("_", "-").startsWith("ja");
}

type Locale = "en" | "ja";

let activeLocale: Locale = localeCandidates.some(resolveLocale) ? "ja" : "en";

const strings = {
  "app.name.desktop": {
    en: "Stoat for Desktop",
    ja: "デスクトップ版 Stoat",
  },
  "update.available.title": {
    en: "Update Available",
    ja: "アップデートがあります",
  },
  "update.available.body": {
    en: "Restart the app to install the update.",
    ja: "アップデートをインストールするにはアプリを再起動してください。",
  },
  version: {
    en: "Version",
    ja: "バージョン",
  },
  "app.hide": {
    en: "Hide App",
    ja: "アプリを隠す",
  },
  "app.show": {
    en: "Show App",
    ja: "アプリを表示",
  },
  "app.quit": {
    en: "Quit App",
    ja: "アプリを終了",
  },
  "notifications.none": {
    en: "No Notifications",
    ja: "通知はありません",
  },
  "notifications.unread": {
    en: "Unread Messages",
    ja: "未読メッセージ",
  },
  "spellcheck.add_to_dictionary": {
    en: "Add to dictionary",
    ja: "辞書に追加",
  },
  "spellcheck.toggle": {
    en: "Toggle spellcheck",
    ja: "スペルチェックを切り替え",
  },
  "discord.details": {
    en: "Chatting with others",
    ja: "ほかの人とチャット中",
  },
  "discord.join": {
    en: "Join Stoat!",
    ja: "Stoat に参加しよう！",
  },
  "discord.join_button": {
    en: "Join Stoat",
    ja: "Stoat に参加",
  },
} as const;

type StringKey = keyof typeof strings;

export function setLocale(locale: string) {
  activeLocale = resolveLocale(locale) ? "ja" : "en";
}

export function t(key: StringKey) {
  return strings[key][activeLocale];
}

export function notificationCountLabel(count: number) {
  if (count === -1) return t("notifications.unread");
  return activeLocale === "ja" ? `${count} 件の通知` : `${count} Notifications`;
}
