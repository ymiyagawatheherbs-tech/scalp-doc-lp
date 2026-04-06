export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // LINE Messaging API
  lineKobeChannelAccessToken: process.env.LINE_KOBE_CHANNEL_ACCESS_TOKEN ?? "",
  lineKobeChannelSecret: process.env.LINE_KOBE_CHANNEL_SECRET ?? "",
  lineSalonChannelAccessToken: process.env.LINE_SALON_CHANNEL_ACCESS_TOKEN ?? "",
  lineSalonChannelSecret: process.env.LINE_SALON_CHANNEL_SECRET ?? "",
  // Outlook SMTP
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "cx@the-herbs.co.jp",
};
