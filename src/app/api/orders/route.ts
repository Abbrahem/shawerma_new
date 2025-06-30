import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

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
    await connectDB();
    const body = await request.json();
    
    // Log the incoming data for debugging
    console.log('Creating order with data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.customerAddress) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, customerPhone, customerAddress' 
      }, { status: 400 });
    }
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ 
        error: 'Order must have at least one item' 
      }, { status: 400 });
    }
    
    // Validate items
    for (const item of body.items) {
      if (!item.productId || !item.name || !item.quantity || !item.price) {
        return NextResponse.json({ 
          error: 'Each item must have productId, name, quantity, and price' 
        }, { status: 400 });
      }
    }
    
    if (!body.totalAmount || body.totalAmount <= 0) {
      return NextResponse.json({ 
        error: 'Total amount must be a positive number' 
      }, { status: 400 });
    }
    
    const order = new Order({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      items: body.items,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || 'cash',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const savedOrder = await order.save();
    console.log('Order created successfully:', savedOrder._id);
    return NextResponse.json(savedOrder, { status: 201 });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error.message 
    }, { status: 500 });
  }
} 