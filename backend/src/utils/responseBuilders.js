export const buildTextMessage = (text) => ({
  type: "text",
  text
});

export const buildDealsPayload = (deals) => ({
  type: "deals",
  deals: deals.map((d) => ({
    id: d._id,
    title: d.title,
    description: d.description,
    price: d.price,
    imageURL: d.imageURL
  }))
});

export const buildOrdersPayload = (orders) => ({
  type: "orders",
  orders: orders.map((order) => ({
    _id: order._id,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    quantity: order.quantity,
    createdAt: order.createdAt,
    dealId: order.dealId ? {
      title: order.dealId.title,
      description: order.dealId.description,
      price: order.dealId.price,
      imageURL: order.dealId.imageURL
    } : null,
    shippingAddress: order.shippingAddress
  }))
});

export const buildPaymentsPayload = (payments) => ({
  type: "payments",
  payments
});
