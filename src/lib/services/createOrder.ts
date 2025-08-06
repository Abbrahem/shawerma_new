import mongoose from 'mongoose';
import Order from '@/models/Order';
import connectDB from '@/lib/mongodb';
import createOrderWithTransactionDB from '../mongodb-transaction-example';
import getOrdersWithTotal from '../mongodb-stored-procedure';
import { formatOrderAddress } from '../orderFunction';

// دالة إنشاء الطلب مع transaction و rollback
export async function createOrderWithTransaction(orderData: any): Promise<any> {
  await connectDB();
  // تنسيق العنوان باستخدام function
  orderData.customerAddress = formatOrderAddress(orderData);
  // إنشاء الطلب باستخدام transaction و rollback
  const result: any = await createOrderWithTransactionDB(orderData);
  return result;
}

// دالة لجلب الطلبات مع الإجمالي (stored procedure)
export async function getOrdersWithTotalProcedure() {
  await connectDB();
  const orders = await getOrdersWithTotal();
  return orders;
}
