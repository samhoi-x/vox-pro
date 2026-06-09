import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CATEGORY_LABELS: Record<string, string> = {
  suggestion: "💡 建議",
  bug: "🐛 問題回報",
  other: "💬 其他",
};

export async function POST(request: Request) {
  try {
    const { email, category, message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "訊息不能為空" }, { status: 400 });
    }

    const catLabel = CATEGORY_LABELS[category] || "💬 其他";

    await resend.emails.send({
      from: "Vox Pro <onboarding@resend.dev>",
      to: "iatsam@gmail.com",
      subject: `${catLabel} — Vox Pro 用戶回饋`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">🎤 Vox Pro 用戶回饋</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px; background: #f5f3ff; font-weight: bold; width: 80px;">類型</td>
              <td style="padding: 8px;">${catLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f3ff; font-weight: bold;">用戶</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
          </table>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">
            此郵件由 Vox Pro 自動發送 · ${new Date().toLocaleString("zh-HK")}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Feedback email error:", error);
    return NextResponse.json(
      { error: "發送失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
