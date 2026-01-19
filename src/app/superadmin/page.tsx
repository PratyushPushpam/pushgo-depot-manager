"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/icon";
import { updatePasskey, checkIsSuperadmin } from "@/actions/security";

export default function SuperadminPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [session, setSession] = useState<any>(null);
    const [newPasskey, setNewPasskey] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.email) {
                verifySuperadmin(session.user.email);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.email) {
                verifySuperadmin(session.user.email);
            } else {
                setIsAuthorized(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const verifySuperadmin = async (email: string) => {
        const isSuper = await checkIsSuperadmin(email);
        setIsAuthorized(isSuper);
        if (!isSuper) {
            setMessage({ type: 'error', text: "Access Denied: You are not the Superadmin." });
            await supabase.auth.signOut();
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Using OTP login for simplicity without password setup
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/superadmin`,
            },
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Magic link sent! Check your email." });
        }
        setLoading(false);
    };

    const handleUpdatePasskey = async () => {
        if (!newPasskey) return;
        setLoading(true);
        try {
            await updatePasskey(newPasskey, session?.user?.email);
            setMessage({ type: 'success', text: "Passkey updated successfully!" });
            setNewPasskey("");
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthorized(false);
        setSession(null);
    };

    if (session && isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <Icon name="ShieldCheck" size={32} className="text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Superadmin Panel</h1>
                            <p className="text-slate-400 text-sm">Manage Security Settings</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Logged in as</label>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono text-indigo-400 break-all">
                            {session.user.email}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Update Delete Passkey</label>
                            <input
                                type="text"
                                value={newPasskey}
                                onChange={(e) => setNewPasskey(e.target.value)}
                                placeholder="Enter new passkey"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-center tracking-widest text-lg"
                            />
                        </div>

                        <button
                            onClick={handleUpdatePasskey}
                            disabled={loading || !newPasskey}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Passkey"}
                        </button>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800">
                        <button onClick={handleLogout} className="w-full text-slate-500 hover:text-white text-sm font-medium transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon name="LockKeyhole" size={32} className="text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Superadmin Access</h1>
                    <p className="text-slate-500 mt-2">Enter your authorized email to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="superadmin@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? "Sending Magic Link..." : "Send Login Link"}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
