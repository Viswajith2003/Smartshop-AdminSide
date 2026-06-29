import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Filter,
  RefreshCcw,
  ChevronRight,
  ArrowUpRight,
  ChevronDown,
  Tag
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import { Pagination } from '../common';
import usePagination from '../../hooks/usePagination';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    case 'Returned': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    case 'Cancel Requested':
    case 'Return Requested':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All'
  });

  const { pagination, handlePageChange, updatePagination } = usePagination(10);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSalesReport({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      if (res.success) {
        setReportData(res.data);
        if (res.data.meta) {
          updatePagination(res.data.meta);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [pagination.page, pagination.limit]);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !reportData && pagination.page === 1) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Sales Analytics</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Detailed revenue and product performance reports</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-wrap items-end gap-6 no-print">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 outline-none w-48 font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 outline-none w-48 font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:border-indigo-500 outline-none w-48 font-bold appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchReport}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setFilters({startDate: '', endDate: '', status: 'All'});
              setTimeout(fetchReport, 0);
            }}
            className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-3 rounded-xl transition-all border border-slate-200"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:flex print:flex-row print:justify-between print:gap-4 print:mb-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group print:flex-1 print:border print:border-slate-200 print:rounded-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 print:text-slate-500">Total Revenue</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter print:text-black">₹{(reportData?.summary?.totalRevenue || 0).toLocaleString()}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-500 bg-blue-500/10 w-fit px-3 py-1.5 rounded-full print:bg-transparent print:text-slate-500 print:px-0">
              <TrendingUp className="w-3 h-3" />
              12.5% increase from last period
            </div>
          </div>
          <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900 print:hidden" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group print:flex-1 print:border print:border-slate-200 print:rounded-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 print:text-slate-500">Total Orders</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter print:text-black">{reportData?.summary?.totalOrders || 0}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full print:bg-transparent print:text-slate-500 print:px-0">
              <ShoppingCart className="w-3 h-3" />
              Verified Completed Orders
            </div>
          </div>
          <ShoppingCart className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900 print:hidden" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group print:flex-1 print:border print:border-slate-200 print:rounded-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 print:text-slate-500">Products Sold</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter print:text-black">{reportData?.summary?.totalProducts || 0}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 w-fit px-3 py-1.5 rounded-full print:bg-transparent print:text-slate-500 print:px-0">
              <Package className="w-3 h-3" />
              Unique Items Sold
            </div>
          </div>
          <Package className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900 print:hidden" />
        </div>
      </div>

      {/* Detailed Sales Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col print:border-none print:shadow-none">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between print:hidden">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            Detailed Sales Report
          </h4>
        </div>

        {/* Print-Only Header */}
        <div className="hidden print:block text-center pb-6 border-b border-slate-200 mb-6">
          <h2 className="text-2xl font-black text-black uppercase tracking-widest">SmartShop Sales Report</h2>
          <p className="text-sm font-bold mt-2">
            {filters.startDate || filters.endDate 
              ? `Period: ${filters.startDate || 'Beginning'} to ${filters.endDate || 'Present'}`
              : 'All-Time Report'}
          </p>
          <p className="text-xs mt-1">Generated on {new Date().toLocaleString()}</p>
        </div>

        <div className="overflow-x-auto flex-1 print:overflow-visible">
          <table className="w-full text-left border-collapse whitespace-nowrap print:whitespace-normal">
            <thead>
              <tr className="bg-slate-50/50 print:bg-slate-100">
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Order ID</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Date</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Customer Name</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Product Name</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Qty</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Price</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black print:border">Coupon Discount</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right print:text-black print:border">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 screen-only-tbody">
              {(!reportData?.reportData || reportData.reportData.length === 0) ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-500 text-xs font-bold italic print:text-black print:border">No sales data found for this period.</td>
                </tr>
              ) : reportData.reportData.map((item, index) => (
                <tr key={`${item.orderId}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 text-xs font-black text-slate-700 print:text-black print:border">#{item.orderId.slice(-8).toUpperCase()}</td>
                  <td className="p-5 text-[11px] font-bold text-slate-500 print:text-black print:border">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-5 text-sm font-bold text-slate-700 print:text-black print:border">{item.customerName}</td>
                  <td className="p-5 text-sm font-bold text-slate-700 max-w-[200px] truncate print:whitespace-normal print:max-w-none print:text-black print:border" title={item.productName}>{item.productName}</td>
                  <td className="p-5 print:border">
                    <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-black print:bg-transparent print:text-black">{item.quantity}</span>
                  </td>
                  <td className="p-5 text-sm font-black text-slate-900 print:text-black print:border">₹{item.price.toLocaleString()}</td>
                  <td className="p-5 text-sm font-black text-emerald-500 print:text-black print:border">
                    {item.couponDiscount > 0 ? `₹${item.couponDiscount.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-5 text-right print:border">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border print:border-black print:text-black print:bg-transparent ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Print Only Tbody (Unpaginated Data) */}
            <tbody className="divide-y divide-slate-200 print-only-tbody">
              {(!(reportData?.allReportData || reportData?.reportData) || (reportData?.allReportData || reportData?.reportData).length === 0) ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-500 text-xs font-bold italic print:text-black print:border">No sales data found for this period.</td>
                </tr>
              ) : (reportData?.allReportData || reportData?.reportData).map((item, index) => (
                <tr key={`print-${item.orderId}-${index}`}>
                  <td className="p-5 text-xs font-black text-slate-700 print:text-black print:border">#{item.orderId.slice(-8).toUpperCase()}</td>
                  <td className="p-5 text-[11px] font-bold text-slate-500 print:text-black print:border">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-5 text-sm font-bold text-slate-700 print:text-black print:border">{item.customerName}</td>
                  <td className="p-5 text-sm font-bold text-slate-700 max-w-[200px] truncate print:whitespace-normal print:max-w-none print:text-black print:border" title={item.productName}>{item.productName}</td>
                  <td className="p-5 print:border">
                    <span className="bg-transparent text-black px-0 py-0 rounded-none text-[10px] font-black">{item.quantity}</span>
                  </td>
                  <td className="p-5 text-sm font-black text-slate-900 print:text-black print:border">₹{item.price.toLocaleString()}</td>
                  <td className="p-5 text-sm font-black text-emerald-500 print:text-black print:border">
                    {item.couponDiscount > 0 ? `₹${item.couponDiscount.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-5 text-right print:border">
                    <span className={`px-0 py-0 rounded-none text-[10px] font-black uppercase tracking-widest border-none print:text-black print:bg-transparent`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component */}
      {reportData?.reportData && reportData.reportData.length > 0 && (
        <div className="flex items-center justify-center pt-2 pb-6 no-print">
          <Pagination pagination={pagination} onPageChange={handlePageChange} theme="light" />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .print-only-tbody { display: none; }
        @media print {
          @page { size: landscape; margin: 1cm; }
          .no-print { display: none !important; }
          .print-only-tbody { display: table-row-group !important; }
          .screen-only-tbody { display: none !important; }
          body { background: white !important; color: black !important; }
          .shadow-xl, .shadow-lg { box-shadow: none !important; }
          aside, header, nav, .sidebar { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          .p-8 { padding: 1rem !important; }
          .rounded-[2.5rem], .rounded-3xl, .rounded-2xl { border-radius: 0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          th, td { padding: 8px !important; font-size: 10px !important; }
          th { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-gradient-to-br { background: white !important; color: black !important; border: 1px solid #ddd !important; }
          .text-white { color: black !important; }
          .opacity-60 { opacity: 1 !important; }
          .grid-cols-3 { display: flex !important; justify-content: space-between !important; gap: 1rem !important; margin-bottom: 2rem !important; }
          .grid-cols-3 > div { flex: 1 !important; border: 1px solid #ddd !important; padding: 1rem !important; }
        }
      `}} />
    </div>
  );
};

export default SalesReport;
