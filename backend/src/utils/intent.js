export const detectIntent = (message) => {
  if (!message) return "UNKNOWN";

  const text = message.toLowerCase();

  if (
    text.includes("deal") ||
    text.includes("offer") ||
    text.includes("discount")
  ) {
    return "DEALS";
  }
  if (text.includes("order") || text.includes("history")) {
    return "ORDERS";
  }
  if (
    text.includes("payment") ||
    text.includes("paid") ||
    text.includes("pending")
  ) {
    return "PAYMENTS";
  }
  if (
    text.includes("register") ||
    text.includes("sign up") ||
    text.includes("new user")
  ) {
    return "REGISTER";
  }
  if (text.includes("help") || text.includes("menu")) {
    return "MENU";
  }

  return "UNKNOWN";
};
