import { articlesApi, articleViewsApi, facultyApi } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const article = await articlesApi.getPublicArticle(params.id);
    if (!article) {
      return {
        title: "Article not found",
        description: "This article could not be found.",
      };
    }

    return {
      title: article.title,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        images: [
          {
            url: getImageUrl(article.cover_photo),
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while generating the metadata for this article.",
    };
  }
}
import ArticleDetail from './ArticleDetail';

async function getArticleData(id) {
  try {
    const article = await articlesApi.getPublicArticle(id);
    const popular = await articleViewsApi.getPopularArticles(4);
    const allArticles = await articlesApi.getPublicArticles({
      category: article.category,
    });
    const related = allArticles
      .filter((art) => art._id !== id)
      .slice(0, 3);

    return { article, popular: popular.data.data, related };
  } catch (error) {
    console.error("Error fetching article data:", error);
    return { article: null, popular: [], related: [] };
  }
}

export default async function ArticlePage({ params }) {
  const { article, popular, related } = await getArticleData(params.id);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} popularArticles={popular} relatedArticles={related} />;
}
