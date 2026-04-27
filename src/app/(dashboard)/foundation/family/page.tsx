"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";
import { FamilyTreeGame, FamilyMember } from "@/components/module1/FamilyTreeGame";
import { OnboardingStore } from "@/lib/stores/onboardingStore";
import { useToast } from "@/components/providers/ToastProvider";
import dynamic from "next/dynamic";

const VideoTutorialPlaceholder = dynamic(() => import("@/components/ui/VideoTutorialPlaceholder").then(mod => mod.VideoTutorialPlaceholder), { ssr: false });

export default function Submodule1B() {
    const router = useRouter();
    const existingFamily = OnboardingStore.get().familyMembers || [];
    const [step, setStep] = useState<"tutorial" | "mandal" | "win">("tutorial");
    const [members, setMembers] = useState<FamilyMember[]>(existingFamily as FamilyMember[]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    // Fetch existing family members from database on page load
    useEffect(() => {
        let isMounted = true;
        const fetchFamilyMembers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/profile');
                if (!isMounted) return;
                
                if (response.ok) {
                    const json = await response.json();
                    const profileData = json?.data;
                    console.log("Fetched profile data:", profileData);
                    
                    if (profileData?.familyMembers && profileData.familyMembers.length > 0) {
                        // Transform API format back to component format
                        const loadedMembers = profileData.familyMembers.map((member: any, index: number) => ({
                            id: member.id || `member-${index}`,
                            name: member.name || "",
                            relationship: member.relation || "Other", // relation -> relationship
                            dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : "",
                            phone: member.phone || "",
                            email: member.email || "",
                            dependent: member.isDependent === true, // isDependent -> dependent
                            nomineeEligible: member.nomineeEligible ?? true,
                            accessRole: member.accessLevel === "write" ? "Executor" : 
                                       member.accessLevel === "read" ? "Viewer" : 
                                       member.accessLevel === "emergency" ? "Emergency-only" : "None", // accessLevel -> accessRole
                        }));
                        console.log("Loaded members from DB:", loadedMembers);
                        setMembers(loadedMembers);
                        OnboardingStore.set({ familyMembers: loadedMembers }, { sync: false });
                        setStep("mandal");
                    } else {
                        console.log("No family members found in database");
                    }
                } else {
                    console.log("Failed to fetch profile:", response.status);
                }
            } catch (err) {
                console.error('Failed to load family members:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        
        fetchFamilyMembers();
        return () => { isMounted = false; };
    }, []);

    const handleAddMember = useCallback((memberData: Omit<FamilyMember, "id">) => {
        console.log("Adding new member:", memberData);
        
        // Max 5 members validation
        if (members.length >= 5) {
            toast("Maximum 5 family members allowed.", "error");
            return;
        }
        
        // Mobile validation (10 digits)
        if (memberData.phone && !/^\d{10}$/.test(memberData.phone)) {
            toast("Mobile number must be exactly 10 digits.", "error");
            return;
        }
        
        // Email validation (@gmail.com)
        if (memberData.email && !memberData.email.endsWith("@gmail.com")) {
            toast("Email must be @gmail.com", "error");
            return;
        }
        
        const newMember = { ...memberData, id: Math.random().toString(36).substr(2, 9) };
        // IMPORTANT: Appends to existing members using spread operator
        const updatedMembers = [...members, newMember];
        console.log("Total members after adding:", updatedMembers.length);
        setMembers(updatedMembers);
    }, [members, toast]);

    const handleRemoveMember = useCallback((id: string) => {
        const updatedMembers = members.filter(m => m.id !== id);
        console.log("Member removed. Remaining:", updatedMembers.length);
        setMembers(updatedMembers);
    }, [members]);

    const handleSealMandal = useCallback(async () => {
        try {
            console.log("Saving ALL members to database. Total:", members.length);
            
            // Transform ALL family members to match API expected format
            const transformedMembers = members.map(member => ({
                name: member.name,
                relation: member.relationship, // relationship -> relation
                dob: member.dob,
                isDependent: member.dependent, // dependent -> isDependent
                nomineeEligible: member.nomineeEligible ?? true,
                accessLevel: member.accessRole === "Executor" ? "write" :
                            member.accessRole === "Viewer" ? "read" :
                            member.accessRole === "Emergency-only" ? "emergency" : "read", // accessRole -> accessLevel
                phone: member.phone || "",
                email: member.email || "",
            }));

            console.log("Sending to API:", transformedMembers);

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    familyMembers: transformedMembers, // Sends ALL current members
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API error:", errorData);
                throw new Error(errorData.message || 'Failed to save family members');
            }

            const responseData = await response.json();
            console.log("API success:", responseData);

            // Save to local store
            OnboardingStore.set({ familyMembers: members });
            toast(`${members.length} family member(s) saved successfully`, 'success');
            setStep("win");
        } catch (error) {
            console.error('Error saving family members:', error);
            toast(error instanceof Error ? error.message : 'Failed to save family members. Please try again.', 'error');
        }
    }, [members, toast]);

    const handleFinish = useCallback(() => {
        router.push('/foundation/education');
    }, [router]);

    const dependencyCount = members.filter(m => m.dependent).length;
    const loadIndex = members.length > 0 ? Math.round((dependencyCount / members.length) * 100) : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen relative p-6">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-amber-400 text-center">
                        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/60">Loading your family members...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen relative p-6">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1628] to-slate-950 pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 pt-8 mb-6">
                    <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
                        <ArrowLeft className="w-4 h-4 text-white/60" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-white">Family Members</h1>
                        <p className="text-xs text-white/35 mt-0.5">Who depends on you financially?</p>
                        {members.length > 0 && (
                            <p className="text-xs text-amber-400 mt-1">{members.length}/5 members added</p>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* TUTORIAL T1 */}
                    {step === "tutorial" && (
                        <motion.div
                            key="tutorial"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-12 flex flex-col justify-center"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Family Members — Step 2 of 4</h2>
                                        <p className="text-xs text-white/50 mt-0.5">Add up to 5 members</p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/55 leading-relaxed">
                                    Indian financial planning is deeply family-linked. Knowing who depends on you helps us prioritise your insurance and nomination coverage correctly.
                                </p>
                            </div>

                            <VideoTutorialPlaceholder youtubeId="hU0V-FwTmWk" label="Why family planning matters for financial protection" />

                            <button
                                onClick={() => setStep("mandal")}
                                className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                            >
                                Add Family Members
                            </button>
                        </motion.div>
                    )}

                    {/* 1B GAME: FAMILY TREE UI */}
                    {step === "mandal" && (
                        <motion.div
                            key="mandal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 flex flex-col pt-4 pb-20 justify-between"
                        >
                            <FamilyTreeGame
                                members={members}
                                onAddMember={handleAddMember}
                                onRemoveMember={handleRemoveMember}
                            />

                            <div className="pt-8">
                                <button
                                    onClick={handleSealMandal}
                                    className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                                >
                                    Save & Continue ({members.length}/5 members)
                                </button>
                                {members.length === 0 && (
                                    <p className="text-xs text-center text-white/40 mt-2">
                                        You can skip this step and add family members later.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* IMMEDIATE INSIGHT - DEPENDENCY LOAD */}
                    {step === "win" && (
                        <motion.div
                            key="win"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col justify-center space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                                <h2 className="text-2xl font-semibold text-white">Family Added</h2>
                                <p className="text-white/40 text-sm">{members.length} member(s) in your Mandal</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                                <h3 className="text-xs uppercase tracking-widest text-amber-400 mb-3">Financial Dependency Summary</h3>
                                <div className="flex items-end justify-center gap-2 mb-4">
                                    <span className="text-5xl font-bold text-white">{dependencyCount}</span>
                                    <span className="text-base text-white/50 mb-1">dependants identified</span>
                                </div>

                                {dependencyCount > 0 ? (
                                    <div className="text-left bg-red-500/8 border border-red-500/20 p-4 rounded-xl flex gap-3">
                                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-red-400 mb-1">Insurance Gap Detected</p>
                                            <p className="text-xs text-white/50">
                                                {loadIndex}% of your family are financially dependent on you. We&apos;ll prioritise life and health insurance coverage in your next steps.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/50 px-4 py-2">
                                        No financial dependants. Your planning focus will be personal growth and investments.
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleFinish}
                                className="w-full bg-amber-400 text-black font-semibold py-4 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                            >
                                Next: Education & Qualifications
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}