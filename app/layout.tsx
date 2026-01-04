import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const googleSans = localFont({
  src: [
    {
      path: './fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-google-sans',
});

export const metadata: Metadata = {
  title: 'Financial Management - Quản lý Tài chính Cá nhân',
  description: 'Ứng dụng quản lý tài chính cá nhân và gia đình với theo dõi thu chi, đầu tư, tiết kiệm',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${googleSans.variable} font-sans antialiased bg-background text-stone-100`}>
        {children}
      </body>
    </html>
  );
}
