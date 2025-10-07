import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: {
    template: "%s | DRID - UNIBEN",
    default: "DRID - UNIBEN",
  },
  description: "The Directorate of Research, Innovation and Development (DRID) at the University of Benin (UNIBEN) is a hub for cutting-edge research, groundbreaking innovation, and strategic development. We are committed to fostering a vibrant research culture, promoting interdisciplinary collaboration, and translating research findings into impactful solutions for society. Our key areas of focus include technology development, scientific research, product development, and strategic partnerships.",
  keywords: ["DRID", "UNIBEN", "Research", "Innovation", "Development", "Technology", "R&D", "Scientific Research", "Product Development", "Process Innovation", "Disruptive Technology", "Emerging Technologies", "Digital Transformation", "Engineering", "Prototyping", "Experimentation", "Discovery", "Breakthroughs", "Intellectual Property", "Commercialization", "Market Research", "Strategic Development", "Future Technologies", "Advanced Materials", "Artificial Intelligence (AI)", "Machine Learning (ML)", "Biotechnology", "Nanotechnology", "Sustainable Technology", "Green Technology", "Data Science", "Robotics", "Automation", "Systems Integration", "Proof of Concept (POC)", "Feasibility Study", "Grant Funding", "Collaboration", "Knowledge Transfer", "Innovation Ecosystem", "Research Institutes", "Technology Transfer"],
  robots: "index, follow",
  openGraph: {
    title: "DRID - UNIBEN",
    description: "The Directorate of Research, Innovation and Development (DRID) at the University of Benin (UNIBEN) is a hub for cutting-edge research, groundbreaking innovation, and strategic development. We are committed to fostering a vibrant research culture, promoting interdisciplinary collaboration, and translating research findings into impactful solutions for society. Our key areas of focus include technology development, scientific research, product development, and strategic partnerships.",
    url: "https://drid.uniben.edu",
    siteName: "DRID - UNIBEN",
    images: [
      {
        url: "https://drid.uniben.edu/hero-main.png",
        width: 1200,
        height: 630,
        alt: "DRID - UNIBEN Home Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen h-screen overflow-x-hidden bg-white">
      <body className={`${montserrat.className} w-full h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
