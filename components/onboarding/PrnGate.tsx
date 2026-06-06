"use client";

import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatPrn, isValidPrn } from "@/lib/prn";

type PrnGateProps = {
  onVerified: (prn: string) => void;
};

export function PrnGate({ onVerified }: PrnGateProps) {
  const [prn, setPrn] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = isValidPrn(prn);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (valid) {
      onVerified(prn);
    }
  }

  return (
    <main className="min-h-screen px-5 py-8 text-slate-50 sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-loop-blue/35 bg-loop-blue/15 shadow-glow-blue">
              <GraduationCap className="h-7 w-7 text-loop-blue" />
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-normal text-white sm:text-7xl">
              LoopIn
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              A closed-campus ride feed for Symbiosis students. Drivers post
              commutes, nearby classmates tap in, and pickups stay under driver
              control.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-[28px] bg-glass-sheen p-6 shadow-neo-panel sm:p-8"
          >
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-loop-green/30 bg-loop-green/15 shadow-glow-green">
                <ShieldCheck className="h-6 w-6 text-loop-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Verify student access
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sign-up requires a valid 11-digit college Permanent
                  Registration Number.
                </p>
              </div>
            </div>

            <label className="text-sm font-semibold text-slate-300" htmlFor="prn">
              Permanent Registration Number
            </label>
            <input
              id="prn"
              inputMode="numeric"
              maxLength={11}
              value={prn}
              onBlur={() => setTouched(true)}
              onChange={(event) => setPrn(formatPrn(event.target.value))}
              placeholder="22070143021"
              className="mt-3 w-full rounded-2xl border border-loop-line bg-loop-ink/70 px-5 py-4 text-xl font-bold tracking-[0.24em] text-white shadow-neo-pressed outline-none transition focus:border-loop-blue focus:shadow-glow-blue"
            />
            <div className="mt-3 min-h-6 text-sm">
              {touched && !valid ? (
                <p className="text-loop-danger">
                  PRN must contain exactly 11 digits.
                </p>
              ) : (
                <p className="text-slate-500">Example format: 11 numeric digits.</p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 2 }}
              className="pressable mt-7 w-full rounded-2xl border border-loop-blue/40 bg-loop-blue px-5 py-4 text-base font-black text-loop-ink shadow-neo-button disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              disabled={!valid}
            >
              Enter LoopIn
            </motion.button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
