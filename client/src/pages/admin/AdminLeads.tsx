import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  Mail,
  Plus,
  Trash2,
  Edit,
  Clock,
  Send,
  UserCheck,
} from 'lucide-react';
import { leadApi } from '../../services/api';
import { ILead } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadApi.getAdminLeads({
        status: statusFilter,
        service: serviceFilter,
        search,
      });
      setLeads(data);
    } catch (err) {
      console.error('Error fetching admin leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, serviceFilter, search]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await leadApi.updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(updated);
      }
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedLead) return;

    setIsAddingNote(true);
    try {
      const updated = await leadApi.addLeadNote(selectedLead._id, newNote);
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l._id === selectedLead._id ? updated : l)));
      setNewNote('');
      toast.success('Internal note added');
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead inquiry?')) return;
    try {
      await leadApi.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(null);
      }
      toast.success('Lead deleted');
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const handleExportCSV = () => {
    window.open(leadApi.exportCSVUrl, '_blank');
  };

  return (
    <>
      <SEO title="Lead Management" />

      <div className="space-y-6">
        {/* Header & CSV Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Lead & Enquiry Management</h1>
            <p className="text-xs text-slate-500">Track, update statuses, add notes, and convert incoming tax inquiries.</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name, Phone, Lead ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="ALL">All Lead Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="ALL">All Services</option>
              <option value="GST Registration">GST Registration</option>
              <option value="GST Return Filing">GST Return Filing</option>
              <option value="Accounting">Accounting & Bookkeeping</option>
              <option value="Audit & Assurance">Audit & Assurance</option>
              <option value="Firm Registration">Firm Registration</option>
              <option value="ITR Filing">ITR Filing</option>
            </select>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone / WhatsApp</th>
                  <th className="p-4">Requested Service</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      Loading leads data...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No lead inquiries match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-navy-900">{lead.leadNumber}</td>
                      <td className="p-4 font-semibold text-slate-800">{lead.name}</td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>{lead.phone}</span>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${lead.name}, contacting you regarding your ${lead.serviceName} enquiry with Vihaan Tax Solutions.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-500 p-1"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400">{lead.email}</div>
                      </td>
                      <td className="p-4 font-medium text-brand-blue">{lead.serviceName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                          {lead.customerType}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="text-xs font-semibold rounded-lg px-2 py-1 border border-slate-200 bg-white focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Follow-Up">Follow-Up</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 bg-brand-blue text-white font-bold rounded-lg text-[11px] hover:bg-navy-900 transition"
                        >
                          View & Notes
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail & Notes Modal */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={`Lead Details: ${selectedLead.leadNumber}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Customer Details Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold block">Customer Name</span>
                <span className="font-bold text-navy-900 text-sm">{selectedLead.name}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block">Phone Number</span>
                <a href={`tel:${selectedLead.phone}`} className="font-bold text-brand-blue">
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block">Email</span>
                <span className="font-bold text-slate-800">{selectedLead.email}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block">Requested Service</span>
                <span className="font-bold text-brand-blue">{selectedLead.serviceName}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block">Customer Type</span>
                <span className="font-bold text-slate-800">{selectedLead.customerType}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block">Preferred Contact</span>
                <span className="font-bold text-slate-800">
                  {selectedLead.preferredContactMethod} ({selectedLead.preferredContactTime || 'Anytime'})
                </span>
              </div>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex gap-3">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>Call Client</span>
              </a>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedLead.name}, contacting you regarding your ${selectedLead.serviceName} enquiry with Vihaan Tax Solutions.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Client</span>
              </a>
            </div>

            {/* Message Body */}
            <div>
              <h4 className="font-bold text-navy-900 text-xs uppercase mb-1">Customer Query / Message</h4>
              <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed">
                {selectedLead.message || 'No additional message provided.'}
              </p>
            </div>

            {/* Admin Private Internal Notes Log */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="font-bold text-navy-900 text-sm">Internal Private Admin Notes</h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((n, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                      <div className="flex justify-between font-bold text-navy-900 mb-1">
                        <span>{n.author}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700">{n.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                )}
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add private note (e.g. Discussed fee quote, waiting for documents)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !newNote}
                  className="px-4 py-2 bg-navy-900 text-white font-bold rounded-xl text-xs hover:bg-brand-blue transition disabled:opacity-50"
                >
                  Add Note
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
