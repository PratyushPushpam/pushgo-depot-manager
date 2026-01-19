import { Icon } from "@/components/ui/icon";
import { DepotState } from "@/types";

interface FiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    stateFilter: DepotState;
    setStateFilter: (state: DepotState) => void;
}

export function Filters({ searchQuery, setSearchQuery, stateFilter, setStateFilter }: FiltersProps) {
    const states: DepotState[] = ['All', 'Bihar', 'Jharkhand'];

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="Search" size={22} />
                </span>
                <input
                    type="text"
                    placeholder="Quick search: name, district, or lead..."
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-bold placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-3xl p-1.5 shadow-sm">
                {states.map((state) => (
                    <button
                        key={state}
                        onClick={() => setStateFilter(state)}
                        className={`px-8 py-3.5 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${stateFilter === state
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {state}
                    </button>
                ))}
            </div>
        </div>
    );
}
