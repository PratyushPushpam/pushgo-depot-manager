"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon } from "@/components/ui/icon";
import { verifyPasskey } from "@/actions/security";

interface DeleteAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteAlert({ open, onOpenChange, onConfirm }: DeleteAlertProps) {
    const [passkey, setPasskey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent auto-close
        if (!passkey) {
            setError("Passkey is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const isValid = await verifyPasskey(passkey);
            if (isValid) {
                onConfirm();
                setPasskey(""); // Reset
            } else {
                setError("Invalid Passkey! Access Denied.");
            }
        } catch (err) {
            console.error(err);
            setError("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(val) => {
            if (!val) {
                setPasskey("");
                setError("");
            }
            onOpenChange(val);
        }}>
            <AlertDialogContent className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border-none">
                <AlertDialogHeader className="text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="LockKeyhole" size={40} />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 mb-2 text-center">
                        Security Check
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-bold text-sm mb-6 text-center">
                        This action requires Superadmin authorization. Please enter the passkey to proceed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mb-6 space-y-3">
                    <input
                        type="password"
                        value={passkey}
                        onChange={(e) => {
                            setPasskey(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter Passkey"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center font-black tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400"
                    />
                    {error && (
                        <div className="text-red-500 text-xs font-black uppercase tracking-wider text-center animate-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}
                </div>

                <AlertDialogFooter className="flex gap-4 sm:justify-center w-full">
                    <AlertDialogCancel
                        disabled={loading}
                        className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all border-none"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-6 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Verify</span>
                                <Icon name="ArrowRight" size={16} strokeWidth={3} />
                            </>
                        )}
                    </button>
                    {/* Hidden default action to keep accessibility/structure if needed, but we used custom button */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
