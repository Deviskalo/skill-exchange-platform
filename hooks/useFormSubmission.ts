import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type SubmissionOptions<T> = {
  endpoint: string;
  successMessage: string;
  errorMessage?: string;
  redirectPath?: string | ((response: T) => string);
};

export function useFormSubmission<T>() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: any, options: SubmissionOptions<T>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(options.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.error || options.errorMessage || "Submission failed"
        );
      }

      const result = (await response.json()) as T;

      toast({
        title: "Success",
        description: options.successMessage,
      });

      if (options.redirectPath) {
        const redirectUrl =
          typeof options.redirectPath === "function"
            ? options.redirectPath(result)
            : options.redirectPath;
        router.push(redirectUrl);
      }

      return result;
    } catch (error) {
      console.error("Submission error:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
}
