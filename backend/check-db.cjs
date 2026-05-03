const { connectDB } = require('./src/database/db.js');

async function checkTables() {
  try {
    const db = await connectDB();
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables found:', tables.map(t => t.name));
    
    if (tables.some(t => t.name === 'promotions')) {
      const promotions = await db.all("SELECT id, title, isActive, startDate, endDate FROM promotions ORDER BY createdAt DESC LIMIT 5");
      console.log('Recent promotions:', promotions);
    } else {
      console.log('❌ promotions table does not exist');
    }
    
    await db.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();
