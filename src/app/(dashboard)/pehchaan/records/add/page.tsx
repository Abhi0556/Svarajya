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

    // 1. Logic to handle numeric formatting and length for Aadhaar
    const handleNumberChange = (val: string) => {
        setError("");
        if (docType === "aadhaar") {
            const numericValue = val.replace(/\D/g, "");
            if (numericValue.length <= 12) {
                setDocNumber(numericValue);
            }
        } else {
            setDocNumber(val);
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
            const strength = doc.vaultFileId ? 40 : 20;
            const coverage = IdentityStore.getCoverage();
            setSaved({ id: doc.id, strength, coverage });
        } catch (e: unknown) {
            if (e instanceof Error && e.message === "DUPLICATE") {
                setError("This document already exists in your vault.");
            } else {
                setError("Something went wrong.");
            }
        }
    };

    const maskedValue = docNumber && !revealed
        ? IdentityStore.maskDocNumber(docNumber, docType)
        : docNumber;

    // --- Post-save UI (Locked State) ---
    if (saved) {
        return (
            <div className="flex flex-col min-h-screen p-6 pb-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/6 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 14 }}
                        className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mb-5"
                    >
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center space-y-2 mb-6">
                        <h1 className="text-xl font-semibold text-white">Document Added Successfully</h1>
                        <p className="text-sm text-white/40">
                            Your {DOC_TYPES.find(d => d.id === docType)?.label} Seal is now <span className="text-amber-400 font-semibold">{saved.strength}%</span> secure.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Identity Coverage</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-amber-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(saved.coverage.filled / saved.coverage.total) * 100}%` }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                />
                            </div>
                            <span className="text-sm font-bold text-amber-400">{saved.coverage.filled}/{saved.coverage.total}</span>
                        </div>
                        <p className="text-xs text-white/30 mt-2">Data successfully saved to Rajya Database.</p>
                    </motion.div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={() => router.push(`/pehchaan/records/doc/${saved.id}`)}
                            className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                        >
                            Strengthen This Seal
                        </button>
                        <button
                            onClick={() => router.push("/pehchaan/records")}
                            className="w-full text-white/35 text-sm py-3 hover:text-white/55 transition-colors"
                        >
                            Back to Vault
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-6 pb-24 relative text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex items-center gap-3 pt-8 mb-6">
                    <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
                        <ArrowLeft className="w-4 h-4 text-white/60" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold">Add a Document</h1>
                        <p className="text-xs text-white/35 mt-0.5">This takes less than a minute.</p>
                    </div>
                </div>

                <div className="flex-1 space-y-5">
                    {/* Doc type chips */}
                    <div className="space-y-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider">Document Type</label>
                        <div className="flex flex-wrap gap-2">
                            {DOC_TYPES.map(dt => {
                                const isUniqueGovtId = dt.id === "aadhaar" || dt.id === "pan" || dt.id === "passport" || dt.id === "voter" || dt.id === "dl";
                                const alreadyExists = isUniqueGovtId && existingDocs.some(d => d.docType === dt.id);

                                return (
                                    <button
                                        key={dt.id}
                                        disabled={alreadyExists}
                                        onClick={() => { setDocType(dt.id); setDocNumber(""); setError(""); setWarning(""); }}
                                        className={`px-4 py-2.5 rounded-full border text-sm transition-all ${alreadyExists ? "bg-white/5 border-white/5 text-white/20" :
                                                docType === dt.id
                                                    ? "bg-amber-400/15 border-amber-400 text-amber-400"
                                                    : "bg-white/5 border-white/10 text-white/55 hover:border-white/30"
                                            }`}
                                    >
                                        {dt.label} {alreadyExists && "(Added)"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Doc number with numeric restriction for Aadhaar */}
                    <div className="space-y-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider">Document Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={revealed ? docNumber : maskedValue}
                                onChange={e => handleNumberChange(e.target.value)}
                                onFocus={() => setRevealed(true)}
                                onBlur={() => setRevealed(false)}
                                placeholder={docType === "aadhaar" ? "0000 0000 0000" : "Enter document number"}
                                className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setRevealed(!revealed)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                            >
                                {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* File Upload restricted to PNG/PDF */}
                    <div className="space-y-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider">
                            Upload Scan <span className="text-white/20 normal-case">(PDF or PNG)</span>
                        </label>
                        <FileUploader
                            folder="identity"
                            label="Select File"
                            onUploaded={(id) => setVaultFileId(id)}
                            // Ensure your FileUploader component accepts and implements these props:
                            accept=".pdf, .png"
                        />
                    </div>

                    {/* Name on doc and Mismatch logic */}
                    <div className="space-y-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider">Name on Document</label>
                        <input
                            type="text"
                            value={nameOnDoc}
                            onChange={e => { setNameOnDoc(e.target.value); setError(""); }}
                            placeholder="Full name as printed"
                            className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/60"
                        />
                        {isNameMismatched && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                <p className="text-xs text-amber-400/90 mb-2">⚠ Name differs from Foundation profile.</p>
                                <input
                                    type="text"
                                    placeholder="Reason for mismatch"
                                    value={mismatchReason}
                                    onChange={e => setMismatchReason(e.target.value)}
                                    className="w-full bg-black/40 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-100 outline-none"
                                />
                            </motion.div>
                        )}
                    </div>

                    {error && <p className="text-red-400 text-xs">⚠ {error}</p>}
                </div>

                <div className="pb-4 pt-4">
                    <button
                        onClick={handleSave}
                        className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                    >
                        Save Document
                    </button>
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