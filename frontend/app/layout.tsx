import './globals.css';
import { AuthProvider } from './context/AuthContext';
import  CartProvider  from './context/CartContext';

export const metadata = {
  title: 'iWrist | Premium Men\'s Luxury Watches',
  description: 'Discover premium luxury watches at iWrist. High-end chronograph, automatic, and minimal watches for men.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
