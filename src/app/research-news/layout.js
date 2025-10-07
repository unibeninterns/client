
export const metadata = {
  title: "Research News | DRID - UNIBEN",
  description: "Stay up-to-date with the latest research news from the University of Benin (UNIBEN). Discover our latest breakthroughs, innovations, and achievements.",
  keywords: ["UNIBEN research news", "latest research", "breakthroughs", "innovations", "achievements"],
  openGraph: {
    title: "Research News | DRID - UNIBEN",
    description: "Stay up-to-date with the latest research news from the University of Benin (UNIBEN). Discover our latest breakthroughs, innovations, and achievements.",
    url: "https://drid.uniben.edu/research-news",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/research-news-hero.jpeg",
        width: 1200,
        height: 630,
        alt: "UNIBEN Research News",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <>{children}</>
  );
}
