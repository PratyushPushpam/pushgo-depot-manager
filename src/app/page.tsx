"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Depot, DepotState } from "@/types";
import { StatsCards } from "@/components/depot-manager/stats-cards";
import { Filters } from "@/components/depot-manager/filters";
import { DepotTable } from "@/components/depot-manager/depot-table";
import { DepotDialog } from "@/components/depot-manager/depot-dialog";
import { DeleteAlert } from "@/components/depot-manager/delete-alert";
import { supabase } from "@/lib/supabase";

export default function Home() {
  // State
  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<DepotState>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepot, setEditingDepot] = useState<Depot | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status Message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- 1. Fetch Data from Supabase ---
  const fetchDepots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('depots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase snake_case to our App's camelCase
      const formattedData: Depot[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        state: item.state,
        district: item.district,
        tlName: item.tl_name,       // map tl_name -> tlName
        tlNumber: item.tl_number,   // map tl_number -> tlNumber
        address: item.address,
        mapLink: item.map_link      // map map_link -> mapLink
      }));

      setDepots(formattedData);
    } catch (err) {
      console.error('Error fetching depots:', err);
      showStatus('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchDepots();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleOpenModal = (depot: Depot | null = null) => {
    setEditingDepot(depot);
    setIsModalOpen(true);
  };

  // --- 2. Create / Update Data in Supabase ---
  const handleSave = async (data: Omit<Depot, "id">) => {
    try {
      // Prepare payload for Supabase (convert back to snake_case)
      const payload = {
        name: data.name,
        state: data.state,
        district: data.district,
        tl_name: data.tlName,
        tl_number: data.tlNumber,
        address: data.address,
        map_link: data.mapLink
      };

      if (editingDepot) {
        // UPDATE existing
        const { error } = await supabase
          .from('depots')
          .update(payload)
          .eq('id', editingDepot.id);

        if (error) throw error;
        showStatus("Depot updated successfully");
      } else {
        // INSERT new
        // We use crypto.randomUUID() for ID.
        const newId = crypto.randomUUID();

        const { error } = await supabase
          .from('depots')
          .insert([{ id: newId, ...payload }]);

        if (error) throw error;
        showStatus("New depot added successfully");
      }

      // Refresh list
      await fetchDepots();
      setIsModalOpen(false);

    } catch (err) {
      console.error('Error saving depot:', err);
      showStatus('Failed to save data');
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  // --- 3. Delete Data from Supabase ---
  const executeDelete = async () => {
    if (deleteConfirmId) {
      try {
        const { error } = await supabase
          .from('depots')
          .delete()
          .eq('id', deleteConfirmId);

        if (error) throw error;

        setDeleteConfirmId(null);
        showStatus("Depot deleted successfully");
        await fetchDepots(); // Refresh list

      } catch (err) {
        console.error('Error deleting depot:', err);
        showStatus('Failed to delete depot');
      }
    }
  };

  const filteredDepots = useMemo(() => {
    return depots.filter(d => {
      const matchesSearch =
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tlName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = stateFilter === 'All' || d.state === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [depots, searchQuery, stateFilter]);

  const stats = useMemo(() => {
    return {
      total: depots.length,
      bihar: depots.filter(d => d.state === 'Bihar').length,
      jharkhand: depots.filter(d => d.state === 'Jharkhand').length
    };
  }, [depots]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* Company Branding & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Official</span>
              <span className="text-indigo-600 font-black tracking-tighter text-xl italic uppercase">PushGo</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Icon name="Database" className="text-indigo-600" size={36} />
              Depot Manager
            </h1>
            <p className="text-slate-500 mt-1 text-lg font-medium">Manage PushGo logistics and field teams</p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/superadmin"
              className="bg-white text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 px-6 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider"
              title="Superadmin Access"
            >
              <Icon name="ShieldCheck" size={20} strokeWidth={2.5} />
              <span>Superadmin Login</span>
            </Link>
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Icon name="Plus" size={20} strokeWidth={3} />
              Register New Depot
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
        />

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DepotTable
            depots={filteredDepots}
            onEdit={handleOpenModal}
            onDelete={confirmDelete}
          />
        )}
      </div>

      {/* Main Form Modal */}
      <DepotDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSave}
        initialData={editingDepot}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAlert
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        onConfirm={executeDelete}
      />

      {/* Custom Status Notification */}
      {statusMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-10 fade-in duration-500 z-[110] border-t-4 border-indigo-500">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <Icon name="Check" size={18} className="text-white" strokeWidth={4} />
          </div>
          <span className="font-black text-sm tracking-widest uppercase">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
