require('dotenv').config();
const { MongoClient } = require('mongodb');

async function dropEmailIndex() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Połączono z MongoDB');
    
    const db = client.db('szoniska');
    const collection = db.collection('User');
    
    // Usuń index na polu email
    try {
      await collection.dropIndex('email_1');
      console.log('✅ Index email_1 usunięty!');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️ Index email_1 nie istnieje (to OK)');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('Błąd:', error);
  } finally {
    await client.close();
  }
}

dropEmailIndex();
