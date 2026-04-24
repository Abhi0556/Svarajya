"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [isExpiredLink, setIsExpiredLink] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Read query params from window.location to avoid CSR prerender issues with useSearchParams
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams("");
        const emailParam = params.get("email") || "";
        setEmail(emailParam);

        // Check if redirected here because of an expired token
        const errorParam = params.get("error");
        if (errorParam === "link_expired") {
            setIsExpiredLink(true);
        }
    }, []);

    const handleResend = async () => {
        if (!email.trim()) {
            setError("Email address is missing. Please go back to registration.");
            return;
        }
        setResendLoading(true);
        setError("");
        setResendSuccess(false);

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email: email.trim(),
            });
            if (resendError) throw resendError;
            setResendSuccess(true);
            setIsExpiredLink(false); // Reset expired state after re-sending
        } catch (err: unknown) {
            setError(
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message?: string }).message || "Failed to resend."
                    : "Failed to resend email. Please try again."
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/6 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-6">

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center
                    ${isExpiredLink
                        ? "bg-red-500/10 border border-red-500/25 shadow-[0_0_30px_rgba(239,68,68,0.12)]"
                        : "bg-amber-400/10 border border-amber-400/25 shadow-[0_0_30px_rgba(251,191,36,0.12)]"
                    }`}>
                    {isExpiredLink
                        ? <Clock className="w-8 h-8 text-red-400" />
                        : <Mail className="w-8 h-8 text-amber-400" />
                    }
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        {isExpiredLink ? "Link Expired" : "Check Your Email"}
                    </h1>
                    <p className="text-sm text-white/50 leading-relaxed px-2">
                        {isExpiredLink
                            ? "The verification link you used has expired (links expire in 30 minutes). Please request a new one below."
                            : <>We sent a verification link to{" "}<span className="text-amber-400 font-medium">{email || "your email"}</span>. Open it within <span className="text-amber-400 font-medium">30 minutes</span> to activate your account.</>
                        }
                    </p>
                </div>

                {/* Expired link warning box */}
                {isExpiredLink && (
                    <div className="w-full p-4 rounded-xl bg-red-500/8 border border-red-500/20 flex items-start gap-3 text-left">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-400/90 leading-relaxed">
                            Verification links expire after 30 minutes for security. Click below to get a fresh link sent to your inbox.
                        </p>
                    </div>
                )}

                {/* Steps (only shown when link not expired) */}
                {!isExpiredLink && !resendSuccess && (
                    <div className="w-full bg-white/4 border border-white/8 rounded-xl p-5 space-y-4 text-left">
                        {[
                            "Open your email inbox",
                            "Click the verification link from Svarajya",
                            "Complete your onboarding"
                        ].map((step, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-400">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-white/60">{step}</p>
                            </div>
                        ))}
                        <p className="text-[10px] text-amber-500/60 pt-1 border-t border-white/8">
                            ⏱ Link expires in 30 minutes — check your inbox promptly.
                        </p>
                    </div>
                )}

                {/* Success after resend */}
                {resendSuccess && (
                    <div className="w-full p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex items-start gap-3 text-left">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-400/90 leading-relaxed">
                            New verification link sent! Please check your inbox. Remember it expires in 30 minutes.
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                {/* Resend button */}
                <button onClick={handleResend} disabled={resendLoading}
                    className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {resendLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        : <><RefreshCw className="w-4 h-4" /> {isExpiredLink ? "Send New Verification Link" : "Resend Verification Email"}</>
                    }
                </button>

                <button onClick={() => router.push("/start")}
                    className="text-xs text-white/30 hover:text-amber-400 transition-colors">
                    Back to Login
                </button>
            </div>
        </div>
    );
}
