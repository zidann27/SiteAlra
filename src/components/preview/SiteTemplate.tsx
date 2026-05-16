import type { AIContent } from "../../lib/types";
import SiteTemplateModern from "./SiteTemplateModern";
import SiteTemplateMinimal from "./SiteTemplateMinimal";
import SiteTemplateFood from "./SiteTemplateFood";
import SiteTemplateLuxury from "./SiteTemplateLuxury";

interface SiteTemplateProps {
  content: AIContent;
  businessName: string;
  category: string;
  slug?: string;
  isPreview?: boolean;
}

export default function SiteTemplate({
  content,
  businessName,
  category,
  slug,
  isPreview = false,
}: SiteTemplateProps) {
  const style = content.style || "modern";

  const props = { content, businessName, category, slug, isPreview } as const;
  if (style === "minimal") return <SiteTemplateMinimal {...props} />;
  if (style === "food") return <SiteTemplateFood {...props} />;
  if (style === "luxury") return <SiteTemplateLuxury {...props} />;
  return <SiteTemplateModern {...props} />;
}
