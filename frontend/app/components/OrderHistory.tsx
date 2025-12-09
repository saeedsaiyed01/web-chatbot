"use client";
import { useEffect, useState } from "react";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  quantity: number;
  createdAt: string;
  dealId: {
    title: string;
    description: string;
    price: number;
    imageURL: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderHistory({ isOpen, onClose }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, priceRange, statusFilter, sortBy]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = orders.filter((order) => {
      const inPriceRange = order.totalAmount >= priceRange[0] && order.totalAmount <= priceRange[1];
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return inPriceRange && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "amount":
          return b.totalAmount - a.totalAmount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "confirmed":
        return "text-blue-400 bg-blue-400/10";
      case "processing":
        return "text-purple-400 bg-purple-400/10";
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-zinc-400 bg-zinc-400/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Order History</h2>
            <p className="text-sm text-zinc-400 mt-1">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (High to Low)</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setPriceRange([300, 400])}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
                >
                  ₹300-400
                </button>
                <button
                  onClick={() => setPriceRange([1000, 5000])}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
                >
                  ₹1K-5K
                </button>
                <button
                  onClick={() => setPriceRange([10000, 50000])}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
                >
                  ₹10K-50K
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-zinc-400">Loading orders...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-zinc-400">No orders found matching your criteria.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-zinc-700 rounded-lg flex-shrink-0 overflow-hidden">
                      {order.dealId?.imageURL ? (
                        <img
                          src={order.dealId.imageURL}
                          alt={order.dealId?.title || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-zinc-100 truncate">
                            {order.dealId?.title || "Unknown Product"}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                            {order.dealId?.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                            <span>Qty: {order.quantity}</span>
                            <span>•</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold text-zinc-100">
                            ₹{order.totalAmount.toLocaleString()}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">Payment:</span>
                          <span className={`text-xs font-medium ${
                            order.paymentStatus === "paid" ? "text-green-400" : 
                            order.paymentStatus === "pending" ? "text-yellow-400" : 
                            "text-red-400"
                          }`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        
                        {order.shippingAddress && (
                          <div className="text-xs text-zinc-500">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}