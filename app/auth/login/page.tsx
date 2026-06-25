import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="eyebrow">Login</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Welcome back to HirePath</h1>
        <p className="mt-4 leading-7 text-ink/65">
          Use the demo accounts in the seeded data or create a new account from the signup page.
        </p>
        <p className="mt-6 text-sm font-semibold text-ink/60">
          New here?{" "}
          <Link href="/auth/signup" className="text-mint">
            Create an account
          </Link>
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
