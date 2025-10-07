
export const metadata = {
  title: "Innovation | DRID - UNIBEN",
  description: "Discover the culture of innovation at the University of Benin (UNIBEN). Explore how we turn research into real-world solutions and support student and faculty innovators.",
  keywords: ["UNIBEN innovation", "student startups", "faculty-driven startups", "HealthTech", "AgriTech", "FinTech", "EdTech", "innovation ecosystem"],
  openGraph: {
    title: "Innovation | DRID - UNIBEN",
    description: "Discover the culture of innovation at the University of Benin (UNIBEN). Explore how we turn research into real-world solutions and support student and faculty innovators.",
    url: "https://drid.uniben.edu/innovation",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/innovation-home.jpeg",
        width: 1200,
        height: 630,
        alt: "Innovation at UNIBEN",
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
