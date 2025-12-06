"use client";

import { ChatReply, Deal, User } from "./types";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

let token: string | null = null;

export const setToken = (t: string | null) => {
  token = t;
  if (typeof window !== "undefined" && t) {
    localStorage.setItem("jwt", t);
  }
};

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
};

const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  if (token || getStoredToken()) {
    headers["Authorization"] = `Bearer ${token || getStoredToken()}`;
  }
  return headers;
};

export const loginByPhone = async (phone: string) => {
  const res = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json() as Promise<{
    newUser: boolean;
    user?: User;
    token?: string;
    message?: string;
  }>;
};

export const registerUser = async (data: {
  name: string;
  phone: string;
  address?: string;
  email?: string;
}) => {
  const res = await fetch(`${baseURL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json() as Promise<{ user: User; token: string }>;
};

export const sendChatMessage = async (
  message: string
): Promise<{ intent: string; replies: ChatReply[] }> => {
  const res = await fetch(`${baseURL}/chat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
};

export const fetchDeals = async (): Promise<Deal[]> => {
  const res = await fetch(`${baseURL}/deals`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
};
