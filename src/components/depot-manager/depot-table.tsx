import { Icon } from "@/components/ui/icon";
import { Depot } from "@/types";

interface DepotTableProps {
    depots: Depot[];
    onEdit: (depot: Depot) => void;
    onDelete: (id: string) => void;
}

export function DepotTable({ depots, onEdit, onDelete }: DepotTableProps) {
    const shareToWhatsApp = (depot: Depot) => {
        const text = `*PushGo Depot Details*\n\n` +
            `📍 *Name:* ${depot.name}\n` +
            `🏢 *Region:* ${depot.state}${depot.district ? ` (${depot.district})` : ''}\n` +
            `👤 *TL:* ${depot.tlName || 'N/A'}\n` +
            `📞 *Phone:* ${depot.tlNumber || 'N/A'}\n` +
            `🏠 *Address:* ${depot.address || 'N/A'}\n` +
            `🗺️ *Map:* ${depot.mapLink || 'N/A'}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Depot Name</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Management</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics & Maps</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {depots.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-30">
                                        <Icon name="Database" size={80} className="mb-4 text-indigo-200" />
                                        <p className="text-2xl font-black text-slate-900">PushGo: No matches found</p>
                                        <p className="text-base font-medium">Verify your search queries or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            depots.map((depot) => (
                                <tr key={depot.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-slate-900 text-lg tracking-tight">{depot.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-4 h-4 rounded-full ${depot.state === 'Bihar' ? 'bg-orange-500' : 'bg-emerald-500'} shadow-inner`}></div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm uppercase tracking-wider">{depot.state}</p>
                                                <p className="text-xs text-slate-400 font-bold tracking-wide">{depot.district || 'District TBD'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {depot.tlName ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                    <Icon name="User" size={16} className="text-indigo-400" />
                                                    {depot.tlName}
                                                </div>
                                                {depot.tlNumber && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold ml-6">
                                                        <Icon name="Phone" size={14} className="text-slate-300" />
                                                        {depot.tlNumber}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 italic text-xs font-black uppercase tracking-widest">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="max-w-[280px] space-y-2">
                                            <div className="flex items-start gap-2 text-xs text-slate-600 font-bold leading-relaxed">
                                                <Icon name="Home" size={16} className="flex-shrink-0 text-slate-400" />
                                                <span className="line-clamp-1">{depot.address || 'Address not listed'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 ml-6">
                                                {depot.mapLink ? (
                                                    <a
                                                        href={depot.mapLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-black bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors uppercase tracking-widest"
                                                    >
                                                        <Icon name="Map" size={12} />
                                                        View Map
                                                        <Icon name="ExternalLink" size={10} />
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">Link N/A</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => shareToWhatsApp(depot)}
                                                className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                                                title="Share to WhatsApp"
                                            >
                                                <Icon name="Share2" size={20} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(depot)}
                                                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                                                title="Edit"
                                            >
                                                <Icon name="Edit2" size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(depot.id)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                title="Delete"
                                            >
                                                <Icon name="Trash2" size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
