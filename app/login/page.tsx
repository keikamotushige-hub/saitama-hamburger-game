import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-zinc-500">
          読み込み中...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
