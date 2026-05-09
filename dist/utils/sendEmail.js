"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
const config_1 = require("../config");
const client = sib_api_v3_sdk_1.default.ApiClient.instance;
client.authentications["api-key"].apiKey = config_1.config.brevo.apiKey;
const emailApi = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
const sendEmail = async ({ to, subject, html, textContent }) => {
    try {
        const response = await emailApi.sendTransacEmail({
            sender: {
                email: config_1.config.brevo.senderEmail || "noreply@talex.com",
                name: config_1.config.brevo.senderName || "Talex Jobs",
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
            textContent: textContent || "",
        });
        console.log("✅ Email sent successfully via Brevo:", response);
        return response;
    }
    catch (error) {
        console.error("❌ Brevo email error:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
