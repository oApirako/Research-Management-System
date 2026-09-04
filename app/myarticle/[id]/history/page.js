import HistoryArticle from "@/components/HistoryArticle";

export default async function HistoryArticlePage({ params }) {
  const { id } = await params;

  return <HistoryArticle id={id} />;
}