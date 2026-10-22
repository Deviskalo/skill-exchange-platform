"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BookingRequestFormProps = {
  skillId: string;
};

function getLocalMinimumDateTime() {
  const minimum = new Date(Date.now() + 60_000);
  minimum.setMinutes(minimum.getMinutes() - minimum.getTimezoneOffset());
  return minimum.toISOString().slice(0, 16);
}

export function BookingRequestForm({ skillId }: BookingRequestFormProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId,
          startTime: new Date(startTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not request this session");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not request this session"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitRequest} className="space-y-3">
      <div>
        <label htmlFor="booking-start-time" className="mb-2 block text-sm font-medium">
          Requested start time
        </label>
        <Input
          id="booking-start-time"
          type="datetime-local"
          required
          value={startTime}
          min={getLocalMinimumDateTime()}
          onChange={(event) => setStartTime(event.target.value)}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Sessions are one hour. The selected time uses your local time zone (
          {Intl.DateTimeFormat().resolvedOptions().timeZone}). Your request stays
          pending until the teacher responds.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending request..." : "Request a session"}
      </Button>
    </form>
  );
}
