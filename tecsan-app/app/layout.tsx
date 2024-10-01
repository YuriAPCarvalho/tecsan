import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>STOK - Inventário</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-black text-flex">{children}</body>
    </html>
  );
}
