// مثال على Transaction و Rollback
import mongoose from 'mongoose';
import Order from '@/models/Order';
import connectDB from './mongodb';

async function createOrderWithTransaction(orderData) {
  await connectDB();
  
  const session = await mongoose.startSession();
  let result = { success: false, data: null, error: null };
  
  try {
    await session.withTransaction(async () => {
      const order = new Order(orderData);
      const savedOrder = await order.save({ session });
      result.data = savedOrder;
      result.success = true;
      // يمكنك إضافة عمليات أخرى هنا داخل نفس الترانزاكشن
    });
    console.log('Order created successfully with transaction');
  } catch (error) {
    console.error('Transaction failed, rolling back:', error);
    result.error = error.message;
    // سيتم عمل Rollback تلقائي من MongoDB
  } finally {
    await session.endSession();
  }
  return result;
}

export default createOrderWithTransaction;
