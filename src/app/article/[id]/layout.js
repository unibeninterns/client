// Fixed article/[id]/layout.js
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    // Fetch description and title and create OG links from the article data
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const url = `${baseUrl}/articles/${id}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Article not found");
    const article = await response.json();

    return {
      title: article.title,
      description: article.summary || article.title,
      openGraph: {
        title: article.title,
        description: article.summary || article.title,
        images: article.cover_photo ? [article.cover_photo] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching article metadata:", error);
    return {
      title: "Article Detail",
      description: "Article details",
    };
  }
}

export default function RootLayout({ children }) {
  return <>{children}</>;
}
