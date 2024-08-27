import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verificaton Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "verification email send successfully" };
  } catch (error) {
    console.error("error while sending verification email", error);
    return { success: false, message: "failed to send verification email" };
  }
}
