"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center">
      <div>
        <h1 className="mb-4 font-bold text-2xl">Log in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
