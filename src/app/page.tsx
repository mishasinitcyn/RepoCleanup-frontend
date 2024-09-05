import { ModeToggle } from "@/components/darkmode-toggle";
import { Hero } from "@/components/hero-section";
import GithubUrlForm from "@/components/url-form";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Github } from "lucide-react";

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <main className="relative min-h-screen overflow-hidden py-14">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Light mode background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>
        {/* Light mode background end */}

        {/* Dark mode background */}
        <div className="absolute inset-0 -z-10 h-full w-full hidden dark:block [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>
        {/* Dark mode background end */}

        <div className="absolute top-6 left-6 m-4">
          <Github className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
        </div>
        <div className="absolute top-6 right-6 m-4">
          <ModeToggle />
        </div>
        <div className="container z-10 flex flex-col items-center">
          <Hero />
          <GithubUrlForm className="w-full max-w-xl mt-5" />
        </div>
      </HydrationBoundary>
    </main>
  );
}
