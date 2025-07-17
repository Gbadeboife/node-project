const axios = require('axios');
const db = require('./models');
const { shopifyUrl } = require('./services/shopifyService');

async function fetchAndStoreShopifyCustomers() {
  try {
    // Shopify API endpoint for customers
    const url = `${shopifyUrl}/admin/api/2022-01/customers.json?limit=250`;
    const response = await axios.get(url);
    const customers = response.data.customers;
    for (const customer of customers) {
      // Check if customer already exists
      const exists = await db.customer.findOne({
        where: { shopify_customer_id: customer.id.toString() },
      });
      if (!exists) {
        await db.customer.create({
          shopify_customer_id: customer.id.toString(),
          shopify_customer_email: customer.email || '',
        });
        console.log(`Added customer ${customer.id}`);
      } else {
        console.log(`Customer ${customer.id} already exists.`);
      }
    }
    console.log('Shopify customer sync complete.');
  } catch (err) {
    console.error('Error syncing Shopify customers:', err.message);
  } finally {
    await db.sequelize.close();
  }
}

fetchAndStoreShopifyCustomers(); 