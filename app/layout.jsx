import "./globals.css";

export const metadata = {
  title: "ముందు తెలుసుకో · Mundhu Tesuko",
  description:
    "Know before you apply — a clearer way through the Telangana Food Security Card. An independent prototype, not a government service.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="te">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Noto+Serif+Telugu:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
