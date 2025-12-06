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
      className="flex gap-2 items-center border border-slate-700 bg-slate-900 rounded-full px-3 py-1"
    >
      <input
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
