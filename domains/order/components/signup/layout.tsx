"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
const INCLUDED_FEATURES = [
    {
        title: "Access to GitHub Copilot",
        description:
            "Increase your productivity and accelerate software development.",
    },
    {
        title: "Unlimited repositories",
        description: "Collaborate securely on public and private projects.",
    },
    {
        title: "Integrated code reviews",
        description: "Boost code quality with built-in review tools.",
    },
    {
        title: "Automated workflows",
        description: "Save time with CI/CD integrations and GitHub Actions.",
    },
    {
        title: "Community support",
        description:
            "Connect with developers worldwide for instant feedback and insights.",
    },
] as const;

export function SingupLayout({ children }: { children: React.ReactNode }) {
    const [showIncluded, setShowIncluded] = useState(false);

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative hidden overflow-hidden bg-primary opacity-100 px-28 py-28 text-white lg:flex lg:flex-col">
                <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                        backgroundImage:
                            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6) 0, transparent 100%)," +
                            "radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.5) 0, transparent 100%)," +
                            "radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.5) 0, transparent 100%)," +
                            "radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.4) 0, transparent 100%)," +
                            "radial-gradient(1px 1px at 10% 85%, rgba(255,255,255,0.4) 0, transparent 100%)," +
                            "radial-gradient(1px 1px at 55% 90%, rgba(255,255,255,0.4) 0, transparent 100%)",
                    }}
                />

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        Create your free account
                    </h1>
                    <p className="mt-4 text-base text-white/80">
                        Explore GitHub&apos;s core features for individuals and
                        organizations.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowIncluded((v) => !v)}
                        aria-expanded={showIncluded}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
                    >
                        See what&apos;s included
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${showIncluded ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showIncluded && (
                        <ul className="mt-8 flex flex-col gap-6">
                            {INCLUDED_FEATURES.map((feature) => (
                                <li key={feature.title} className="flex gap-3">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/90" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {feature.title}
                                        </p>
                                        <p className="mt-0.5 text-sm text-white/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="pointer-events-none absolute -bottom-10 left-16 h-56 w-56 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 blur-[1px]" />
            </div>

            {children}
        </div>
    );
}


