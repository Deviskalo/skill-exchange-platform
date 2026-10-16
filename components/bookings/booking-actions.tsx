"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type BookingActionsProps = {
  bookingId: string;
  isTeacher: boolean;
  status: string;
};

export function BookingActions({
  bookingId,
  isTeacher,
  status,
}: BookingActionsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateBooking(
    action: "confirm" | "decline" | "cancel" | "complete"
  ) {
    setError("");
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not update booking");
      }
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update booking"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (status !== "pending" && status !== "confirmed") {
    return <span className="text-sm text-muted-foreground">No actions</span>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {isTeacher && status === "pending" && (
          <>
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => updateBooking("confirm")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => updateBooking("decline")}
            >
              Decline
            </Button>
          </>
        )}
        {isTeacher && status === "confirmed" && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => updateBooking("complete")}
          >
            Mark completed
          </Button>
        )}
        {(!isTeacher || status === "confirmed") && (
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            onClick={() => updateBooking("cancel")}
          >
            Cancel
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="max-w-48 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
