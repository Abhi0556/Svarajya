"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { IdentityStore, DocType } from "@/lib/identityStore";
import { OnboardingStore } from "@/lib/onboardingStore";
import { FileUploader } from "@/components/vault/FileUploader";
import { DocumentValidator } from "@/lib/documentValidation";

/**
 * PEHCHAAN: ADD DOCUMENT MODULE
 * Handles visual masking, Aadhaar-specific formatting, and name mismatch logic.
 */

const DOC_TYPES: { id: DocType; label: string }[] = [
    { id: "aadhaar", label: "Aadhaar" },
    { id: "pan", label: "PAN" },
    { id: "passport", label: "Passport" },
    { id: "dl", label: "Driving License" },
    { id: "voter", label: "Voter ID" },
    { id: "other", label: "Other" },
];

function AddDocumentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedType = searchParams.get("type") as DocType | null;

    // Form State
    const [docType, setDocType] = useState<DocType>(preselectedType || "pan");
    const [customDocName, setCustomDocName] = useState("");
    const [docNumber, setDocNumber] = useState("");
    const [nameOnDoc, setNameOnDoc] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [vaultFileId, setVaultFileId] = useState<string | null>(null);
    
    // UI/UX State
    const [error, setError] = useState("");
    const [mismatchReason, setMismatchReason] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState<{ id: string; strength: number; coverage: any } | null>(null);

    const existingDocs = IdentityStore.getDocs();
    const profileName = OnboardingStore.get().fullName || "";
    const isNameMismatched = nameOnDoc.trim().toLowerCase() !== profileName.trim().toLowerCase() && nameOnDoc.trim().length > 0;

    /**
     * Handles Aadhaar spacing (0000 0000 0000) and general uppercase transformation
     */
    const handleNumberChange = (val: string) => {
        setError("");
        if (docType === "aadhaar") {
            const digits = val.replace(/\D/g, "");
            if (digits.length <= 12) {
                const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                setDocNumber(formatted);
            }
        } else {
            setDocNumber(val.toUpperCase()); 
        }
    };

    /**
     * Persists the document to the Local-First Identity Store
     */
    const handleSave = async () => {
        setError("");
        setIsSaving(true);
        const cleanNumber = docNumber.replace(/\s/g, ""); 

        // 1. Structural Validation
        if (!docType) { setError("Please select a document type."); setIsSaving(false); return; }
        if (docType === "aadhaar" && cleanNumber.length !== 12) { 
            setError("Aadhaar must be exactly 12 digits."); 
            setIsSaving(false);
            return; 
        }
        if (docType === "other" && !customDocName.trim()) { setError("Please provide a name for this custom document."); setIsSaving(false); return; }
        if (!cleanNumber.trim()) { setError("Document number is required."); setIsSaving(false); return; }
        if (!nameOnDoc.trim()) { setError("Please enter the name exactly as printed."); setIsSaving(false); return; }
        if (isNameMismatched && !mismatchReason.trim()) { setError("A reason for the name mismatch is required for the audit trail."); setIsSaving(false); return; }

        // 2. Pattern Validation (Checksum/Regex)
        const valResult = DocumentValidator.validateByType(docType, cleanNumber);
        if (valResult.status === "invalid") {
            setError(valResult.message);
            setIsSaving(false);
            return;
        }

        try {
            // 3. Store Injection
            const doc = IdentityStore.addDoc({
                docType,
                customDocName: docType === "other" ? customDocName.trim() : undefined,
                docNumber: cleanNumber, 
                nameOnDoc: nameOnDoc.trim(),
                vaultFileId: vaultFileId || undefined,
                notes: mismatchReason ? `Audit Note: Name mismatch corrected via user input. Reason: ${mismatchReason}` : undefined,
            });
            
            // Artificial delay for high-fidelity feel
            setTimeout(() => {
                setSaved({ 
                    id: doc.id, 
                    strength: doc.vaultFileId ? 45 : 25, 
                    coverage: IdentityStore.getCoverage() 
                });
                setIsSaving(false);
            }, 800);
            
        } catch (e: any) {
            setError(e.message === "DUPLICATE" ? "This document already exists in your Sva-Rajya Vault." : "An error occurred during secure persistence.");
            setIsSaving(false);
        }
    };

    const maskedValue = docNumber && !revealed
        ? IdentityStore.maskDocNumber(docNumber, docType)
        : docNumber;

    if (saved) {
        return (
            <div className="flex flex-col min-h-screen p-6 items-center justify-center bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent opacity-50" />
                
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 15 }} 
                    className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center mb-6 relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-white relative z-10">Identity Seal Secured</h1>
                <p className="text-white/40 mt-3 max-w-[280px] relative z-10">
                    Your <span className="text-white font-medium uppercase">{docType}</span> has been encrypted and added to your Pehchaan Vault.
                </p>

                <div className="mt-10 w-full max-w-sm space-y-4 relative z-10">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                        <span className="text-xs text-white/50">Seal Strength</span>
                        <span className="text-amber-400 font-bold">{saved.strength}%</span>
                    </div>
                    
                    <button onClick={() => router.push(`/pehchaan/records/doc/${saved.id}`)} className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 rounded-xl transition-all active:scale-95">
                        Enhance This Seal
                    </button>
                    <button onClick={() => router.push("/pehchaan/records")} className="w-full text-white/30 hover:text-white/60 py-2 text-sm transition-colors">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-6 pb-24 bg-slate-950 text-white selection:bg-amber-400/30">
            <header className="flex items-center gap-4 pt-8 mb-8">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/70" />
                </button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Add Document</h1>
                    <p className="text-[10px] text-amber-400/60 uppercase tracking-[0.2em] font-semibold">Secure Pehchaan Layer</p>
                </div>
            </header>

            <div className="flex-1 space-y-8 max-w-md mx-auto w-full">
                {/* Type Selection */}
                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Select Identity Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DOC_TYPES.map(dt => {
                            const exists = ["aadhaar", "pan"].includes(dt.id) && existingDocs.some(d => d.docType === dt.id);
                            return (
                                <button key={dt.id} disabled={exists} onClick={() => { setDocType(dt.id); setDocNumber(""); setError(""); }}
                                    className={`px-5 py-2.5 rounded-xl border text-xs font-medium transition-all ${exists ? "opacity-20 cursor-not-allowed grayscale" : docType === dt.id ? "bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.1)]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"}`}>
                                    {dt.label} {exists && "✓"}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Number Input */}
                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Document Number</label>
                    <div className="relative group">
                        <input type="text" value={revealed ? docNumber : maskedValue} onChange={e => handleNumberChange(e.target.value)} onFocus={() => setRevealed(true)} onBlur={() => setRevealed(false)}
                            placeholder={docType === "aadhaar" ? "0000 0000 0000" : "Enter identification number"}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-white/10 outline-none focus:border-amber-400/40 transition-all group-hover:border-white/20" />
                        <button type="button" onClick={() => setRevealed(!revealed)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                            {revealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </section>

                {/* Upload Section */}
                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Official Digital Scan</label>
                    <FileUploader folder="identity" label="Upload PDF or Image" onUploaded={(id) => setVaultFileId(id)} accept=".pdf,.png,.jpg,.jpeg" />
                </section>

                {/* Name Mapping */}
                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Full Name (on Document)</label>
                    <input type="text" value={nameOnDoc} onChange={e => setNameOnDoc(e.target.value)} placeholder="Exactly as printed"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400/40 transition-all" />
                    
                    <AnimatePresence>
                        {isNameMismatched && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} 
                                className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl overflow-hidden">
                                <div className="flex items-start gap-3 mb-3">
                                    <Info className="w-4 h-4 text-amber-400 mt-0.5" />
                                    <p className="text-[11px] text-amber-200/70 leading-relaxed">The name provided differs from your Foundation Profile. Please provide a reason (e.g., Initials, Marriage) for our record integrity.</p>
                                </div>
                                <input type="text" placeholder="Reason for mismatch..." value={mismatchReason} onChange={e => setMismatchReason(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/30" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {error && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> {error}
                    </motion.p>
                )}
            </div>

            <footer className="mt-auto pt-10 sticky bottom-0 bg-slate-950/80 backdrop-blur-md pb-6">
                <button onClick={handleSave} disabled={isSaving} className="w-full bg-amber-400 disabled:opacity-50 disabled:grayscale text-slate-950 font-bold py-5 rounded-2xl shadow-[0_10px_30px_rgba(201,162,39,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Encrypting Seal...
                        </>
                    ) : (
                        "Verify & Secure Seal"
                    )}
                </button>
            </footer>
        </div>
    );
}

export default function AddDocument() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>}>
            <AddDocumentForm />
        </Suspense>
    );
}
