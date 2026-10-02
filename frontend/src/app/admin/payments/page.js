'use client';
import AdminShell from '../AdminShell';
import { useEffect, useState, useCallback } from 'react';
import { adminPayments } from '@/lib/adminApi';
import { Search, ChevronLeft, ChevronRight } from '@mui/icons-material';

const PAYMENT_STATUS_OPTIONS = ['pending', 'success', 'failed', 'refunded', 'partial'];

const statusColor = {
  success: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-violet-50 text-violet-700',
  partial: 'bg-orange-50 text-orange-700',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [paginator, setPaginator] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const query = statusFilter ? { paymentStatus: statusFilter } : {};
      const res = await adminPayments.list(page, 10, query);
      if (res.data?.data) {
        setPayments(res.data.data.data || []);
        setPaginator(res.data.data.paginator || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Payments</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {paginator.itemCount ?? 0} total payments
          </p>
        </div>

        {/* Filter */}
        <div className="mb-5">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400"
          >
            <option value="">All Statuses</option>
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-400">Loading...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-400">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs">
                    <th className="text-left font-medium px-5 py-3">Payment ID</th>
                    <th className="text-left font-medium px-5 py-3">Customer</th>
                    <th className="text-left font-medium px-5 py-3">Channel</th>
                    <th className="text-left font-medium px-5 py-3">Amount</th>
                    <th className="text-left font-medium px-5 py-3">Total</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-neutral-800 font-mono text-xs">
                        {p.payment_id || p.order_id || p.id?.slice(-8)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {p.userId?.name || p.userId?.email || '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-600 capitalize">
                        {p.paymentChannel || '-'}
                      </td>
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {p.currentPayment != null ? `₹${p.currentPayment}` : '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {p.totalPayment != null ? `₹${p.totalPayment}` : '-'}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                            statusColor[p.paymentStatus] || 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {paginator.pageCount > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-sm">
              <span className="text-neutral-500">
                Page {paginator.currentPage} of {paginator.pageCount}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={!paginator.prev}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft sx={{ fontSize: 18 }} />
                </button>
                <button
                  disabled={!paginator.next}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronRight sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
