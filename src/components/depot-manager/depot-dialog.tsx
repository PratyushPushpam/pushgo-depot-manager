import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Depot, DepotState } from "@/types";

interface DepotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Omit<Depot, "id">) => void;
    initialData?: Depot | null;
}

export function DepotDialog({ open, onOpenChange, onSubmit, initialData }: DepotDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        state: 'Bihar' as DepotState,
        district: '',
        tlName: '',
        tlNumber: '',
        address: '',
        mapLink: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                state: (initialData.state as DepotState) || 'Bihar',
                district: initialData.district || '',
                tlName: initialData.tlName || '',
                tlNumber: initialData.tlNumber || '',
                address: initialData.address || '',
                mapLink: initialData.mapLink || ''
            });
        } else {
            setFormData({
                name: '',
                state: 'Bihar',
                district: '',
                tlName: '',
                tlNumber: '',
                address: '',
                mapLink: ''
            });
        }
    }, [initialData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-white rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                            {initialData ? 'Update Entry' : 'New Hub Registration'}
                        </DialogTitle>
                        <p className="text-slate-400 text-sm mt-1 font-bold uppercase tracking-widest">
                            Depot ID: {initialData?.id || 'Auto-generated'}
                        </p>
                    </div>
                    {/* Close button is handled by Dialog primitive automatically, but we can add a custom one if needed. 
              Shadcn DialogContent has a default close X. We'll stick to default or hide it via CSS if it clashes.
              User's design has a big custom X. Let's rely on Shadcn's default X for now or custom?
              Shadcn's default X is absolute positioned. User's is inline.
              I will hide shadcn's default X via class and use the user's layout if I can, but DialogContent enforces some structure.
              Actually, let's just use the form layout.
          */}
                </div>

                <form onSubmit={handleSubmit} className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Unique Depot Name *</label>
                            <input
                                required
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-lg placeholder:text-slate-200"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. PATNA_HUB_ALPHA"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operating Region *</label>
                            <select
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer font-black text-sm appearance-none"
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value as DepotState })}
                            >
                                <option value="Bihar">Bihar</option>
                                <option value="Jharkhand">Jharkhand</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">District Branch</label>
                            <input
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm placeholder:text-slate-200"
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                                placeholder="Enter district name"
                            />
                        </div>

                        <div className="md:col-span-2 py-2 border-t border-slate-100"></div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Team Lead (TL)</label>
                            <input
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm placeholder:text-slate-200"
                                value={formData.tlName}
                                onChange={e => setFormData({ ...formData, tlName: e.target.value })}
                                placeholder="Assign leader name"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">TL Contact Number</label>
                            <input
                                type="tel"
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm placeholder:text-slate-200"
                                value={formData.tlNumber}
                                onChange={e => setFormData({ ...formData, tlNumber: e.target.value })}
                                placeholder="10-digit primary contact"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Detailed Address</label>
                            <textarea
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none font-bold placeholder:text-slate-200"
                                rows={3}
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Provide full logistics address..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Google Maps Link</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Icon name="MapPin" size={20} />
                                </span>
                                <input
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-mono text-xs font-bold text-indigo-600"
                                    value={formData.mapLink}
                                    onChange={e => setFormData({ ...formData, mapLink: e.target.value })}
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 mt-12">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 py-5 px-8 border-2 border-slate-200 rounded-3xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-5 px-8 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98] uppercase tracking-widest text-xs"
                        >
                            {initialData ? 'Update Registry' : 'Finalize Hub'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
