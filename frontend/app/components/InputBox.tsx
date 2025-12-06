"use client";

import { FormEvent, useState } from "react";

type Props = {
  disabled?: boolean;
  placeholder?: string;
  onSend: (text: string) => Promise<void> | void;
};

export default function InputBox({
  disabled = false,
  placeholder,
  onSend
}: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    await onSend(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center border border-zinc-800 bg-transparent rounded-lg px-4 py-2"
    >
      <input
        className="flex-1 bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="text-zinc-400 hover:text-zinc-100 disabled:opacity-40 transition-colors p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </form>
  );
}
