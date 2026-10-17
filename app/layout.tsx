import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "./components/Footer";
import { Syne, Space_Grotesk, Caveat } from 'next/font/google'
import { LenisProvider } from "@/lenis/LenisScroll";


const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['500', '600', '700'],
})

const kaku = localFont({
  src: './fonts/HeiseiKakuGothic.woff2',
  variable: '--font-kaku',
  display: 'swap',
});
const futura = localFont({
  variable: "--font-futura",
  src: './fonts/Futura-Bold.woff2'
});
const Neulis_Neue = localFont({
  src: './fonts/Neulis_Neue.woff2',
  variable: '--font-neulis',
  display: 'swap',
});
const excalifont = localFont({
  src: './fonts/Excalifont-Regular.woff2',
  variable: '--font-excalifont',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Karan Parmar - Portfolio",
  description: "Personal Portfolio of Karan Parmar — Full-Stack & Systems Developer, AI Agents, Distributed Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${kaku.variable} ${syne.variable} ${Neulis_Neue.variable} ${futura.variable} ${spaceGrotesk.variable} ${caveat.variable} ${excalifont.variable} h-full antialiased `}
    >
      <body className="min-h-full  flex flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prevent browser extensions (Bitdefender, Urban VPN) from triggering hydration overlay
                const origError = console.error;
                console.error = function(...args) {
                  if (args.some(a => typeof a === 'string' && (a.includes('bis_skin_checked') || a.includes('bis_register')))) {
                    return;
                  }
                  origError.apply(console, args);
                };

                const clean = (node) => {
                  if (node && node.nodeType === 1) {
                    if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                    if (node.hasAttribute('bis_register')) node.removeAttribute('bis_register');
                    for (let i = 0; i < node.children.length; i++) clean(node.children[i]);
                  }
                };

                if (typeof MutationObserver !== 'undefined') {
                  const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                      if (m.type === 'attributes' && m.attributeName && m.attributeName.startsWith('bis_')) {
                        m.target.removeAttribute(m.attributeName);
                      } else if (m.type === 'childList') {
                        m.addedNodes.forEach(clean);
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });
                }
              })();
            `
          }}
        />
        <LenisProvider>
          <main className="overflow-hidden" suppressHydrationWarning>
            {children}
            <Footer />
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
