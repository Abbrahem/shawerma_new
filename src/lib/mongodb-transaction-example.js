// مثال على Transaction و Rollback
import clientPromise from './mongodb';

async function createOrderWithTransaction(orderData) {
  const client = await clientPromise;
  const session = client.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const db = client.db();
      result = await db.collection('orders').insertOne(orderData, { session });
      // يمكنك إضافة عمليات أخرى هنا داخل نفس الترانزاكشن
    });
    console.log('Order created successfully with transaction');
  } catch (error) {
    console.error('Transaction failed, rolling back:', error);
    // سيتم عمل Rollback تلقائي من MongoDB
  } finally {
    await session.endSession();
  }
  return result;
}

export default createOrderWithTransaction;
