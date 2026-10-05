import { prisma } from "@/lib/db";
import { BoutiqueQuotesClient } from "./BoutiqueQuotesClient";

async function getQuoteRequests() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      items: true,
    },
  });

  return quotes;
}

export default async function BoutiqueQuotesPage() {
  const quotes = await getQuoteRequests();

  return <BoutiqueQuotesClient quotes={quotes} />;
}
