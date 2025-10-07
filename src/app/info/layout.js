export const metadata = {
  title: "Info, Newsletters | DRID - UNIBEN",
  description:
    "Access important documents, newsletters, resources, and institutional reports from the University of Benin (UNIBEN).",
  keywords: [
    "UNIBEN info",
    "newsletters",
    "documents",
    "resources",
    "institutional reports",
    "research papers",
  ],
  openGraph: {
    title: "Info, Newsletters | DRID - UNIBEN",
    description:
      "Access important documents, newsletters, resources, and institutional reports from the University of Benin (UNIBEN).",
    url: "https://drid.uniben.edu/info",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/publications.jpeg",
        width: 1200,
        height: 630,
        alt: "UNIBEN Information and Documents",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
