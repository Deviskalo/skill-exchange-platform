"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ReportSkillFormProps = {
  skillId: string;
};

export function ReportSkillForm({ skillId }: ReportSkillFormProps) {
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, reason, details }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not submit report");
      }
      setMessage(result.message);
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not submit report"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return <p className="text-sm text-muted-foreground">{message}</p>;
  }

  return (
    <form onSubmit={submitReport} className="space-y-3">
      <label htmlFor="report-reason" className="block text-sm font-medium">
        Why are you reporting this listing?
      </label>
      <select
        id="report-reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="spam">Spam</option>
        <option value="misleading">Misleading or inappropriate listing</option>
        <option value="harassment">Harassment or safety concern</option>
        <option value="other">Other</option>
      </select>
      <Textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        maxLength={500}
        placeholder="Optional details (up to 500 characters)"
        aria-label="Report details"
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="outline" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit report"}
      </Button>
    </form>
  );
}
