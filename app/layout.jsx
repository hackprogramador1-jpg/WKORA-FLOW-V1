import "./globals.css";

export const metadata = {
  title: "WKORA FLOW",
  description: "Acompanhe seu cliente do primeiro contato ao pós-venda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
