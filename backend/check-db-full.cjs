const { connectDB } = require('./src/database/db.js');

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to database...');
    const db = await connectDB();
    
    // Check if tables exist
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tables found:', tables.map(t => t.name));
    
    if (tables.some(t => t.name === 'promotions')) {
      console.log('✅ promotions table exists');
      
      // Check promotions
      const promotions = await db.all("SELECT id, title, isActive, startDate, endDate FROM promotions ORDER BY createdAt DESC LIMIT 5");
      console.log('🎁 Recent promotions:', promotions);
      
      // Test the exact query from service
      console.log('🧪 Testing active promotions query...');
      const activePromotions = await db.all(`
        SELECT * FROM promotions 
        WHERE isActive = 1 
        AND (startDate IS NULL OR datetime(startDate) <= datetime('now'))
        AND (endDate IS NULL OR datetime(endDate) >= datetime('now'))
        ORDER BY createdAt DESC
      `);
      console.log('🎯 Active promotions found:', activePromotions.length);
      
      if (activePromotions.length > 0) {
        console.log('✅ Active promotion sample:', activePromotions[0]);
      }
      
    } else {
      console.log('❌ promotions table does not exist');
    }
    
    await db.close();
    console.log('✅ Database check complete');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

checkDatabase();
