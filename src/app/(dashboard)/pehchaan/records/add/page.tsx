"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { IdentityStore, DocType } from "@/lib/identityStore";
import { OnboardingStore } from "@/lib/onboardingStore";
import { FileUploader } from "@/components/vault/FileUploader";
import { DocumentValidator } from "@/lib/documentValidation";

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

    const [docType, setDocType] = useState<DocType>(preselectedType || "pan");
    const [customDocName, setCustomDocName] = useState("");
    const [docNumber, setDocNumber] = useState("");
    const [nameOnDoc, setNameOnDoc] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [vaultFileId, setVaultFileId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);
    const [mismatchReason, setMismatchReason] = useState("");
    const [saved, setSaved] = useState<{ id: string; strength: number; coverage: { filled: number; total: number } } | null>(null);

    const existingDocs = IdentityStore.getDocs();
    const profileName = OnboardingStore.get().fullName || "";
    const isNameMismatched = nameOnDoc.trim().toLowerCase() !== profileName.trim().toLowerCase() && nameOnDoc.trim().length > 0;

    // FIXED: Now handles both Aadhaar numeric logic AND alphanumeric for other types
    const handleNumberChange = (val: string) => {
        setError("");
        if (docType === "aadhaar") {
            const numericValue = val.replace(/\D/g, "");
            if (numericValue.length <= 12) {
                setDocNumber(numericValue);
            }
        } else {
            // For PAN, Passport, etc., we allow standard input
            setDocNumber(val.toUpperCase()); 
        }
    };

    const handleSave = () => {
        setError("");

        if (!docType) { setError("Please select a document type."); return; }
        if (docType === "aadhaar" && docNumber.length !== 12) { 
            setError("Aadhaar must be exactly 12 digits."); 
            return; 
        }
        if (docType === "other" && !customDocName.trim()) { setError("Please provide a name for this document."); return; }
        if (!docNumber.trim()) { setError("Document number is required."); return; }
        if (!nameOnDoc.trim()) { setError("Please enter the name as printed on the document."); return; }
        if (isNameMismatched && !mismatchReason.trim()) { setError("Please provide a reason for the name mismatch."); return; }

        const valResult = DocumentValidator.validateByType(docType, docNumber);

        if (valResult.status === "invalid") {
            setError(valResult.message);
            return;
        }

        if (valResult.status === "warning" && !acknowledgedWarning) {
            setWarning(valResult.message);
            setAcknowledgedWarning(true);
            return;
        }

        try {
            const doc = IdentityStore.addDoc({
                docType,
                customDocName: docType === "other" ? customDocName.trim() : undefined,
                docNumber: valResult.normalizedValue,
                nameOnDoc: nameOnDoc.trim(),
                vaultFileId: vaultFileId || undefined,
                notes: mismatchReason ? `Name mismatch reason: ${mismatchReason}` : undefined,
            });
            
            // Calculate initial strength (higher if file is attached)
            const strength = doc.vaultFileId ? 40 : 20;
            const coverage = IdentityStore.getCoverage();
            setSaved({ id: doc.id, strength, coverage });
        } catch (e: unknown) {
            if (e instanceof Error && e.message === "DUPLICATE") {
                setError("This document already exists in your vault.");
            } else {
                setError("Something went wrong while saving to the Rajya Database.");
            }
        }
    };

    const maskedValue = docNumber && !revealed
        ? IdentityStore.maskDocNumber(docNumber, docType)
        : docNumber;

    if (saved) {
        return (
            <div className="flex flex-col min-h-screen p-6 pb-24 relative bg-slate-950">
                <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mb-5">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h1 className="text-xl font-semibold text-white">Document Added Successfully</h1>
                    <p className="text-sm text-white/40 mt-2">
                        Your Seal is now <span className="text-amber-400 font-semibold">{saved.strength}%</span> secure.
                    </p>
                    <div className="w-full mt-8 space-y-3">
                        <button onClick={() => router.push(`/pehchaan/records/doc/${saved.id}`)} className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl">Strengthen This Seal</button>
                        <button onClick={() => router.push("/pehchaan/records")} className="w-full text-white/35 py-3">Back to Vault</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-6 pb-24 relative text-white bg-slate-950">
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="flex items-center gap-3 pt-8 mb-6">
                    <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white/60" /></button>
                    <div>
                        <h1 className="text-lg font-semibold">Add a Document</h1>
                        <p className="text-xs text-white/35">Syncing with Sva-Rajya Identity Layer</p>
                    </div>
                </header>

                <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Document Type</label>
                        <div className="flex flex-wrap gap-2">
                            {DOC_TYPES.map(dt => {
                                const exists = ["aadhaar", "pan", "passport", "voter", "dl"].includes(dt.id) && existingDocs.some(d => d.docType === dt.id);
                                return (
                                    <button key={dt.id} disabled={exists} onClick={() => { setDocType(dt.id); setDocNumber(""); setError(""); }}
                                        className={`px-4 py-2 rounded-full border text-xs transition-all ${exists ? "opacity-30 grayscale" : docType === dt.id ? "bg-amber-400/10 border-amber-400 text-amber-400" : "bg-white/5 border-white/10 text-white/50"}`}>
                                        {dt.label} {exists && "✓"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Document Number</label>
                        <div className="relative">
                            <input type="text" value={revealed ? docNumber : maskedValue} onChange={e => handleNumberChange(e.target.value)} onFocus={() => setRevealed(true)} onBlur={() => setRevealed(false)}
                                placeholder={docType === "aadhaar" ? "0000 0000 0000" : "Enter number"}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 outline-none focus:border-amber-400/50" />
                            <button type="button" onClick={() => setRevealed(!revealed)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Upload Scan (PDF/PNG)</label>
                        <FileUploader folder="identity" label="Select Document File" onUploaded={(id) => setVaultFileId(id)} accept=".pdf,.png" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Name on Document</label>
                        <input type="text" value={nameOnDoc} onChange={e => setNameOnDoc(e.target.value)} placeholder="As printed on card"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400/50" />
                        {isNameMismatched && (
                            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                <p className="text-[10px] text-amber-400 mb-2">⚠ Name mismatch with Foundation Profile</p>
                                <input type="text" placeholder="Reason (e.g., Marriage, Initials)" value={mismatchReason} onChange={e => setMismatchReason(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none" />
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight">⚠ {error}</p>}
                </div>

                <div className="mt-8">
                    <button onClick={handleSave} className="w-full bg-amber-400 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-400/10">Save to Pehchaan Vault</button>
                </div>
            </div>
        </div>
    );
}

export default function AddDocument() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
            <AddDocumentForm />
        </Suspense>
    );
}
    );
}
