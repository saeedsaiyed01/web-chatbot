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
  orders
});

export const buildPaymentsPayload = (payments) => ({
  type: "payments",
  payments
});
