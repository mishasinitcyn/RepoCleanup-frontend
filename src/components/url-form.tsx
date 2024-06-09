'use client';

import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import ErrorAlert from './error-alert';
import { useState } from 'react';

const formSchema = z.object({
  url: z
    .string()
    .min(1, 'Field Required')
    .regex(
      /^(https:\/\/)(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/,
      // /^(https:\/\/)(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+.*\/?$/, // This regex includes the possibility of having a path & query params after the repo name
      'Not a valid Github Repo URL'
    ),
});

async function fetchRepoIssues(inputUrl: string) {
  const url = new URL(inputUrl);
  const [, owner, repo] = url.pathname.split('/');

  return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`);
}

interface GithubUrlFormProps {
  className?: string;
}

export default function GithubUrlForm({ className }: GithubUrlFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [invalidRepoError, setInvalidRepoError] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await fetchRepoIssues(data.url);

      if (res.status == 404) {
        setInvalidRepoError(true);
        return;
      }

      console.log(await res.json());
    } catch {
      console.log('An unexpected error occured, please try again later.');
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('space-y-2', className)}
        >
          {(form.formState.errors.url && (
            <ErrorAlert>{form.formState.errors.url.message}</ErrorAlert>
          )) ||
            (invalidRepoError && (
              <ErrorAlert>Repository does not exist</ErrorAlert>
            ))}
          <div className='flex gap-x-4'>
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem className='grow'>
                  <FormControl onChange={() => setInvalidRepoError(false)}>
                    <Input placeholder='Enter the Github URL here' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type='submit' disabled={!form.getValues('url')}>
              Fetch
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
