"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { urlFormSchema } from "@/lib/schema";

async function fetchRepoIssues(inputUrl: string) {
  const url = new URL(inputUrl);
  const [, owner, repo] = url.pathname.split("/");

  return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`);
}

type GithubUrlFormProps = {
  className?: string;
};

export default function GithubUrlForm({ className }: GithubUrlFormProps) {
  const form = useForm<z.infer<typeof urlFormSchema>>({
    resolver: zodResolver(urlFormSchema),
  });

  const [invalidRepoError, setInvalidRepoError] = useState(false);

  async function onSubmit(data: z.infer<typeof urlFormSchema>) {
    try {
      const res = await fetchRepoIssues(data.url);

      if (res.status == 404) {
        setInvalidRepoError(true);
        return;
      }

      console.log(await res.json());
    } catch {
      console.log("An unexpected error occured, please try again later.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-2", className)}
        >
          <div className="flex gap-x-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl onChange={() => setInvalidRepoError(false)}>
                    <Input placeholder="Enter the Github URL here" {...field} />
                  </FormControl>
                  <FormMessage />
                  {!form.formState.errors.url && invalidRepoError && (
                    <FormMessage>Repository does not exist</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.getValues("url")}>
              Fetch Issues
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
