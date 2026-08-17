import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Header from '../../components/Header';

export const metadata: Metadata = {
  title: 'AI Panchayat',
  description: 'Your digital village assistant',
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="container">
            <Header />
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
