"use server";

import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Initialize standard Supabase Client for Read Operations (respects RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SUPERADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;

export async function verifyPasskey(passkey: string): Promise<boolean> {
    if (!passkey) return false;

    try {
        // We use the standard client (anon) here because we want to respect RLS
        // or specifically rely on the "Enable read access for all users" policy.
        // However, since this is a server action, we could also use admin if we wanted to
        // keep the table private. But per instructions, we keep RLS enabled and accessible.
        const { data, error } = await supabase
            .from("app_settings")
            .select("value")
            .eq("key", "delete_passkey")
            .single();

        if (error || !data) {
            console.error("Error verifying passkey:", error);
            return false;
        }

        return data.value === passkey;
    } catch (error) {
        console.error("Unexpected error verifying passkey:", error);
        return false;
    }
}

export async function updatePasskey(newPasskey: string, userEmail: string | undefined | null) {
    // 1. App-level Authorization Check
    if (!userEmail || userEmail !== SUPERADMIN_EMAIL) {
        throw new Error("Unauthorized: Only Superadmin can update the passkey.");
    }

    if (!newPasskey || newPasskey.length < 4) {
        throw new Error("Passkey must be at least 4 characters.");
    }

    try {
        // 2. Database Update using Service Role (Bypassing RLS)
        // This fixes the "new row violates row-level security policy" error
        // because the standard client (anon) cannot write to this table due to RLS.
        const { error } = await supabaseAdmin
            .from("app_settings")
            .upsert({ key: "delete_passkey", value: newPasskey });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error updating passkey:", error);
        throw new Error("Failed to update passkey.");
    }
}

export async function checkIsSuperadmin(email: string | undefined | null) {
    return email === SUPERADMIN_EMAIL;
}
