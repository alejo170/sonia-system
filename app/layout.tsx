import '@/app/global.css';
//import './global.css'; // Arregla el warning: link preload
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Sonia',
    default: 'Sistema Sonia',
  },
  description:
    'mas que una plataforma, es una aliada en gestionar las notas academicas.',
  metadataBase: new URL('https://sonia-system.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
