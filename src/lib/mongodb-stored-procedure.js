// مثال على Stored Procedure (Aggregation Pipeline)
import clientPromise from './mongodb';

async function getOrdersWithTotal() {
  const client = await clientPromise;
  const db = client.db();
  const pipeline = [
    {
      $project: {
        customerName: 1,
        customerAddress: 1,
        total: { $sum: '$items.price' },
        items: 1
      }
    }
  ];
  const orders = await db.collection('orders').aggregate(pipeline).toArray();
  return orders;
}

export default getOrdersWithTotal;
