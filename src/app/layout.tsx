import { Footer } from '@/components/server/Footer';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StoryTime: Create new kids stories with ease',
  description: 'StoryTime lets you generate new stories for kids in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfairDisplay.className}>
      <body>
        <div className="">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
