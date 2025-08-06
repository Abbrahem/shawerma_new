import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
  },
  customerAddress: {
    type: String,
    required: [true, 'Customer address is required'],
    trim: true,
  },
  location: {
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    }
  },
  items: [{
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount must be positive'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
      message: 'Status must be one of: pending, preparing, ready, delivered, cancelled'
    },
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cash', 'card'],
      message: 'Payment method must be either cash or card'
    },
    default: 'cash',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Add validation for items array
OrderSchema.path('items').validate(function(items) {
  return items && items.length > 0;
}, 'Order must have at least one item');

export default mongoose.models.Order || mongoose.model('Order', OrderSchema); 