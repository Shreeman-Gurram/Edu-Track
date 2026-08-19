const nodemailer = require('nodemailer');

/**
 * Send a password reset email.
 *
 * In development (when SMTP is not configured), the reset URL is logged
 * to the console with a [DEV ONLY] prefix instead of sending an actual email.
 *
 * In production, uses Nodemailer with the configured SMTP transport.
 */
async function sendPasswordResetEmail({ email, resetUrl }) {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || 'noreply@edutrack.com';

  // Development fallback: log to console when SMTP is not configured
  if (!host || !user || !pass) {
    console.log('\n========================================');
    console.log('[DEV ONLY] Password Reset Email');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Password reset URL:\n${resetUrl}`);
    console.log('========================================\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"EduTrack" <${from}>`,
    to: email,
    subject: 'Password Reset Request — EduTrack',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0d6efd;">EduTrack — Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0d6efd; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="color: #6c757d; font-size: 14px;">
          This link expires in 30 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
