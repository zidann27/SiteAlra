import { loadProfile } from "./dashboardStore";
import { chatWithAssistant } from "./api";

export async function sendDashboardChat(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string> {
  const profile = await loadProfile();

  const res = await chatWithAssistant({
    message,
    history,
    context: {
      businessName: profile.name || undefined,
      businessType: profile.businessType || undefined,
      targetCustomers: profile.targetCustomers || undefined,
    },
  });

  return res.reply;
}
