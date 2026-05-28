import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import "../globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const isZh = locale === "zh"

  return {
    title: isZh
      ? "作者闲鱼：每天都好困"
      : "作者闲鱼：每天都好困",
    description: isZh
      ? "作者闲鱼：每天都好困。用于Steam账户安全的临时邮件服务。"
      : "作者闲鱼：每天都好困。用于Steam账户安全的临时邮件服务。",
    icons: {
      icon: "https://cloudflarecnimg.scdn.io/i/6a188eb10c8ee_1779994289.png",
      shortcut: "https://cloudflarecnimg.scdn.io/i/6a188eb10c8ee_1779994289.png",
      apple: "https://cloudflarecnimg.scdn.io/i/6a188eb10c8ee_1779994289.png",
    },
    alternates: {
      languages: {
        zh: "/zh",
        en: "/en",
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证 locale 有效性
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // 启用静态渲染
  setRequestLocale(locale)

  // 获取翻译消息
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
