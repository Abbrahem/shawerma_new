// مثال على إنشاء Index في MongoDB
import clientPromise from './mongodb';

async function createOrderAddressIndex() {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('orders').createIndex({ customerAddress: 1 });
  console.log('Index created on customerAddress');
}

createOrderAddressIndex();
