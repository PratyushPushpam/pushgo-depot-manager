import { Depot } from "@/types";

interface StatsCardsProps {
    stats: {
        total: number;
        bihar: number;
        jharkhand: number;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Network Size</p>
                <p className="text-4xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-l-8 border-l-orange-500 shadow-sm border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Bihar Hubs</p>
                <p className="text-4xl font-black text-orange-600">{stats.bihar}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-l-8 border-l-emerald-500 shadow-sm border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Jharkhand Hubs</p>
                <p className="text-4xl font-black text-emerald-600">{stats.jharkhand}</p>
            </div>
        </div>
    );
}
