export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  goal: string;
};

const BRAND_GREEN = "#93E200";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(fullName: string) {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}

/** Congrats / greeting email sent to the person who submitted the form. */
export function buildContactThankYouEmail(payload: ContactPayload, siteUrl: string) {
  const name = escapeHtml(payload.name);
  const greetingName = escapeHtml(firstName(payload.name));
  const goal = escapeHtml(payload.goal);
  const safeSite = siteUrl.replace(/\/$/, "");

  const subject = `You're in, ${firstName(payload.name)} — Hybrid Pro got your message`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111111;border-radius:20px;overflow:hidden;border:1px solid #222;">
          <!-- Top accent -->
          <tr>
            <td style="height:6px;background:${BRAND_GREEN};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Logo wordmark -->
          <tr>
            <td align="center" style="padding:36px 32px 8px;">
              <div style="font-family:Impact,Haettenschweiler,'Arial Narrow Bold',Arial Black,sans-serif;font-size:28px;letter-spacing:0.12em;color:${BRAND_GREEN};text-transform:uppercase;line-height:1;">
                Hybrid Pro
              </div>
              <div style="margin-top:8px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#888;">
                Coaching with Akash
              </div>
            </td>
          </tr>

          <!-- Portrait (pre-cropped square headshot — email clients ignore object-fit) -->
          <tr>
            <td align="center" style="padding:20px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:999px;border:3px solid ${BRAND_GREEN};overflow:hidden;">
                <tr>
                  <td style="width:120px;height:120px;line-height:0;font-size:0;">
                    <img
                      src="cid:akash-portrait"
                      alt="Akash — Hybrid Pro coach"
                      width="120"
                      height="120"
                      style="display:block;width:120px;height:120px;border-radius:999px;border:0;"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding:16px 32px 8px;text-align:center;">
              <h1 style="margin:0;font-family:Impact,Haettenschweiler,'Arial Narrow Bold',Arial Black,sans-serif;font-size:36px;line-height:0.95;letter-spacing:0.04em;text-transform:uppercase;color:#ffffff;font-weight:400;">
                Message received,<br />${greetingName}.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 36px 8px;text-align:center;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#c8c8c8;">
                Thanks for reaching out — your enquiry is with the Hybrid Pro team.
                Akash will review what you shared and get back to you shortly.
              </p>
            </td>
          </tr>

          <!-- Goal card -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:14px;border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:20px 22px;">
                    <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_GREEN};margin-bottom:10px;">
                      Your goal
                    </div>
                    <p style="margin:0;font-size:15px;line-height:1.55;color:#ededed;white-space:pre-wrap;">${goal}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;text-align:center;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#a8a8a8;">
                While you wait, explore programs or start a free body assessment.
              </p>
              <a
                href="${safeSite}/assessment"
                target="_blank"
                style="display:inline-block;background:${BRAND_GREEN};color:#111111;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.04em;text-transform:uppercase;padding:14px 28px;border-radius:999px;"
              >
                Start assessment →
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 36px;text-align:center;">
              <p style="margin:0;font-size:14px;line-height:1.5;color:#888;">
                Talk soon,<br />
                <span style="color:#ededed;font-weight:600;">Akash &amp; Hybrid Pro</span>
              </p>
              <p style="margin:18px 0 0;font-size:12px;color:#555;">
                <a href="${safeSite}" style="color:#777;text-decoration:underline;">hybridpro.in</a>
                ·
                <a href="mailto:hello@hybridpro.fit" style="color:#777;text-decoration:underline;">hello@hybridpro.fit</a>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:20px 0 0;font-size:11px;color:#444;text-align:center;max-width:480px;">
          You received this because ${name} submitted the contact form on Hybrid Pro.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const text = [
    `Message received, ${firstName(payload.name)}.`,
    "",
    "Thanks for reaching out — your enquiry is with the Hybrid Pro team.",
    "Akash will review what you shared and get back to you shortly.",
    "",
    `Your goal: ${payload.goal}`,
    "",
    `Start a free assessment: ${safeSite}/assessment`,
    "",
    "Talk soon,",
    "Akash & Hybrid Pro",
    "hello@hybridpro.fit",
  ].join("\n");

  return { subject, html, text };
}

/** Internal notification for the coaching team. */
export function buildContactNotifyEmail(payload: ContactPayload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone || "—");
  const goal = escapeHtml(payload.goal);

  const subject = `New Hybrid Pro enquiry — ${payload.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f4f4f4;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
    <tr>
      <td style="background:#111;padding:20px 24px;">
        <div style="font-family:Impact,Arial Black,sans-serif;letter-spacing:0.1em;color:${BRAND_GREEN};font-size:20px;text-transform:uppercase;">Hybrid Pro</div>
        <div style="color:#aaa;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-top:4px;">New contact submission</div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <p style="margin:0 0 12px;font-size:15px;color:#222;"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 12px;font-size:15px;color:#222;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin:0 0 12px;font-size:15px;color:#222;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#888;">Goal</p>
        <p style="margin:0;font-size:15px;line-height:1.55;color:#333;white-space:pre-wrap;">${goal}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const text = `New enquiry\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "—"}\n\nGoal:\n${payload.goal}`;

  return { subject, html, text };
}
