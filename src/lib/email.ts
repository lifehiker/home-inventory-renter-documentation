export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] Welcome email would be sent to", to);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@depositsafe.app",
    to,
    subject: "Welcome to DepositSafe",
    html: `<h1>Welcome to DepositSafe, ${name}!</h1><p>Your account is ready. Start documenting your property today.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard">Go to Dashboard</a></p>`,
  });
}

export async function sendReportReadyEmail(to: string, reportUrl: string) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@depositsafe.app",
    to,
    subject: "Your DepositSafe report is ready",
    html: `<p>Your documentation report is ready. <a href="${reportUrl}">Download it here</a>.</p>`,
  });
}

export async function sendProConfirmationEmail(to: string) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@depositsafe.app",
    to,
    subject: "You've unlocked DepositSafe Pro",
    html: `<p>Congratulations! You now have unlimited properties, rooms, and photos. Thank you for upgrading to DepositSafe Pro!</p>`,
  });
}
