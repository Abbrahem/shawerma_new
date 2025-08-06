import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { createOrderWithTransaction } from '@/lib/services/createOrder';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.customerName || !body.customerPhone || !body.customerAddress) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, customerPhone, customerAddress' 
      }, { status: 400 });
    }

    const result = await createOrderWithTransaction(body);

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create order', details: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
  }
}
 