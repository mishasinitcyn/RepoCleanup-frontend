import GithubUrlForm from '@/components/url-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4'>
      <h1>Welcome to RepoCleanup!</h1>
      <GithubUrlForm className='w-full max-w-xl' />
    </main>
  );
}
