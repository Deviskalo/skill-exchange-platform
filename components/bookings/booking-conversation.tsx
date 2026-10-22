"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type BookingMessageItem = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  senderName: string;
};

type BookingConversationProps = {
  bookingId: string;
  currentUserId: string;
  initialMessages: BookingMessageItem[];
  canMessage: boolean;
};

export function BookingConversation({
  bookingId,
  currentUserId,
  initialMessages,
  canMessage,
}: BookingConversationProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSending(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not send message");
      }
      setMessages((current) => [...current, result]);
      setBody("");
      router.refresh();
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Could not send message"
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-5">
      <ol className="max-h-[32rem] space-y-3 overflow-y-auto" aria-live="polite">
        {messages.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            No messages yet. Use this conversation to coordinate the session.
          </li>
        ) : (
          messages.map((message) => (
            <li
              key={message.id}
              className={`max-w-[90%] rounded-lg border p-3 ${
                message.senderId === currentUserId
                  ? "ml-auto bg-secondary"
                  : "mr-auto"
              }`}
            >
              <p className="text-xs font-medium">{message.senderName}</p>
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.body}
              </p>
              <time
                className="mt-2 block text-xs text-muted-foreground"
                dateTime={message.createdAt}
              >
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(message.createdAt))}
              </time>
            </li>
          ))
        )}
      </ol>
      {canMessage ? (
        <form onSubmit={sendMessage} className="space-y-3">
          <label htmlFor="booking-message" className="block text-sm font-medium">
            Message your exchange partner
          </label>
          <Textarea
            id="booking-message"
            required
            minLength={1}
            maxLength={2000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share a question or coordinate the session."
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send message"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          This booking is closed to new messages.
        </p>
      )}
    </div>
  );
}
