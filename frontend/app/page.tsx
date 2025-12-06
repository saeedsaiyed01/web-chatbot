"use client";

import { useEffect, useState } from "react";
import InputBox from "./components/InputBox";
import MessageList from "./components/MessageList";
import QuickActions from "./components/QuickActions";
import TypingIndicator from "./components/TypingIndicator";
import {
  loginByPhone,
  registerUser,
  sendChatMessage,
  setToken
} from "./libs/api";
import {
  ChatReply, Message,
  User
} from "./libs/types";

type Phase = "phone" | "register" | "chat";

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("phone");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const [phoneInput, setPhoneInput] = useState("");
  const [registerForm, setRegisterForm] = useState({
    name: "",
    address: "",
    email: ""
  });

  // Clear any cached data on component mount
  useEffect(() => {
    // Clear phone input on page load
    setPhoneInput("");
    
    // Check for existing token
    const existingToken = localStorage.getItem("jwt");
    if (existingToken) {
      // User is already logged in, skip phone phase
      setPhase("chat");
    }
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: "m1",
        from: "bot",
        text: "Hi! I'm your smart shopping assistant.\nPlease enter your phone number to continue.",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  const pushMessage = (msg: Omit<Message, "id" | "createdAt">) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...msg
      }
    ]);
  };

  // ---- AUTH PHASE ----
  const handlePhoneSubmit = async () => {
    const phone = phoneInput.trim();
    if (!phone) {
      pushMessage({
        from: "bot",
        text: "Please enter a valid phone number."
      });
      return;
    }

    console.log("Sending phone number:", phone); // Debug log
    pushMessage({ from: "user", text: phone });

    try {
      const res = await loginByPhone(phone);
      console.log("Login response:", res); // Debug log
      if (res.newUser) {
        pushMessage({
          from: "bot",
          text:
            "Looks like you're new here 🎉\nPlease share your name, email and address to register."
        });
        setPhase("register");
      } else if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        pushMessage({
          from: "bot",
          text: `Welcome back, ${res.user.name}! What would you like to see today?`
        });
        setPhase("chat");
      }
    } catch (err: any) {
      console.error("Login error:", err); // Debug log
      pushMessage({
        from: "bot",
        text: "Login failed. Please try again."
      });
    }
  };

  const handleRegisterSubmit = async () => {
    const { name, address, email } = registerForm;
    if (!name || !phoneInput) return;

    pushMessage({
      from: "user",
      text: `Name: ${name}\nEmail: ${email}\nAddress: ${address}`
    });

    try {
      const res = await registerUser({
        name,
        phone: phoneInput,
        address,
        email
      });
      setUser(res.user);
      setToken(res.token);
      pushMessage({
        from: "bot",
        text: `Thanks ${res.user.name}, you're registered! 🎉\nYou can ask for "new deals", "my orders", or "payment status".`
      });
      setPhase("chat");
    } catch (err) {
      pushMessage({
        from: "bot",
        text: "Registration failed. Please try again."
      });
    }
  };

  // ---- CHAT PHASE ----
  const handleSendChat = async (text: string) => {
    pushMessage({ from: "user", text });

    setIsBotTyping(true);
    try {
      const res = await sendChatMessage(text);
      const replies = res.replies as ChatReply[];

      // small artificial delay to look nice
      setTimeout(() => {
        replies.forEach((r) => {
          if (r.type === "text") {
            pushMessage({ from: "bot", text: r.text });
          } else {
            pushMessage({ from: "bot", payload: r });
          }
        });
        setIsBotTyping(false);
      }, 500);
    } catch (err) {
      setIsBotTyping(false);
      pushMessage({
        from: "bot",
        text: "Something went wrong while talking to the server."
      });
    }
  };

  const handleQuickAction = (text: string) => {
    handleSendChat(text);
  };

  return (
    <main className="chat-container px-3 pt-4">
      <header className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400 uppercase tracking-wide">
            Smart Deals
          </div>
          <div className="text-lg font-semibold">
            Chatbot Assistant
          </div>
          {user && (
            <div className="text-xs text-slate-400">
              Logged in as {user.name} ({user.phone})
            </div>
          )}
        </div>
        <div className="text-xs text-slate-400">
          MERN Assignment Demo
        </div>
      </header>

      <MessageList messages={messages} />

      {isBotTyping && <TypingIndicator />}

      {/* Phase-based controls */}
      <div className="mt-3 space-y-2 pb-4">
        {phase === "phone" && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              Enter your phone number to continue:
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="e.g. 9876543210"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <button
                onClick={handlePhoneSubmit}
                className="text-sm bg-blue-500 px-4 rounded-lg font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {phase === "register" && (
          <div className="space-y-2 border border-slate-800 p-3 rounded-xl bg-slate-900/60">
            <div className="text-xs text-slate-400">
              Complete your registration:
            </div>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mb-2"
              placeholder="Full name"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mb-2"
              placeholder="Email (optional)"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mb-2"
              placeholder="Address (optional)"
              rows={2}
              value={registerForm.address}
              onChange={(e) =>
                setRegisterForm((f) => ({ ...f, address: e.target.value }))
              }
            />
            <button
              onClick={handleRegisterSubmit}
              className="w-full text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg"
            >
              Register & Continue
            </button>
          </div>
        )}

        {phase === "chat" && (
          <>
            <QuickActions onAction={handleQuickAction} />
            <InputBox
              placeholder="Ask me about deals, orders or payments..."
              onSend={handleSendChat}
            />
          </>
        )}
      </div>
    </main>
  );
}
