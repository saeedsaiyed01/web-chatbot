export type User = {
  id: string;
  name: string;
  phone: string;
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
};

export type ChatReply =
  | { type: "text"; text: string }
  | { type: "deals"; deals: Deal[] }
  | { type: "orders"; orders: any[] }
  | { type: "payments"; payments: any[] };

export type Message = {
  id: string;
  from: "user" | "bot";
  text?: string;
  payload?: ChatReply;
  createdAt: string;
};
