"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ReportStatusActionsProps = {
  reportId: string;
  status: string;
};

export function ReportStatusActions({
  reportId,
  status,
}: ReportStatusActionsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(
    nextStatus: "reviewed" | "actioned" | "dismissed"
  ) {
    setError("");
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not update report");
      }
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update report"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm">Status: {status}</p>
      {status === "open" && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            onClick={() => updateStatus("reviewed")}
          >
            Mark reviewed
          </Button>
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => updateStatus("actioned")}
          >
            Take action
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={() => updateStatus("dismissed")}
          >
            Dismiss
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
