// Helper to send password reset email via Resend API or SMTP if configured
export async function sendPasswordResetEmail({ toEmail, resetUrl, resetToken }) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Birthday Wishes <onboarding@resend.dev>",
          to: [toEmail],
          subject: "🔐 Reset Your Birthday Platform Password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0717; color: #ffffff; borderRadius: 16px;">
              <h2 style="color: #ec4899; text-align: center;">Birthday Website Builder</h2>
              <p style="color: #e9d5ff; font-size: 16px;">Hello,</p>
              <p style="color: #e9d5ff; font-size: 14px; line-height: 1.6;">
                We received a request to reset the password for your account (<strong>${toEmail}</strong>).
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #ec4899, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Reset Password Now
                </a>
              </div>
              <p style="color: #a855f7; font-size: 12px; text-align: center;">
                This reset link is valid for 1 hour. If you did not request a password reset, please ignore this email.
              </p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Resend Email Error:", errorData);
        return { success: false, error: errorData };
      }

      return { success: true };
    } catch (err) {
      console.error("Failed to send reset email:", err);
      return { success: false, error: err.message };
    }
  }

  // Fallback if no email provider set
  console.log(`[EMAIL SYSTEM]: Email service not configured. Reset link for ${toEmail}: ${resetUrl}`);
  return { success: false, fallback: true, resetUrl };
}
