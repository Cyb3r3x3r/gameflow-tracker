"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const copy = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome Back",
            cta: "Login",
            altText: "Need an account?",
            altHref: "/signup",
            altAction: "Sign up"
          }
        : {
            title: "Create Account",
            cta: "Sign Up",
            altText: "Already have an account?",
            altHref: "/login",
            altAction: "Login"
          },
    [mode]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setSuccess("Signup successful. You can now login.");
      setLoading(false);
      router.push("/login");
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-gradient px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-12 top-20 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass relative mx-auto mt-16 w-full max-w-md rounded-2xl p-6 shadow-soft"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-2 text-slate-950">
            <Sparkles size={16} />
          </div>
          <h1 className="text-xl font-semibold text-slate-100">{copy.title}</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="********"
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : copy.cta}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          {copy.altText}{" "}
          <Link href={copy.altHref} className="text-cyan-300 hover:text-cyan-200">
            {copy.altAction}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "email" | "password";
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required
        className="glass h-11 w-full rounded-xl px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
        placeholder={placeholder}
      />
    </label>
  );
}
