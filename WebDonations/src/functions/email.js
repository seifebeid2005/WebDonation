// donationEmailService.js - A unified email service for donation platform

const CONFIG = {
  API_KEY:
    "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",
  API_URL: "https://api.brevo.com/v3/smtp/email",
  DEFAULT_SENDER: {
    name: "Donation Platform",
    email: "seif.amr.ebeid@gmail.com",
  },
};

/**
 * Email templates for donation platform
 */
const TEMPLATES = {
  // Donation confirmation template
  DONATION_CONFIRMATION: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .highlight { color: #27ae60; font-weight: bold; }
            .donation-info { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .impact { background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #27ae60; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Thank You for Your Donation!</h1>
            <p>Dear ${data.donorName},</p>
            <p>We are incredibly grateful for your generous contribution. Your support makes a real difference and helps us continue our mission.</p>
            
            <div class="donation-info">
              <p><strong>Donation Details:</strong></p>
              <p>Amount: <span class="highlight">EGP ${data.amount}</span></p>
              <p>Date: ${new Date(data.donationDate).toLocaleString()}</p>
              <p>Reference ID: ${data.referenceId}</p>
              ${data.causeName ? `<p>Cause: ${data.causeName}</p>` : ""}
              ${
                data.isRecurring
                  ? `<p>Type: Recurring (${data.recurringFrequency})</p>`
                  : "<p>Type: One-time</p>"
              }
            </div>
            
            <div class="impact">
              <h3>Your Impact</h3>
              <p>Your donation will help us ${
                data.impactStatement ||
                "make a difference in the lives of those who need it most."
              }. Thank you for being part of this journey.</p>
            </div>
            
            <p>If you have any questions about your donation, please don't hesitate to contact us.</p>
            <p>With heartfelt thanks,</p>
            <p>The Donation Platform Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Tax receipt template
  TAX_RECEIPT: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .highlight { color: #27ae60; font-weight: bold; }
            .receipt { border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
            .receipt-header { border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
            .receipt-id { font-size: 20px; font-weight: bold; color: #2c3e50; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Donation Receipt</h1>
            <p>Dear ${data.donorName},</p>
            <p>Thank you for your generous donation. This email serves as your official receipt for tax purposes.</p>
            
            <div class="receipt">
              <div class="receipt-header">
                <p class="receipt-id">Receipt #: ${data.receiptNumber}</p>
                <p>Date: ${new Date(data.donationDate).toLocaleDateString()}</p>
              </div>
              
              <p><strong>Donor Information:</strong></p>
              <p>Name: ${data.donorName}</p>
              <p>Email: ${data.donorEmail}</p>
              ${data.donorAddress ? `<p>Address: ${data.donorAddress}</p>` : ""}
              
              <p><strong>Donation Information:</strong></p>
              <p>Amount: <span class="highlight">EGP ${data.amount.toFixed(
                2
              )}</span></p>
              <p>Date: ${new Date(data.donationDate).toLocaleDateString()}</p>
              <p>Reference ID: ${data.referenceId}</p>
              ${data.causeName ? `<p>Cause: ${data.causeName}</p>` : ""}
              ${
                data.paymentMethod
                  ? `<p>Payment Method: ${data.paymentMethod}</p>`
                  : ""
              }
              
              <p><strong>Organization Information:</strong></p>
              <p>Donation Platform</p>
              <p>123 Charity Street, Cairo, Egypt</p>
              <p>Registration #: 987654321</p>
            </div>
            
            <p>Please keep this receipt for your tax records. If you have any questions, please contact our donor support team.</p>
            <p>Thank you for your support!</p>
            <p>Donation Platform Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Campaign update template
  CAMPAIGN_UPDATE: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .highlight { color: #27ae60; font-weight: bold; }
            .progress-bar-container { background-color: #f1f1f1; border-radius: 10px; margin: 20px 0; }
            .progress-bar { background-color: #27ae60; height: 20px; border-radius: 10px; }
            .stats { display: flex; justify-content: space-between; margin: 20px 0; }
            .stat { text-align: center; flex: 1; }
            .stat-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .stat-label { font-size: 14px; color: #7f8c8d; }
            .update-image { max-width: 100%; height: auto; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${data.campaignName} - Update</h1>
            <p>Dear ${data.donorName},</p>
            <p>We wanted to share an update on the campaign you've supported. Thanks to generous donors like you, we're making great progress!</p>
            
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${
                data.progressPercentage
              }%;"></div>
            </div>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-value">EGP ${data.amountRaised.toLocaleString()}</div>
                <div class="stat-label">Raised</div>
              </div>
              <div class="stat">
                <div class="stat-value">EGP ${data.goalAmount.toLocaleString()}</div>
                <div class="stat-label">Goal</div>
              </div>
              <div class="stat">
                <div class="stat-value">${data.donorCount}</div>
                <div class="stat-label">Donors</div>
              </div>
            </div>
            
            ${
              data.updateImage
                ? `<img src="${data.updateImage}" alt="Campaign Update" class="update-image">`
                : ""
            }
            
            <h3>What's Happening Now</h3>
            <p>${data.updateMessage}</p>
            
            <p>Your support continues to make this possible. Thank you for being part of our community of change-makers.</p>
            
            <p>With gratitude,<br>The ${data.campaignName} Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Recurring donation reminder template
  RECURRING_DONATION_REMINDER: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .highlight { color: #27ae60; font-weight: bold; }
            .donation-info { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .button { display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Upcoming Recurring Donation</h1>
            <p>Dear ${data.donorName},</p>
            <p>We hope this email finds you well. This is a friendly reminder that your recurring donation is scheduled to process in ${
              data.daysUntilCharge
            } days on ${new Date(data.nextChargeDate).toLocaleDateString()}.</p>
            
            <div class="donation-info">
              <p><strong>Recurring Donation Details:</strong></p>
              <p>Amount: <span class="highlight">EGP ${data.amount.toFixed(
                2
              )}</span></p>
              <p>Frequency: ${data.frequency}</p>
              <p>Next Charge Date: ${new Date(
                data.nextChargeDate
              ).toLocaleDateString()}</p>
              ${data.causeName ? `<p>Cause: ${data.causeName}</p>` : ""}
              <p>Payment Method: ${
                data.paymentMethod || "Card ending in " + data.lastFourDigits
              }</p>
            </div>
            
            <p>Your continued support is making a significant impact. If you need to update your payment information or adjust your recurring donation, you can do so by visiting your account dashboard.</p>
            
            <a href="${
              data.accountLink
            }" class="button">Manage Your Donations</a>
            
            <p>Thank you for your ongoing generosity!</p>
            <p>With gratitude,<br>Donation Platform Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Welcome email for new donors
  WELCOME_DONOR: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .highlight { color: #27ae60; font-weight: bold; }
            .welcome-section { background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #27ae60; }
            .button { display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .causes { display: flex; justify-content: space-between; margin: 20px 0; flex-wrap: wrap; }
            .cause { width: 30%; text-align: center; margin-bottom: 15px; }
            .cause img { max-width: 100%; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Donation Platform!</h1>
            <p>Dear ${data.donorName},</p>
            <p>Thank you for joining our community of donors making a positive impact in the world. We're thrilled to have you with us!</p>
            
            <div class="welcome-section">
              <h3>What Happens Next?</h3>
              <p>Your account has been created, and you can now:</p>
              <ul>
                <li>Explore causes that align with your values</li>
                <li>Set up recurring donations to provide sustained support</li>
                <li>Track your giving history and impact</li>
                <li>Connect with other donors and share your giving journey</li>
              </ul>
            </div>
            
            <h3>Causes You Might Be Interested In</h3>
            <div class="causes">
              ${data.suggestedCauses
                .map(
                  (cause) => `
                <div class="cause">
                  <img src="${cause.image}" alt="${cause.name}">
                  <p><strong>${cause.name}</strong></p>
                </div>
              `
                )
                .join("")}
            </div>
            
            <p>Visit your donor dashboard to get started on your giving journey:</p>
            <a href="${
              data.dashboardLink
            }" class="button">Go to My Dashboard</a>
            
            <p>If you have any questions or need assistance, our donor support team is here to help.</p>
            <p>Thank you for your compassion and generosity!</p>
            <p>Warmly,<br>The Donation Platform Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Password reset template
  PASSWORD_RESET: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .button { display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 4px; }
            .warning { color: #e74c3c; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>Hello ${data.donorName},</p>
            <p>We received a request to reset the password for your Donation Platform account. To complete the process, please click the button below:</p>
            <p style="text-align: center;">
              <a href="${data.resetLink}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 24 hours.</p>
            <p class="warning">If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
            <p>Best regards,<br>Donation Platform Security Team</p>
            <div class="footer">
              <p>This email was sent to ${data.donorEmail}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,

  // Contact form response template
  CONTACT_RESPONSE: (data) => `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>We've Received Your Message</h1>
            <p>Dear ${data.name},</p>
            <p>Thank you for reaching out to us. We have received your message and will respond as soon as possible.</p>
            
            <div class="message-box">
              <p><strong>Your message:</strong></p>
              <p>${data.message.replace(/\n/g, "<br>")}</p>
              <p><strong>Submitted on:</strong> ${new Date(
                data.submittedAt
              ).toLocaleString()}</p>
            </div>
            
            <p>Our team typically responds within 24-48 hours during business days. If your matter is urgent, please call our donor support line at (123) 456-7890.</p>
            <p>Thank you for your patience and support.</p>
            <p>Best regards,<br>Donation Platform Support Team</p>
            <div class="footer">
              <p>This email was sent to ${data.email}</p>
              <p>© ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
};

export const sendEmail = async ({
  templateType,
  templateData = {},
  recipientEmail,
  subject,
  sender = CONFIG.DEFAULT_SENDER,
}) => {
  // Validate required parameters
  if (!templateType || !TEMPLATES[templateType]) {
    throw new Error(`Invalid or missing template type: ${templateType}`);
  }

  if (!recipientEmail) {
    throw new Error("Recipient email is required");
  }

  if (!subject) {
    throw new Error("Subject is required");
  }

  // Generate HTML content from template
  const htmlContent = TEMPLATES[templateType](templateData);

  try {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CONFIG.API_KEY,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: recipientEmail }],
        subject,
        htmlContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    return {
      success: true,
      messageId: result.messageId,
      templateType,
      recipientEmail,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

/**
 * Convenience functions for specific email types
 */

// Send donation confirmation email
export const sendDonationConfirmationEmail = async (donorEmail, amount) => {
  return sendEmail({
    templateType: "DONATION_CONFIRMATION",
    templateData: {
      donorName: "Donor",
      donorEmail,
      amount,
      donationDate: new Date(),
      referenceId: "123456",
      causeName: "General Fund",
      impactStatement:
        "provide food and shelter to those in need during the crisis.",
    },
    recipientEmail: donorEmail,
    amount,
    subject: "Thank You for Your Donation",
  });
};

// Send tax receipt email
export const sendTaxReceiptEmail = async ({
  donorName,
  donorEmail,
  donorAddress,
  amount,
  donationDate,
  referenceId,
  receiptNumber,
  causeName,
  paymentMethod,
}) => {
  return sendEmail({
    templateType: "TAX_RECEIPT",
    templateData: {
      donorName,
      donorEmail,
      donorAddress,
      amount,
      donationDate,
      referenceId,
      receiptNumber,
      causeName,
      paymentMethod,
    },
    recipientEmail: donorEmail,
    subject: `Donation Receipt #${receiptNumber}`,
  });
};

// Send campaign update email
export const sendCampaignUpdateEmail = async ({
  donorName,
  donorEmail,
  campaignName,
  updateMessage,
  amountRaised,
  goalAmount,
  donorCount,
  progressPercentage,
  updateImage,
}) => {
  return sendEmail({
    templateType: "CAMPAIGN_UPDATE",
    templateData: {
      donorName,
      donorEmail,
      campaignName,
      updateMessage,
      amountRaised,
      goalAmount,
      donorCount,
      progressPercentage,
      updateImage,
    },
    recipientEmail: donorEmail,
    subject: `Update on ${campaignName}`,
  });
};

// Send recurring donation reminder
export const sendRecurringDonationReminderEmail = async ({
  donorName,
  donorEmail,
  amount,
  frequency,
  nextChargeDate,
  daysUntilCharge,
  causeName,
  paymentMethod,
  lastFourDigits,
  accountLink,
}) => {
  return sendEmail({
    templateType: "RECURRING_DONATION_REMINDER",
    templateData: {
      donorName,
      donorEmail,
      amount,
      frequency,
      nextChargeDate,
      daysUntilCharge,
      causeName,
      paymentMethod,
      lastFourDigits,
      accountLink,
    },
    recipientEmail: donorEmail,
    subject: "Upcoming Recurring Donation Reminder",
  });
};

// Send welcome email for new donors
export const sendWelcomeDonorEmail = async ({
  donorName,
  donorEmail,
  suggestedCauses,
  dashboardLink,
}) => {
  return sendEmail({
    templateType: "WELCOME_DONOR",
    templateData: {
      donorName,
      donorEmail,
      suggestedCauses,
      dashboardLink,
    },
    recipientEmail: donorEmail,
    subject: "Welcome to Donation Platform!",
  });
};

// Send password reset email
export const sendPasswordResetEmail = async ({
  donorName,
  donorEmail,
  resetLink,
}) => {
  return sendEmail({
    templateType: "PASSWORD_RESET",
    templateData: {
      donorName,
      donorEmail,
      resetLink,
    },
    recipientEmail: donorEmail,
    subject: "Reset Your Password",
  });
};

// Send contact form response
export const sendContactResponseEmail = async ({
  name,
  email,
  message,
  submittedAt,
}) => {
  return sendEmail({
    templateType: "CONTACT_RESPONSE",
    templateData: {
      name,
      email,
      message,
      submittedAt,
    },
    recipientEmail: email,
    subject: "We've Received Your Message",
  });
};
