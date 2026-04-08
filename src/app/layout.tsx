import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Wall Calendar | A Beautiful Way to Plan Your Days",
  description:
    "A premium interactive wall calendar with date range selection, integrated notes, seasonal themes, and smooth animations. Built with React and Next.js.",
  keywords: ["calendar", "wall calendar", "date picker", "range selector", "notes", "planner"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f6f3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
