"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BookingActionsProps = {
  bookingId: string;
  isTeacher: boolean;
  status: string;
  isRescheduleRequester: boolean;
  proposedStartTime: string | null;
  proposedTimeZone: string | null;
};

export function BookingActions({
  bookingId,
  isTeacher,
  status,
  isRescheduleRequester,
  proposedStartTime,
  proposedTimeZone,
}: BookingActionsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");

  async function updateBooking(
    action:
      | "confirm"
      | "decline"
      | "cancel"
      | "complete"
      | "propose-reschedule"
      | "accept-reschedule"
      | "decline-reschedule",
    proposal?: { proposedStartTime: string; proposedTimeZone: string }
  ) {
    setError("");
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...proposal }),
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

  async function submitReschedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newStartTime) return;
    await updateBooking("propose-reschedule", {
      proposedStartTime: new Date(newStartTime).toISOString(),
      proposedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setShowRescheduleForm(false);
    setNewStartTime("");
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
        {status === "confirmed" && proposedStartTime && proposedTimeZone && (
          <div className="w-full rounded-md border p-3 text-sm">
            <p>
              Proposed time:{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: proposedTimeZone,
              }).format(new Date(proposedStartTime))}{" "}
              ({proposedTimeZone})
            </p>
            {isRescheduleRequester ? (
              <p className="mt-1 text-muted-foreground">Waiting for the other participant.</p>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => updateBooking("accept-reschedule")}
                >
                  Accept time
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => updateBooking("decline-reschedule")}
                >
                  Decline time
                </Button>
              </div>
            )}
          </div>
        )}
        {status === "confirmed" && !proposedStartTime && (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => setShowRescheduleForm((show) => !show)}
            >
              Propose new time
            </Button>
            {showRescheduleForm && (
              <form onSubmit={submitReschedule} className="w-full space-y-2">
                <label
                  htmlFor={`reschedule-${bookingId}`}
                  className="block text-sm font-medium"
                >
                  New start time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                </label>
                <Input
                  id={`reschedule-${bookingId}`}
                  type="datetime-local"
                  required
                  value={newStartTime}
                  onChange={(event) => setNewStartTime(event.target.value)}
                />
                <Button size="sm" type="submit" disabled={isUpdating}>
                  Send proposal
                </Button>
              </form>
            )}
          </>
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
