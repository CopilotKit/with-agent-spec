import type { Metadata } from "next";

import "./globals.css";
import "./style.css";

export const metadata: Metadata = {
  title: "Portable Agents with Generative UI",
  description: "Built with Agent Spec, CopilotKit, and A2UI — manage your calendar, inbox, and emails with conversational AI",
  openGraph: {
    title: "Portable Agents with Generative UI",
    description: "Built with Agent Spec, CopilotKit, and A2UI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portable Agents with Generative UI",
    description: "Built with Agent Spec, CopilotKit, and A2UI",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;var m=window.matchMedia('(prefers-color-scheme:dark)');function u(e){d.classList.toggle('dark',e.matches)}u(m);m.addEventListener('change',u)})()` }} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={"antialiased"}>
        <div className="flex h-dvh w-screen flex-col min-h-0 overflow-hidden bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
