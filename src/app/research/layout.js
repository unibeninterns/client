
export const metadata = {
  title: "Research | DRID - UNIBEN",
  description: "Explore the research publications and scholarly communications from the University of Benin (UNIBEN). Discover our commitment to rigorous, impactful, and accessible research.",
  keywords: ["UNIBEN research publications", "scholarly communication", "academic journals", "research bulletins", "policy briefs", "research reports"],
  openGraph: {
    title: "Research | DRID - UNIBEN",
    description: "Explore the research publications and scholarly communications from the University of Benin (UNIBEN). Discover our commitment to rigorous, impactful, and accessible research.",
    url: "https://drid.uniben.edu/research",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/publications.jpeg",
        width: 1200,
        height: 630,
        alt: "UNIBEN Research Publications",
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
