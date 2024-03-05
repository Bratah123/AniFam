import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
    subsets: ['latin']
});

export const metadata = {
  title: 'Ani x Family',
  description: 'Ad-less Anime Videos for the Whole Family!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
};
