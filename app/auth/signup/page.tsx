import Link from "next/link";
import { SignupForm } from "@/components/AuthForms";

export default function SignupPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="eyebrow">Sign Up</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Create your HirePath account</h1>
        <p className="mt-4 leading-7 text-ink/65">
          Job seekers can manage resumes and applications. Employers can create company profiles and publish jobs.
        </p>
        <p className="mt-6 text-sm font-semibold text-ink/60">
          Already registered?{" "}
          <Link href="/auth/login" className="text-mint">
            Login
          </Link>
        </p>
      </div>
      <SignupForm />
    </section>
  );
}
