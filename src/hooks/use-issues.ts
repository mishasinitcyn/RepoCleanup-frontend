"use client";

import { urlFormSchema } from "@/lib/schema";
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import { useQuery } from "@tanstack/react-query";

type ListIssuesResponseData =
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"];

// Initialize Octokit without authentication
const octokit = new Octokit();

// Helper function to extract owner and repo from URL
const extractRepoInfo = (url: string): { owner: string; repo: string } => {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }
  return { owner: match[1], repo: match[2] };
};

// Fetch issues function
const fetchIssues = async (url: string): Promise<ListIssuesResponseData> => {
  const { owner, repo } = extractRepoInfo(url);

  try {
    // Fetch repository details
    const { data: repoData } = await octokit.repos.get({ owner, repo });

    if (repoData.private) {
      throw new Error("This repository is private. Access denied.");
    }

    // Fetch issues
    const { data: issuesData } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "open",
      per_page: 100, // Adjust as needed
    });

    return issuesData;
  } catch (error) {
    if (error instanceof RequestError) {
      // Handle Octokit-specific errors
      switch (error.status) {
        case 404:
          throw new Error(
            "Repository not found or is private. Please check the URL and try again."
          );
        case 403:
          throw new Error(
            "Access forbidden. This might be due to API rate limiting or lack of permissions."
          );
        case 401:
          throw new Error(
            "Authentication failed. Please check your credentials."
          );
        default:
          throw new Error(
            `GitHub API Error: ${error.message} (Status: ${error.status})`
          );
      }
    } else if (error instanceof Error) {
      // Handle other known error cases
      if (error.message.includes("API rate limit exceeded")) {
        throw new Error(
          "GitHub API rate limit exceeded. Please try again later."
        );
      }
      // Re-throw other errors
      throw error;
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred");
    }
  }
};

export const useIssues = (url: string) => {
  return useQuery({
    queryKey: ["github-issues", url],
    queryFn: () => fetchIssues(url),
    enabled: url.trim() !== "" && urlFormSchema.safeParse({ url }).success,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry if the error is due to invalid URL, private repo, or authentication issues
      if (error instanceof Error) {
        if (
          error.message.includes("Invalid GitHub repository URL") ||
          error.message.includes("This repository is private") ||
          error.message.includes("Authentication failed")
        ) {
          return false;
        }
      }

      // Retry on network errors or rate limiting, up to 3 times
      if (error instanceof RequestError) {
        if (
          error.status === 403 ||
          error.status === 429 ||
          error.status >= 500
        ) {
          return failureCount < 3;
        }
      }

      // Don't retry for other errors
      return false;
    },
    refetchOnWindowFocus: false,
  });
};
