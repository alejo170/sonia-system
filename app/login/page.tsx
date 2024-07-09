import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen md:pt-11">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-24 w-full items-end rounded-lg bg-500 p-3 md:h-36">
          <Image src="/logo.png" width={200} height={75} alt="Logo" priority />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
