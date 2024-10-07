// /src/app/layout.js
import { Inter, Yeseva_One } from "next/font/google";
import "./globals.css";
import './_lib/syncScheduler'; // Import the scheduler to run at app startup
import './_lib/cleanupScheduler';

const inter = Inter({ subsets: ["latin"] });
const yesevaOne = Yeseva_One({ weight: "400", subsets: ["latin"] }); // Import Yeseva One font

export const metadata = {
  title: "theAnswer 2.0",
  description: "Subscriptions Stats Tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
