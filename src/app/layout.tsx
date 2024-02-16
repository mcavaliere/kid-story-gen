import { Footer } from '@/components/server/Footer';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { PHProvider } from './providers';

const PostHogPageView = dynamic(() => import('@/components/PostHogPageView'), {
  ssr: false,
});

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
      <PHProvider>
        <body>
          <PostHogPageView />
          <div className="">
            {children}
            <Footer />
          </div>
        </body>
      </PHProvider>
    </html>
  );
}
