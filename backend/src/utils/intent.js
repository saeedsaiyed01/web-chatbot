export const detectIntent = (message) => {
  if (!message) return { intent: "UNKNOWN", params: {} };

  const text = message.toLowerCase();
  const params = {};

  // Check for price range patterns
  const priceRangeMatch = text.match(/(\d+)[-\s]*(\d+)\s*(?:range|rs|rupees|₹)/);
  if (priceRangeMatch) {
    params.minPrice = parseInt(priceRangeMatch[1]);
    params.maxPrice = parseInt(priceRangeMatch[2]);
  }

  // Check for single price patterns
  const singlePriceMatch = text.match(/(\d+)\s*(?:rs|rupees|₹)/);
  if (singlePriceMatch && !priceRangeMatch) {
    params.price = parseInt(singlePriceMatch[1]);
  }

  // Check for "between X and Y" pattern
  const betweenMatch = text.match(/between\s+(\d+)\s+and\s+(\d+)/);
  if (betweenMatch) {
    params.minPrice = parseInt(betweenMatch[1]);
    params.maxPrice = parseInt(betweenMatch[2]);
  }

  // Check for "under X" or "below X" patterns
  const underMatch = text.match(/(?:under|below|less\s+than)\s+(\d+)/);
  if (underMatch) {
    params.maxPrice = parseInt(underMatch[1]);
  }

  // Check for "over X" or "above X" patterns  
  const overMatch = text.match(/(?:over|above|more\s+than|greater\s+than)\s+(\d+)/);
  if (overMatch) {
    params.minPrice = parseInt(overMatch[1]);
  }

  // Enhanced natural language intent detection
  
  // DEALS - More flexible patterns
  if (
    text.includes("deal") ||
    text.includes("offer") ||
    text.includes("discount") ||
    text.includes("show me") && (text.includes("product") || text.includes("item") || text.includes("stuff")) ||
    text.includes("what can") && text.includes("buy") ||
    text.includes("browse") ||
    text.includes("shopping") ||
    text.includes("catalog") ||
    text.includes("products") ||
    text.includes("items")
  ) {
    return { intent: "DEALS", params };
  }
  
  // ORDERS - More flexible patterns
  if (
    text.includes("order") ||
    text.includes("history") ||
    text.includes("my order") ||
    text.includes("past order") ||
    text.includes("previous order") ||
    text.includes("track") && text.includes("order") ||
    text.includes("show me") && text.includes("order") ||
    text.includes("what did") && text.includes("order") ||
    text.includes("order status")
  ) {
    return { intent: "ORDERS", params };
  }
  
  // PAYMENTS - More flexible patterns
  if (
    text.includes("payment") ||
    text.includes("paid") ||
    text.includes("pending") ||
    text.includes("bill") ||
    text.includes("invoice") ||
    text.includes("transaction") ||
    text.includes("payment status") ||
    text.includes("money") && text.includes("status")
  ) {
    return { intent: "PAYMENTS", params };
  }
  
  // SUPPORT/HELP patterns
  if (
    text.includes("support") ||
    text.includes("help") ||
    text.includes("assist") ||
    text.includes("problem") ||
    text.includes("issue") ||
    text.includes("trouble") ||
    text.includes("confused") ||
    text.includes("don't understand") ||
    text.includes("need help")
  ) {
    return { intent: "MENU", params };
  }
  
  // REGISTER patterns
  if (
    text.includes("register") ||
    text.includes("sign up") ||
    text.includes("new user") ||
    text.includes("create account") ||
    text.includes("join")
  ) {
    return { intent: "REGISTER", params };
  }

  // Product-specific queries (if user mentions specific products)
  if (
    text.includes("watch") && (text.includes("apple") || text.includes("series")) ||
    text.includes("phone") && (text.includes("iphone") || text.includes("samsung")) ||
    text.includes("headphone") || text.includes("earbud") ||
    text.includes("macbook") || text.includes("laptop")
  ) {
    return { intent: "DEALS", params };
  }

  return { intent: "UNKNOWN", params };
};
