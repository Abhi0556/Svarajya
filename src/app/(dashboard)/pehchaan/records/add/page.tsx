"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Edit3 } from "lucide-react";
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

interface ExistingDocument {
    id: string;
    idType: string;
    numberMasked: string;
    expiryDate: string | null;
    issuedDate: string | null;
}

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

    
    // New state for database documents
    const [dbDocuments, setDbDocuments] = useState<ExistingDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [existingDoc, setExistingDoc] = useState<ExistingDocument | null>(null);

    const profileName = OnboardingStore.get().fullName || "";
    const isNameMismatched = profileName.trim().length > 0 && nameOnDoc.trim().length > 0 && nameOnDoc.trim().toLowerCase() !== profileName.trim().toLowerCase();

    // Fetch documents from database on mount
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('/api/identity');
                if (response.ok) {
                    const data = await response.json();
                    const docs = data.data || [];
                    setDbDocuments(docs);
                    
                    // Check if document of selected type already exists
                    const existing = docs.find((d: ExistingDocument) => 
                        d.idType.toUpperCase() === docType.toUpperCase()
                    );
                    setExistingDoc(existing || null);
                }
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDocuments();
    }, [docType]);

    // When switching document types, check if it exists
    const handleDocTypeChange = (newType: DocType) => {
        setDocType(newType);
        // Update URL to reflect selected document type
        router.push(`/pehchaan/records/add?type=${newType}`, { scroll: false });
        
        const existing = dbDocuments.find((d: ExistingDocument) => 
            d.idType.toUpperCase() === newType.toUpperCase()
        );
        setExistingDoc(existing || null);
        setEditing(false);
        // Reset form
        setDocNumber("");
        setNameOnDoc("");
        setError("");
        setWarning("");
        setAcknowledgedWarning(false);
    };

    // Handle save for both new and existing documents
    const handleSaveDocument = async () => {
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

        // Generate numberMasked (last 4 digits)
        const numberMasked = docNumber.slice(-4);

        try {
            // If editing existing document
            if (editing && existingDoc) {
                const payload = {
                    expiryDate: null,
                    issuedDate: null,
                };

                const response = await fetch(`/api/identity/${existingDoc.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API error response:', errorData);
                    setError(errorData.error || 'Failed to update document');
                    return;
                }

                // Navigate back to records after successful edit
                router.push("/pehchaan/records");
                return;
            }

            // If adding new document
            const payload = {
                idType: docType.toUpperCase(),
                numberMasked,
                expiryDate: null,
                issuedDate: null,
            };

            console.log('Submitting document to API:', payload);

            const response = await fetch('/api/identity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                setError(errorData.error || 'Failed to save document');
                return;
            }

            const data = await response.json();
            console.log('Document saved successfully:', data);

            // Update local store as well for UI consistency
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
            console.error('Error saving document:', e);
            if (e instanceof Error && e.message === "DUPLICATE") {
                setError("This document already exists in your vault.");
            } else {
                setError("Something went wrong while saving.");
            }
        }
    };

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

    const maskedValue = docNumber && !revealed
        ? IdentityStore.maskDocNumber(docNumber, docType)
        : docNumber;

    const formatDateForDisplay = (dateString: string | null) => {
        if (!dateString) return "Not specified";
        try {
            return new Date(dateString).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen p-6 pb-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
                <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
                    />
                    <p className="text-white/40 text-sm mt-4">Loading document...</p>
                </div>
            </div>
        );
    }

    // --- Read-Only View for Existing Document (when not editing) ---
    if (existingDoc && !editing) {
        return (
            <div className="flex flex-col min-h-screen p-6 pb-24 relative text-white">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <div className="flex items-center gap-3 pt-8 mb-6">
                        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
                            <ArrowLeft className="w-4 h-4 text-white/60" />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold">{DOC_TYPES.find(d => d.id === docType)?.label || "Document"}</h1>
                            <p className="text-xs text-white/35 mt-0.5">Your saved document</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-5 mb-6">
                        {/* Document Type - Read Only */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-wider">Document Type</label>
                            <div className="px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white">
                                {DOC_TYPES.find(d => d.id === docType)?.label}
                            </div>
                        </div>

                        {/* Document Number - Read Only */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-wider">Document Number</label>
                            <div className="px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white/70 flex items-center justify-between">
                                <span>****{existingDoc.numberMasked}</span>
                                <Eye className="w-4 h-4 text-white/30" />
                            </div>
                        </div>

                        {/* Issued Date - Read Only */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-wider">Issued Date</label>
                            <div className="px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white/70">
                                {formatDateForDisplay(existingDoc.issuedDate)}
                            </div>
                        </div>

                        {/* Expiry Date - Read Only */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-wider">Expiry Date</label>
                            <div className="px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white/70">
                                {formatDateForDisplay(existingDoc.expiryDate)}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mt-4">
                            <p className="text-xs text-white/50">Document is stored securely in Rajya Database</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setEditing(true)}
                            className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Document
                        </button>
                        <button
                            onClick={() => router.push("/pehchaan")}
                            className="w-full text-white/35 text-sm py-3 hover:text-white/55 transition-colors"
                        >
                            Back to Vault
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            onClick={() => router.push("/pehchaan")}
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
                    <button 
                        onClick={() => editing ? setEditing(false) : router.push("/pehchaan/records")} 
                        className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4 text-white/60" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold">
                            {editing && existingDoc ? "Edit Document" : "Add a Document"}
                        </h1>
                        <p className="text-xs text-white/35 mt-0.5">
                            {editing && existingDoc ? "Update your document details" : "This takes less than a minute."}
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-5">
                    {/* Doc type chips */}
                    <div className="space-y-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider">Document Type</label>
                        <div className="flex flex-wrap gap-2">
                            {DOC_TYPES.map(dt => {
                                const isUniqueGovtId = dt.id === "aadhaar" || dt.id === "pan" || dt.id === "passport" || dt.id === "voter" || dt.id === "dl";
                                const alreadyExists = isUniqueGovtId && dbDocuments.some(d => d.idType.toLowerCase() === dt.id);
                                const isCurrentType = dt.id === docType;

                                return (
                                    <button
                                        key={dt.id}
                                        disabled={alreadyExists && !isCurrentType}
                                        onClick={() => handleDocTypeChange(dt.id)}
                                        className={`px-4 py-2.5 rounded-full border text-sm transition-all ${
                                            alreadyExists && !isCurrentType ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed" :
                                            isCurrentType
                                                ? "bg-amber-400/15 border-amber-400 text-amber-400"
                                                : "bg-white/5 border-white/10 text-white/55 hover:border-white/30"
                                        }`}
                                    >
                                        {dt.label} {alreadyExists && !isCurrentType && "(Added)"}
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
                        onClick={handleSaveDocument}
                        className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                    >
                        {editing ? "Update Document" : "Save Document"}
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