
export const metadata = {
  title: "Partnerships | DRID - UNIBEN",
  description: "Discover the global research partnerships at the University of Benin (UNIBEN). We collaborate across continents to co-create solutions that are locally rooted and globally relevant.",
  keywords: ["UNIBEN partnerships", "global research partnerships", "research collaborations", "international partners", "Northeastern University", "Aix-Marseille University", "Horizon Europe"],
  openGraph: {
    title: "Partnerships | DRID - UNIBEN",
    description: "Discover the global research partnerships at the University of Benin (UNIBEN). We collaborate across continents to co-create solutions that are locally rooted and globally relevant.",
    url: "https://drid.uniben.edu/partnerships",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/partnership-landing-page.jpeg",
        width: 1200,
        height: 630,
        alt: "Global Research Partnerships",
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
