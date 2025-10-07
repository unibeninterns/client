
export const metadata = {
  title: "Development | DRID - UNIBEN",
  description: "Learn how the University of Benin (UNIBEN) is driving development through research. We are transforming knowledge into progress by influencing policy, building human capital, and supporting livelihoods.",
  keywords: ["UNIBEN development", "research-driven development", "policy and governance", "human capital", "livelihoods", "innovation and enterprise"],
  openGraph: {
    title: "Development | DRID - UNIBEN",
    description: "Learn how the University of Benin (UNIBEN) is driving development through research. We are transforming knowledge into progress by influencing policy, building human capital, and supporting livelihoods.",
    url: "https://drid.uniben.edu/development",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/development-hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Research-Driven Development",
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
