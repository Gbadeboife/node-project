const db = require('../models');
const nodemailer = require('nodemailer');

// Set your Mailtrap credentials here
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'MAILTRAP_USER', // replace with your Mailtrap user
    pass: 'MAILTRAP_PASS', // replace with your Mailtrap pass
  },
});

(async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 1. Get all email_queue entries for today and not sent
    const queue = await db.email_queue.findAll({
      where: {
        send_at: today,
        status: 0,
      },
    });
    if (!queue.length) return console.log('No emails to send today.');

    for (const entry of queue) {
      // 2. Get user and email
      const user = await db.user.findByPk(entry.user_id);
      const email = await db.email.findByPk(entry.email_id);
      if (!user || !email) continue;
      // 3. Replace template variables
      const subject = email.subject.replace(/\{\{\{NAME\}\}\}/g, user.name).replace(/\{\{\{EMAIL\}\}\}/g, user.email);
      const body = email.body.replace(/\{\{\{NAME\}\}\}/g, user.name).replace(/\{\{\{EMAIL\}\}\}/g, user.email);
      // 4. Send email
      try {
        await transporter.sendMail({
          from: 'noreply@example.com',
          to: user.email,
          subject,
          text: body,
        });
        // 5. Mark as sent
        entry.status = 1;
        entry.updated_at = new Date();
        await entry.save();
        console.log(`Sent email to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err.message);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Error in email_sending cronjob:', err);
    process.exit(1);
  }
})(); 