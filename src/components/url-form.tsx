"use client";

import { useToast } from "@/components/ui/use-toast";
import { useIssues } from "@/hooks/use-issues";
import { urlFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import Squiggly1 from "./ui/squiggly1";
import Squiggly2 from "./ui/squiggly2";

type GithubUrlFormProps = {
  className?: string;
};

type FormValues = z.infer<typeof urlFormSchema>;

export default function GithubUrlForm({ className }: GithubUrlFormProps) {
  const [url, setUrl] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const { data: issues, error, isError, isLoading, isSuccess } = useIssues(url);

  const onSubmit = (data: FormValues) => {
    if (data.url !== url) {
      queryClient.removeQueries({ queryKey: ["github-issues"] });
      setUrl(data.url);
    }
  };

  // Handle validation errors and show toasts
  const handleValidationErrors = (errors: FieldErrors<FormValues>) => {
    Object.values(errors).forEach((error) => {
      if (error && error.message) {
        toast({
          title: "Uh Oh! Something went wrong",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Use effect for showing toasts based on query state
  useEffect(() => {
    if (isError && error instanceof Error) {
      toast({
        title: "Uh Oh! Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } else if (isSuccess) {
      toast({
        title: "Success!",
        description: "Issues fetched successfully",
      });
    }
  }, [isError, isSuccess, error, toast, issues]);

  return (
    <div className={cn("relative w-full flex justify-center", className)}>
      <div className="hidden md:block absolute -top-6 right-0 translate-y-0 translate-x-16">
        <Squiggly1 />
      </div>

      <div className="hidden md:block absolute bottom-0 left-0 translate-y-10 -translate-x-32">
        <Squiggly2 />
      </div>

      <div className="w-full max-w-3xl px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleValidationErrors)}
            className={cn(
              "relative z-10 flex items-center space-x-3 p-4 border bg-background rounded-lg shadow-lg w-full",
              className
            )}
          >
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Enter your Github repository URL"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Fetching..." : "Fetch Issues!"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
