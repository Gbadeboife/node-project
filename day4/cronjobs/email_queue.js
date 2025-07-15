const db = require('../models');
const { Op } = require('sequelize');

(async () => {
  try {
    // 1. Get all active users
    const users = await db.user.findAll({ where: { status: 1 } });
    if (!users.length) return console.log('No active users');

    // 2. Determine odd/even email IDs based on day
    const today = new Date();
    const day = today.getDay(); // 0=Sunday, 1=Monday, ...
    const isOddDay = [1, 3, 5].includes(day); // Mon, Wed, Fri
    const emailWhere = isOddDay
      ? { id: { [Op.mod]: [2, 1] } } // odd ids
      : { id: { [Op.mod]: [2, 0] } }; // even ids
    const emails = await db.email.findAll({ where: emailWhere });
    if (!emails.length) return console.log('No emails for today');

    // 3. For each user and each email, insert into email_queue
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const queueEntries = [];
    for (const user of users) {
      for (const email of emails) {
        queueEntries.push({
          email_id: email.id,
          user_id: user.id,
          status: 0, // not sent
          send_at: tomorrow,
          created_at: new Date(),
          updated_at: null,
        });
      }
    }
    if (queueEntries.length) {
      await db.email_queue.bulkCreate(queueEntries);
      console.log(`Inserted ${queueEntries.length} email_queue entries for tomorrow.`);
    } else {
      console.log('No queue entries to insert.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error in email_queue cronjob:', err);
    process.exit(1);
  }
})(); 