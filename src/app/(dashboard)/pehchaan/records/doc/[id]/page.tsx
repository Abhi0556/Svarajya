"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Link2, Bell, Edit3, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { IdentityStore, calcSealStrength, IdentityDoc, ContactPoint } from "@/lib/identityStore";
import { OnboardingStore } from "@/lib/onboardingStore";
import { SealStrengthRing } from "@/components/identity/SealStrengthRing";
import { FileUploader } from "@/components/vault/FileUploader";
import { validateControlledEmail, validateIndianMobile } from "@/lib/contactValidation";

const VERIFICATION_OPTIONS = [
    { value: "not_verified", label: "Not Verified" },
    { value: "self", label: "Self" },
    { value: "govt", label: "Govt" },
    { value: "ca", label: "CA" },
    { value: "agent", label: "Agent" },
    { value: "family", label: "Family" },
];

export default function DocDetail() {
    const router = useRouter();
    const params = useParams();
    const docId = params.id as string;

    const [doc, setDoc] = useState<IdentityDoc | undefined>(undefined);
    const [contacts, setContacts] = useState<ContactPoint[]>([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formState, setFormState] = useState({
        dobOnDoc: "",
        expiryDate: "",
        issueDate: "",
        placeOfIssue: "",
        linkedMobileId: "",
        linkedEmailId: "",
        notes: "",
        verification: "not_verified"
    });

    const [newMobile, setNewMobile] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [saved, setSaved] = useState(false);
    const [contactError, setContactError] = useState("");
    const [dateError, setDateError] = useState("");
    const [dateWarning, setDateWarning] = useState("");
    const [acknowledgedDateWarning, setAcknowledgedDateWarning] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        IdentityStore.seedFromOnboarding();
        const initialDoc = IdentityStore.getDoc(docId);
        const initialContacts = IdentityStore.getContacts();
        
        if (initialDoc) {
            setDoc(initialDoc);
            setContacts(initialContacts);
            
            const mobiles = initialContacts.filter(c => c.type === "mobile");
            const emails = initialContacts.filter(c => c.type === "email");

            setFormState({
                dobOnDoc: initialDoc.dobOnDoc || "",
                expiryDate: initialDoc.expiryDate || "",
                issueDate: initialDoc.issueDate || "",
                placeOfIssue: initialDoc.placeOfIssue || "",
                linkedMobileId: initialDoc.linkedMobileId || (mobiles.length > 0 ? mobiles[0].id : ""),
                linkedEmailId: initialDoc.linkedEmailId || (emails.length > 0 ? emails[0].id : ""),
                notes: initialDoc.notes || "",
                verification: initialDoc.verificationStatus || "not_verified"
            });
        }
        setLoading(false);
    }, [docId]);

    if (loading) return null;
    if (!doc) return <div className="text-white p-10">Record not found.</div>;

    const links = IdentityStore.getLinksForDoc(docId);
    const strength = calcSealStrength(doc, links);
    const foundationDob = OnboardingStore.get().dob;

    const handleAddContact = (type: 'mobile' | 'email') => {
        const value = type === 'mobile' ? newMobile : newEmail;
        const result = type === 'mobile' ? validateIndianMobile(value) : validateControlledEmail(value);

        if (!result.valid) {
            setContactError(result.message || `Invalid format.`);
            return;
        }

        try {
            const cp = IdentityStore.addContact(type, result.normalized);
            setFormState(prev => ({ 
                ...prev, 
                [type === 'mobile' ? 'linkedMobileId' : 'linkedEmailId']: cp.id 
            }));
            type === 'mobile' ? setNewMobile("") : setNewEmail("");
            setContactError("");
            setContacts(IdentityStore.getContacts());
        } catch (e) {
            setContactError("Error adding contact.");
        }
    };

    const handleSave = () => {
        let errorMsg = "";
        let warningMsg = "";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (formState.issueDate) {
            const iDate = new Date(formState.issueDate);
            if (iDate > today) errorMsg = "Issue date is in the future.";
            else if (foundationDob && iDate < new Date(foundationDob)) errorMsg = "Issue date is before birth.";
        }

        if (formState.expiryDate && !errorMsg) {
            if (new Date(formState.expiryDate) < today) warningMsg = "Document is expired.";
        }

        if (errorMsg) { setDateError(errorMsg); return; }
        if (warningMsg && !acknowledgedDateWarning) {
            setDateWarning(warningMsg);
            setAcknowledgedDateWarning(true);
            return;
        }

        IdentityStore.updateDoc(docId, {
            ...formState,
            verificationStatus: formState.verification as IdentityDoc["verificationStatus"],
        });

        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen p-6 pb-24 relative bg-slate-950">
            <div className="relative z-10">
                <header className="flex items-center gap-3 pt-8 mb-6">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-white/60" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-white">{doc.customDocName || doc.docType.toUpperCase()}</h1>
                    </div>
                    <SealStrengthRing percentage={strength} size={52} label="Seal" />
                </header>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    <ActionButton icon={<Link2 />} label="Link" onClick={() => {}} />
                    <ActionButton icon={<Bell />} label="Remind" onClick={() => {}} />
                    <ActionButton icon={<Edit3 />} label={editing ? "Cancel" : "Edit"} onClick={() => setEditing(!editing)} active={editing} />
                </div>

                <div className="space-y-6">
                    <section className="grid grid-cols-2 gap-4">
                        <InputField label="DOB on Doc" type="date" value={formState.dobOnDoc} disabled={!editing} onChange={(v: string) => setFormState(s => ({...s, dobOnDoc: v}))} />
                        <InputField label="Expiry" type="date" value={formState.expiryDate} disabled={!editing} onChange={(v: string) => setFormState(s => ({...s, expiryDate: v}))} />
                    </section>

                    <ContactSelect 
                        label="Linked Mobile" 
                        value={formState.linkedMobileId} 
                        options={contacts.filter(c => c.type === "mobile")} 
                        editing={editing}
                        newValue={newMobile}
                        onNewValueChange={(v: string) => setNewMobile(v)}
                        onAdd={() => handleAddContact('mobile')}
                        onSelect={(v: string) => setFormState(s => ({...s, linkedMobileId: v}))}
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-6">
                    {editing && (
                        <button onClick={handleSave} className="w-full bg-amber-400 text-slate-950 font-bold py-4 rounded-2xl">
                            Update Seal
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- FIXED SUB-COMPONENTS WITH TYPES ---

interface ActionBtnProps { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; }
function ActionButton({ icon, label, onClick, active }: ActionBtnProps) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${active ? 'border-amber-400 bg-amber-400/10' : 'border-white/10'}`}>
            <span className={active ? 'text-amber-400' : 'text-white/40'}>{icon}</span>
            <span className="text-[10px] font-bold text-white/40">{label}</span>
        </button>
    );
}

interface InputProps { label: string; type: string; value: string; onChange: (v: string) => void; disabled: boolean; }
function InputField({ label, type, value, onChange, disabled }: InputProps) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white" />
        </div>
    );
}

interface ContactProps { 
    label: string; value: string; options: ContactPoint[]; editing: boolean; 
    newValue: string; onNewValueChange: (v: string) => void; onAdd: () => void; onSelect: (v: string) => void; 
}
function ContactSelect({ label, value, options, editing, newValue, onNewValueChange, onAdd, onSelect }: ContactProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase">{label}</label>
            <select value={value} onChange={e => onSelect(e.target.value)} disabled={!editing}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white">
                <option value="">Select...</option>
                {options.map(c => <option key={c.id} value={c.id}>{c.value}</option>)}
            </select>
            {editing && (
                <div className="flex gap-2">
                    <input value={newValue} onChange={e => onNewValueChange(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 text-xs text-white" />
                    <button onClick={onAdd} className="text-amber-400 text-[10px] font-bold">LINK</button>
                </div>
            )}
        </div>
    );
}