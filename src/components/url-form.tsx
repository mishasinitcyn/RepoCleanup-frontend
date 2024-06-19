"use client";

import { useToast } from "@/components/ui/use-toast";
import { urlFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import Squiggly1 from "./ui/squiggly1";
import Squiggly2 from "./ui/squiggly2";

async function fetchRepoIssues(inputUrl: string) {
  const url = new URL(inputUrl);
  const [, owner, repo] = url.pathname.split("/");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  );
  return response;
}

type GithubUrlFormProps = {
  className?: string;
};

export default function GithubUrlForm({ className }: GithubUrlFormProps) {
  const form = useForm<z.infer<typeof urlFormSchema>>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof urlFormSchema>) {
    console.log("Form submitted with data:", data);
    try {
      const res = await fetchRepoIssues(data.url);

      if (res.status === 404) {
        toast({
          title: "Uh oh! Repository does not exist",
          description: "Make sure the repo is public and exists on Github",
        });
        return;
      }

      console.log(await res.json());
      toast({
        title: "Success!",
        description: "Issues fetched successfully",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong",
        description:
          "There was a problem with your request. Please try again later",
      });
    }
  }

  // Handle validation errors and show toasts
  const handleValidationErrors = (errors: any) => {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        console.log(errors);
        toast({
          title: "Uh oh! Something went wrong",
          description: errors[key].message,
        });
      }
    }
  };

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

            <Button type="submit">Fetch Issues!</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
