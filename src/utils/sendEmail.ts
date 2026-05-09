import SibApiV3Sdk from "sib-api-v3-sdk";
import { config } from '../config';

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = config.brevo.apiKey;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  textContent?: string;
}

export const sendEmail = async ({ to, subject, html, textContent }: EmailParams) => {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: {
        email: config.brevo.senderEmail || "noreply@talex.com",
        name: config.brevo.senderName || "Talex Jobs",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: textContent || "",
    });

    console.log("✅ Email sent successfully via Brevo:", response);
    return response;
  } catch (error) {
    console.error("❌ Brevo email error:", error);
    throw error;
  }
};
