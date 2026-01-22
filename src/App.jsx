import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  CreditCard, Settings, LogOut, Menu, X,
  Plus, Search, Filter, Printer, FileText,
  TrendingUp, TrendingDown, Bell, Truck,
  CheckCircle, AlertCircle, ShoppingBag, UserCheck,
  List, Tag, Trash2, Edit, Save, XCircle, ChevronRight, ChevronDown, MoreHorizontal, Phone, MapPin, Calendar, Wallet,
  Eye, Check, Image as ImageIcon, Globe, History, Download, Upload, FileSpreadsheet
} from 'lucide-react';

// --- STYLES FOR ANIMATIONS ---
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .animate-slide-in-right {
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
`;

// --- DATA AWAL (INITIAL STATE DENGAN LEBIH BANYAK DATA) ---

const INITIAL_CATEGORIES = [
  { id: 1, name: "Sembako", subCategories: ["Beras", "Minyak", "Gula", "Telur"] },
  { id: 2, name: "Bahan Kue", subCategories: ["Tepung", "Margarin", "Coklat"] },
  { id: 3, name: "Minuman", subCategories: ["Kopi", "Teh", "Susu"] },
  { id: 4, name: "Peralatan Mandi", subCategories: ["Sabun", "Shampoo", "Pasta Gigi"] },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Beras Premium Rojolele 5kg", category: "Sembako", subCategory: "Beras", price: 65000, discount: 5, stock: 50, sku: "BRS-001", isActive: true, isHighlight: true },
  { id: 2, name: "Minyak Goreng Sunco 2L", category: "Sembako", subCategory: "Minyak", price: 38000, discount: 0, stock: 120, sku: "MNY-002", isActive: true, isHighlight: false },
  { id: 3, name: "Gula Pasir Gulaku 1kg", category: "Sembako", subCategory: "Gula", price: 16000, discount: 0, stock: 200, sku: "GLA-003", isActive: true, isHighlight: false },
  { id: 4, name: "Tepung Terigu Segitiga Biru 1kg", category: "Bahan Kue", subCategory: "Tepung", price: 12000, discount: 10, stock: 45, sku: "TPG-004", isActive: false, isHighlight: false },
  { id: 5, name: "Telur Ayam Negeri (Tray)", category: "Sembako", subCategory: "Telur", price: 55000, discount: 0, stock: 15, sku: "TLR-005", isActive: true, isHighlight: true },
  { id: 6, name: "Kopi Kapal Api Special (Mix)", category: "Minuman", subCategory: "Kopi", price: 15000, discount: 0, stock: 100, sku: "KOPI-006", isActive: true, isHighlight: false },
  { id: 7, name: "Teh Sari Wangi (Kotak)", category: "Minuman", subCategory: "Teh", price: 8500, discount: 0, stock: 80, sku: "TEH-007", isActive: true, isHighlight: false },
];

const INITIAL_ORDERS = [
  {
    id: "INV-20231001",
    customer: "Budi Santoso",
    role: "Member",
    date: "2026-01-25",
    deliveryDay: "Senin",
    total: 150000,
    status: "Done",
    paymentStatus: "Lunas",
    method: "Transfer",
    items: [
      { id: 1, name: "Beras Premium Rojolele 5kg", price: 65000, qty: 2 },
      { id: 3, name: "Gula Pasir Gulaku 1kg", price: 16000, qty: 1 }
    ],
    paymentProof: "https://via.placeholder.com/300x400?text=Bukti+Transfer+Budi"
  },
  {
    id: "INV-20260126",
    customer: "Warung Bu Siti",
    role: "Kepala Dapur",
    date: "2026-01-26",
    deliveryDay: "Selasa",
    total: 1200000,
    status: "Shipped",
    paymentStatus: "Lunas",
    method: "Tagihan H+1",
    items: [
      { id: 2, name: "Minyak Goreng Sunco 2L", price: 38000, qty: 10 },
      { id: 1, name: "Beras Premium Rojolele 5kg", price: 65000, qty: 12 }
    ]
  },
  {
    id: "INV-20260126",
    customer: "Ahmad Dani",
    role: "Guest",
    date: "2026-01-26",
    deliveryDay: "Rabu",
    total: 65000,
    status: "Process",
    paymentStatus: "Paid",
    method: "Transfer",
    items: [
      { id: 1, name: "Beras Premium Rojolele 5kg", price: 65000, qty: 1 }
    ],
    paymentProof: "https://via.placeholder.com/300x400?text=Bukti+Transfer+Ahmad"
  },
  {
    id: "INV-20260127",
    customer: "Catering Sejahtera",
    role: "Kepala Dapur",
    date: "2026-01-27",
    deliveryDay: "Kamis",
    total: 3500000,
    status: "Pending",
    paymentStatus: "Pasca Bayar",
    method: "Tagihan H+2",
    items: [
      { id: 2, name: "Minyak Goreng Sunco 2L", price: 38000, qty: 50 },
      { id: 5, name: "Telur Ayam Negeri (Tray)", price: 55000, qty: 20 }
    ]
  },
];

const INITIAL_PURCHASES = [
  { id: "PO-001", productId: 1, productName: "Beras Premium Rojolele 5kg", supplier: "PT. Padi Makmur", qty: 100, unitCost: 55000, total: 5500000, date: "2023-10-20", status: "Diterima" },
  { id: "PO-002", productId: 2, productName: "Minyak Goreng Sunco 2L", supplier: "UD. Sembako Jaya", qty: 50, unitCost: 32000, total: 1600000, date: "2023-10-21", status: "Proses" },
];

const INITIAL_SUPPLIERS = ["PT. Padi Makmur", "UD. Sembako Jaya", "Indofood Sukses Makmur", "Wings Group"];

const INITIAL_PAYMENT_ACCOUNTS = [
  { id: 1, bankName: "Bank Mandiri", accountNumber: "1231321312", holderName: "Koperasi Bergas" },
  { id: 2, bankName: "Bank BCA", accountNumber: "9876543210", holderName: "Koperasi Bergas" },
];

const INITIAL_USERS = [
  { id: 1, name: "Billy", email: "billy@koperasi.id", role: "Owner", status: "Active" },
  { id: 2, name: "Siti Aminah", email: "admin@koperasi.id", role: "Admin", status: "Active" },
  { id: 3, name: "Budi Bendahara", email: "finance@koperasi.id", role: "Bendahara", status: "Active" },
  { id: 4, name: "Joko Gudang", email: "logistik@koperasi.id", role: "Staff", status: "Inactive" },
];

const INITIAL_TRANSACTIONS = [
  { id: "TRX-001", type: "Masuk", category: "Penjualan", amount: 1500000, date: "2023-10-25", note: "Setoran POS Harian" },
  { id: "TRX-002", type: "Keluar", category: "Restock", amount: 5000000, date: "2023-10-26", note: "Pembelian Beras ke Supplier" },
  { id: "TRX-003", type: "Masuk", category: "Pelunasan", amount: 1200000, date: "2023-10-26", note: "Pelunasan Warung Bu Siti" },
  { id: "TRX-004", type: "Keluar", category: "Operasional", amount: 200000, date: "2023-10-27", note: "Bensin Kurir" },
  { id: "TRX-005", type: "Masuk", category: "Penjualan", amount: 850000, date: "2023-10-27", note: "Setoran POS Shift 1" },
];

const INITIAL_PROMOS = [
  { id: 1, type: 'Voucher', code: 'HEMAT10', value: 10000, unit: 'IDR', active: true, desc: 'Potongan 10rb all item' },
  { id: 2, type: 'Banner', title: 'Promo Gajian', image: 'banner_gajian.jpg', active: true, desc: 'Banner utama homepage' },
  { id: 3, type: 'Voucher', code: 'BERAS5', value: 5000, unit: 'IDR', active: false, desc: 'Diskon khusus beras' },
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Budi Santoso', type: 'Member', phone: '08123456789', spending: 4500000, joinDate: '2023-01-15' },
  { id: 2, name: 'Warung Bu Siti', type: 'Kepala Dapur', phone: '08129876543', spending: 12500000, joinDate: '2023-02-10' },
  { id: 3, name: 'Catering Sejahtera', type: 'Kepala Dapur', phone: '08134567890', spending: 25000000, joinDate: '2023-03-05' },
  { id: 4, name: 'Susi Susanti', type: 'Member', phone: '08121234123', spending: 850000, joinDate: '2023-05-20' },
];

// --- HELPER FUNCTIONS ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Selesai': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'Done': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'Shipped': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    case 'Process': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    case 'Paid': return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20';
    case 'Pending': return 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
    case 'Draft': return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
    case 'Batal': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
    case 'Lunas': return 'text-emerald-600 font-bold';
    case 'Overdue': return 'text-rose-600 font-bold';
    case 'Masuk': return 'text-emerald-600';
    case 'Keluar': return 'text-rose-600';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// --- COMPONENTS ---

// 1. Sidebar (Refined)
const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      section: 'OPERASIONAL', items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pos', label: 'Kasir (POS)', icon: ShoppingBag },
        { id: 'pos-history', label: 'Riwayat POS', icon: History },
        { id: 'purchase', label: 'Pembelian (Stok)', icon: Truck },
        { id: 'orders', label: 'Manajemen Pesanan', icon: ShoppingCart },
      ]
    },
    {
      section: 'ORDER & LOGISTIK', items: [
        // { id: 'orders', label: 'Manajemen Pesanan', icon: ShoppingCart },
        // { id: 'delivery-schedule', label: 'Jadwal Pengiriman', icon: Calendar },
      ]
    },
    {
      section: 'MARKETPLACE', items: [
        { id: 'marketplace-homepage', label: 'Konten Homepage', icon: Globe },
      ]
    },
    {
      section: 'INVENTORY', items: [
        { id: 'products', label: 'Produk', icon: Package },
        { id: 'categories', label: 'Kategori', icon: List },
        // { id: 'promos', label: 'Promo', icon: Tag },
      ]
    },
    {
      section: 'ADMINISTRASI', items: [
        { id: 'customers', label: 'Pelanggan', icon: Users },
        { id: 'finance', label: 'Keuangan', icon: Wallet },
        { id: 'users', label: 'User & Role', icon: UserCheck },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
        { id: 'payment-options', label: 'Opsi Pembayaran', icon: CreditCard },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" onClick={toggleSidebar}></div>}

      <aside className={`fixed left-0 top-0 z-50 h-screen w-72 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-slate-800`}>
        <div className="flex h-20 items-center px-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-white tracking-wide">KOPERASI<span className="text-emerald-400">PRO</span></span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden ml-auto text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="h-[calc(100vh-140px)] overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{group.section}</h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); toggleSidebar(); }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 
                        ${activeTab === item.id
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                        : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                  >
                    <item.icon size={18} className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
                    {item.label}
                    {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-70" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-slate-900 border-t border-slate-800">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
            <LogOut size={18} />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </>
  );
};

// 2. Dashboard View (Modernized)
const DashboardView = ({ products, orders, transactions, users }) => {
  const totalSales = transactions.filter(t => t.type === 'Masuk').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Greeting Logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{greeting}, Pak Billy 👋</h2>
          <p className="text-slate-500 mt-1">Berikut adalah ringkasan performa koperasi hari ini.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Refresh Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Penjualan", value: formatRupiah(totalSales), icon: TrendingUp, from: "from-blue-500", to: "to-cyan-500" },
          { title: "Order Pending", value: `${pendingOrders} Order`, icon: ShoppingBag, from: "from-amber-500", to: "to-orange-500" },
          { title: "Stok Menipis", value: "5 Produk", icon: AlertCircle, from: "from-rose-500", to: "to-pink-500" },
          { title: "Total User", value: `${users.length} User`, icon: Users, from: "from-emerald-500", to: "to-teal-500" },
        ].map((stat, idx) => (
          <div key={idx} className="card-hover bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.from} ${stat.to} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.from} ${stat.to} flex items-center justify-center text-white shadow-md mb-4`}>
                <stat.icon size={22} />
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Order Terbaru</h3>
              <p className="text-slate-400 text-sm">Transaksi masuk dari marketplace</p>
            </div>
            <button className="text-emerald-600 text-sm font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Order</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 5).map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{order.customer}</div>
                      <div className="text-xs text-slate-400">{order.role}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-1">Aktivitas Keuangan</h3>
          <p className="text-slate-400 text-sm mb-6">Mutasi kas masuk dan keluar terakhir</p>

          <div className="space-y-0 relative">
            {/* Timeline connector line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>

            {transactions.slice(0, 4).map((trx, i) => (
              <div key={i} className="flex gap-4 relative pb-6 last:pb-0 group">
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${trx.type === 'Masuk' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {trx.type === 'Masuk' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{trx.category}</span>
                    <span className="text-xs text-slate-400">{trx.date}</span>
                  </div>
                  <p className="font-medium text-slate-800 mt-1">{trx.note}</p>
                  <p className={`text-sm font-bold mt-1 ${trx.type === 'Masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trx.type === 'Masuk' ? '+' : '-'} {formatRupiah(trx.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 3. Product View (Full CRUD)
const ProductView = ({ products, setProducts, categories, notify, askConfirm }) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', discount: 0, stock: '', category: '', subCategory: '', sku: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isImportTested, setIsImportTested] = useState(false);
  const [tempImportData, setTempImportData] = useState([]);

  const productCategories = categories.map(c => c.name);
  const subCategories = categories.find(c => c.name === newProduct.category)?.subCategories || [];
  const editSubCategories = categories.find(c => c.name === editingProduct?.category)?.subCategories || [];

  const downloadTemplate = () => {
    const template = [
      {
        'Nama Produk': 'Beras Premium 5kg',
        'SKU / Kode': 'BRS-001',
        'Kategori': 'Sembako',
        'Sub Kategori': 'Beras',
        'Harga Jual': 65000,
        'Diskon (%)': 0,
        'Stok Awal': 100
      },
      {
        'Nama Produk': 'Minyak Goreng 2L',
        'SKU / Kode': 'MNY-002',
        'Kategori': 'Sembako',
        'Sub Kategori': 'Minyak',
        'Harga Jual': 38000,
        'Diskon (%)': 0,
        'Stok Awal': 50
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_import_produk.xlsx");
    notify("Template berhasil di-download", "success");
  };

  const testImportExcel = () => {
    if (!selectedImportFile) return notify("Pilih file terlebih dahulu!", "error");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setValidationErrors(["File kosong atau tidak terbaca"]);
          return notify("File kosong!", "error");
        }

        const errors = [];
        const requiredColumns = ['Nama Produk', 'Harga Jual', 'Stok Awal'];

        // Check columns
        const firstRow = data[0];
        requiredColumns.forEach(col => {
          if (!Object.keys(firstRow).includes(col)) {
            errors.push(`Kolom "${col}" tidak ditemukan`);
          }
        });

        // Check data types & values
        data.forEach((item, idx) => {
          if (!item['Nama Produk']) errors.push(`Baris ${idx + 1}: Nama Produk wajib diisi`);
          if (isNaN(parseInt(item['Harga Jual']))) errors.push(`Baris ${idx + 1}: Harga Jual harus angka`);
          if (item['Stok Awal'] !== undefined && isNaN(parseInt(item['Stok Awal']))) errors.push(`Baris ${idx + 1}: Stok Awal harus angka`);
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
          setIsImportTested(false);
          notify("Data tidak valid, periksa peringatan", "error");
        } else {
          setValidationErrors([]);
          setIsImportTested(true);
          setTempImportData(data);
          notify("Data tervalidasi, siap di-import", "success");
        }
      } catch (error) {
        notify("Gagal membaca file Excel", "error");
      }
    };
    reader.readAsBinaryString(selectedImportFile);
  };

  const handleImportExcel = () => {
    if (!isImportTested || tempImportData.length === 0) return notify("Tes data terlebih dahulu!", "error");

    const importedProducts = tempImportData.map((item, index) => ({
      id: Date.now() + index,
      name: item['Nama Produk'] || 'Tanpa Nama',
      sku: item['SKU / Kode'] || '',
      category: item['Kategori'] || '',
      subCategory: item['Sub Kategori'] || '',
      price: parseInt(item['Harga Jual']) || 0,
      discount: parseInt(item['Diskon (%)']) || 0,
      stock: parseInt(item['Stok Awal']) || 0,
      isActive: true
    }));

    setProducts([...products, ...importedProducts]);
    notify(`${importedProducts.length} Produk berhasil di-import`, "success");
    setIsImportModalOpen(false);
    setSelectedImportFile(null);
    setIsImportTested(false);
    setValidationErrors([]);
    setTempImportData([]);
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return notify("Nama dan Harga wajib diisi!", "error");
    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseInt(newProduct.price),
      discount: parseInt(newProduct.discount) || 0,
      stock: parseInt(newProduct.stock) || 0,
      isActive: true
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', discount: 0, stock: '', category: '', subCategory: '', sku: '' });
    setIsFormOpen(false);
  };

  const handleUpdate = () => {
    if (!editingProduct.name || !editingProduct.price) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    askConfirm("Hapus produk ini?", () => {
      setProducts(products.filter(p => p.id !== id));
      notify("Produk berhasil dihapus", "success");
    });
  };

  const toggleStatus = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Katalog Produk</h2>
          <p className="text-slate-500 text-sm">Kelola stok dan harga produk koperasi.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsImportModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Upload size={18} className="text-blue-600" />
            Import Excel
          </button>
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            {isFormOpen ? <X size={18} /> : <Plus size={18} />}
            {isFormOpen ? 'Tutup Form' : 'Tambah Produk'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Detail Produk Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="col-span-1 lg:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nama Produk</label>
              <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Contoh: Beras Rojolele" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">SKU / Kode</label>
              <input value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="BRS-001" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Kategori</label>
              <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white">
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Sub Kategori</label>
              <select value={newProduct.subCategory} onChange={e => setNewProduct({ ...newProduct, subCategory: e.target.value })} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white" disabled={!newProduct.category}>
                <option value="">Pilih Sub Kategori</option>
                {subCategories.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0" className="w-full border border-slate-200 p-2.5 pl-9 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Diskon (%)</label>
              <input type="number" value={newProduct.discount} onChange={e => setNewProduct({ ...newProduct, discount: e.target.value })} placeholder="0" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Stok Awal</label>
              <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="0" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end mt-2">
              <button onClick={handleAdd} className="bg-slate-800 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-colors">Simpan Produk</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Cari nama, SKU, atau kategori..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2"><Filter size={16} /> Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Informasi Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{product.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">{product.category}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-bold ${product.discount > 0 ? 'text-rose-500 text-xs line-through' : 'text-slate-700'}`}>{formatRupiah(product.price)}</span>
                      {product.discount > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{formatRupiah(product.price * (1 - product.discount / 100))}</span>
                          <span className="text-[10px] bg-rose-50 text-rose-600 px-1 rounded font-bold">-{product.discount}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                      <span className={`${product.stock < 20 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>{product.stock} Unit</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(product.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(product)} className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Edit Produk: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nama Produk</label>
                <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value, subCategory: '' })} className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white">
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Sub Kategori</label>
                <select value={editingProduct.subCategory} onChange={e => setEditingProduct({ ...editingProduct, subCategory: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" disabled={!editingProduct.category}>
                  <option value="">Pilih Sub Kategori</option>
                  {editSubCategories.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Harga Jual</label>
                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Diskon (%)</label>
                <input type="number" value={editingProduct.discount} onChange={e => setEditingProduct({ ...editingProduct, discount: parseInt(e.target.value) || 0 })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Stok</label>
                <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} className="w-full border border-slate-200 p-3 rounded-xl outline-none" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button onClick={() => setEditingProduct(null)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
                <button onClick={handleUpdate} className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-500" /> Import Masal Produk
              </h3>
              <button onClick={() => { setIsImportModalOpen(false); setValidationErrors([]); setIsImportTested(false); }} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <p className="text-slate-600 text-sm mb-4">Gunakan template Excel kami untuk memastikan data ter-import dengan benar ke sistem.</p>
                <button onClick={downloadTemplate} className="text-emerald-600 font-bold text-sm flex items-center gap-2 hover:underline">
                  <Download size={16} /> Download Template Excel (.xlsx)
                </button>
              </div>

              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                  ${selectedImportFile ? (validationErrors.length > 0 ? 'border-rose-400 bg-rose-50/30' : 'border-emerald-500 bg-emerald-50/30') : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${selectedImportFile ? (validationErrors.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600') : 'bg-white text-slate-400 shadow-sm'}`}>
                      {selectedImportFile ? (validationErrors.length > 0 ? <AlertCircle size={20} /> : <Check size={20} />) : <Upload size={20} />}
                    </div>
                    {selectedImportFile ? (
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{selectedImportFile.name}</p>
                        <p className={`text-[10px] uppercase font-bold mt-1 ${validationErrors.length > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {validationErrors.length > 0 ? 'File bermasalah' : (isImportTested ? 'Tervalidasi' : 'File dipilih - Perlu Tes')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-slate-800">Klik / Seret file Excel</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase">.xlsx atau .xls</p>
                      </>
                    )}
                  </div>
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => { setSelectedImportFile(e.target.files[0]); setIsImportTested(false); setValidationErrors([]); }} />
                </label>
                {selectedImportFile && (
                  <button onClick={() => { setSelectedImportFile(null); setIsImportTested(false); setValidationErrors([]); }} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full shadow-lg hover:bg-rose-600 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>

              {validationErrors.length > 0 && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <div className="flex gap-2 text-rose-600 mb-2">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold uppercase">Kesalahan Data:</span>
                  </div>
                  <ul className="text-[11px] text-rose-500 space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                    {validationErrors.map((err, i) => <li key={i}>• {err}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={testImportExcel}
                  disabled={!selectedImportFile}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2
                    ${selectedImportFile ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-slate-200 text-slate-300 cursor-not-allowed'}`}
                >
                  {isImportTested ? 'Tes Ulang' : '1. Tes Data'}
                </button>
                <button
                  onClick={handleImportExcel}
                  disabled={!isImportTested}
                  className={`py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all
                    ${isImportTested ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-300 shadow-none cursor-not-allowed'}`}
                >
                  2. Import ke Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

// 4. POS View (Modernized)
const POSView = ({ products, setProducts, setTransactions, setOrders, notify, askConfirm }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState('');

  const addToCart = (product) => {
    if (!product.isActive || product.stock <= 0) return notify("Stok habis atau produk tidak aktif", "error");

    const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
    const exist = cart.find(item => item.id === product.id);
    const currentQtyInCart = exist ? exist.qty : 0;
    if (currentQtyInCart + 1 > product.stock) return notify("Stok tidak mencukupi!", "error");

    if (exist) {
      setCart(cart.map(x => x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...product, price: effectivePrice, originalPrice: product.price, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(x => x.id !== id));
  };

  const updateQty = (id, newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 1) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Check stock
        const product = products.find(p => p.id === id);
        if (qty > product.stock) {
          notify(`Stok ${product.name} tidak mencukupi!`, "error");
          return item;
        }
        return { ...item, qty };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    askConfirm(`Total ${formatRupiah(total)}. Proses Pembayaran?`, () => {
      const orderId = `INV-${Date.now().toString().slice(-8)}`;
      const newOrder = {
        id: orderId,
        customer: "Walk-in Customer",
        role: "Guest",
        date: new Date().toISOString().split('T')[0],
        total: total,
        amountPaid: parseFloat(amountPaid) || 0,
        change: Math.max(0, (parseFloat(amountPaid) || 0) - total),
        debt: Math.max(0, total - (parseFloat(amountPaid) || 0)),
        status: "Done",
        paymentStatus: "Lunas",
        method: paymentMethod,
        source: 'POS',
        items: cart
      };

      setOrders(prev => [newOrder, ...prev]);
      setTransactions(prev => [{
        id: `TRX-${Date.now().toString().slice(-4)}`,
        type: "Masuk",
        category: "Penjualan",
        amount: total,
        date: new Date().toISOString().split('T')[0],
        status: "Selesai",
        method: paymentMethod,
        note: `Penjualan POS ${orderId}`
      }, ...prev]);

      // Update Stock
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
      });
      setProducts(updatedProducts);
      setCart([]);
      setAmountPaid('');
      notify("Transaksi Berhasil!", "success");
      // Trigger invoice after success
      onCheckoutSuccess(newOrder);
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
      {/* Product Grid */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Cari Produk atau Scan Barcode..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
              <button key={product.id} onClick={() => addToCart(product)} disabled={!product.isActive || product.stock === 0}
                className={`group flex flex-col text-left bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${!product.isActive || product.stock === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:border-emerald-200'}`}>
                <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-300 relative">
                  <Package size={32} />
                  {product.stock < 10 && product.stock > 0 && <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Sisa {product.stock}</span>}
                </div>
                <h4 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-tight mb-auto">{product.name}</h4>
                <div className="mt-3">
                  <div className="flex flex-col">
                    {product.discount > 0 && (
                      <span className="text-[10px] text-rose-400 line-through">{formatRupiah(product.price)}</span>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-emerald-600 font-bold text-sm">
                        {formatRupiah(product.price * (1 - (product.discount || 0) / 100))}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 px-1 rounded font-bold">-{product.discount}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col z-20 h-full">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Order Saat Ini</h3>
            <p className="text-xs text-slate-500">Order ID: POS-{new Date().getHours()}{new Date().getMinutes()}</p>
          </div>
          <button onClick={() => setCart([])} className="w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center text-rose-500 transition-colors" title="Reset Cart"><Trash2 size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="opacity-40" />
              </div>
              <p className="text-sm">Belum ada item dipilih</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400"><Package size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, e.target.value)}
                      className="w-12 h-7 text-xs border border-slate-200 rounded text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                    <span className="text-xs text-slate-500">@ {formatRupiah(item.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-bold text-slate-800 text-sm">{formatRupiah(item.price * item.qty)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl space-y-4">
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (0%)</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-lg pt-2 border-t border-slate-200">
              <span>Total Tagihan</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Jumlah Bayar</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">Rp</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="0"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                />
              </div>
            </div>

            {amountPaid && (
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{parseFloat(amountPaid) >= total ? 'Kembalian' : 'Sisa Hutang'}</span>
                <span className={`font-bold ${parseFloat(amountPaid) >= total ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatRupiah(Math.abs(parseFloat(amountPaid) - total))}
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {['Cash', 'QRIS', 'Transfer'].map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${paymentMethod === m ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCheckout} disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex justify-center items-center gap-2 transition-all active:scale-95
                        ${cart.length === 0 ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40'}`}>
            <span>Proses Pembayaran</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- REUSABLE COMPONENTS ---

const PeriodFilter = ({ period, setPeriod, date, setDate }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Current year and 9 years back

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        <Calendar size={14} /> Periode Laporan
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl h-fit">
          {['HARI', 'BULAN', 'TAHUN'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all ${period === p ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          {period === 'TAHUN' ? (
            <div className="relative">
              <select
                value={date.includes('-') ? date.split('-')[0] : date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Pilih Tahun</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          ) : (
            <input
              type={period === 'HARI' ? 'date' : 'month'}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const exportToExcel = (data, filename = 'laporan.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filterDataByPeriod = (data, period, date) => {
  if (!date) return data;
  return data.filter(item => {
    const itemDate = new Date(item.date);
    if (!item.date) return false;
    if (period === 'HARI') {
      return item.date === date;
    } else if (period === 'BULAN') {
      const [year, month] = date.split('-');
      return itemDate.getFullYear() === parseInt(year) && (itemDate.getMonth() + 1) === parseInt(month);
    } else if (period === 'TAHUN') {
      return itemDate.getFullYear() === parseInt(date);
    }
    return true;
  });
};

// 5. Category View (Functional)
const CategoryView = ({ categories, setCategories, notify, askConfirm }) => {
  const [newCat, setNewCat] = useState("");
  const [subCat, setSubCat] = useState("");

  const handleAdd = () => {
    if (!newCat) return;
    setCategories([...categories, { id: Date.now(), name: newCat, subCategories: subCat ? subCat.split(',').map(s => s.trim()) : [] }]);
    setNewCat(""); setSubCat("");
  };

  const handleDelete = (id) => {
    askConfirm("Hapus kategori ini?", () => {
      setCategories(categories.filter(c => c.id !== id));
      notify("Kategori berhasil dihapus", "success");
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Manajemen Kategori</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Kategori</label>
            <input value={newCat} onChange={e => setNewCat(e.target.value)} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Elektronik" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sub Kategori (Pisahkan Koma)</label>
            <input value={subCat} onChange={e => setSubCat(e.target.value)} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Kabel, Baterai, Lampu" />
          </div>
        </div>
        <div className="flex items-end">
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition-transform active:scale-95 flex items-center justify-center gap-2">
            <Plus size={20} /> Simpan Kategori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <List size={20} />
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">{cat.name}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.subCategories.length > 0 ? cat.subCategories.map((sub, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">{sub}</span>
              )) : <span className="text-sm text-slate-400 italic">Tidak ada sub-kategori</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Promo View (Functional)
const PromoView = ({ promos, setPromos, notify }) => {
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const addVoucher = () => {
    if (!code || !amount) return;
    setPromos([...promos, { id: Date.now(), type: 'Voucher', code, value: parseInt(amount), unit: 'IDR', active: true, desc }]);
    setCode(""); setAmount(""); setDesc("");
  };

  const togglePromo = (id) => {
    setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Promo & Voucher</h2>

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-end">
          <div className="flex-1 space-y-4 w-full">
            <h3 className="font-bold text-xl flex items-center gap-2"><Tag className="text-yellow-300" /> Buat Voucher Baru</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="KODE VOUCHER (ex: SALE50)" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm" />
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Nominal Potongan (Rp)" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm" />
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Keterangan Singkat" className="md:col-span-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm" />
            </div>
          </div>
          <button onClick={addVoucher} className="bg-yellow-400 text-yellow-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 shadow-lg shadow-yellow-500/30 transition-transform active:scale-95 whitespace-nowrap">
            Buat Voucher
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Kode / Judul</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Nilai</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {promos.map(promo => (
              <tr key={promo.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${promo.type === 'Voucher' ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {promo.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">{promo.title || promo.code}</td>
                <td className="px-6 py-4 text-slate-500">{promo.desc}</td>
                <td className="px-6 py-4 font-mono">{promo.value ? formatRupiah(promo.value) : '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => { togglePromo(promo.id); notify(`Promo ${promo.active ? 'dinonaktifkan' : 'diaktifkan'}`, "info"); }} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${promo.active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${promo.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 7. Order View (Functional)
const OrderView = ({ orders, setOrders, notify, askConfirm }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("HARI");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredOrders = filterDataByPeriod(orders, filterPeriod, filterDate);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const updatePaymentStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus: newStatus } : o));
  };

  const handleApproveOrder = (id) => {
    askConfirm("Setujui pesanan ini untuk diproses?", () => {
      updateStatus(id, "Process");
      notify("Pesanan disetujui", "success");
    });
  };

  const handleApprovePayment = (id) => {
    updatePaymentStatus(id, "Lunas");
    setShowPayment(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pesanan</h2>
          <p className="text-slate-500 text-sm">Kelola dan proses pesanan yang masuk.</p>
        </div>
        <button
          onClick={() => exportToExcel(filteredOrders, 'laporan-pesanan.csv')}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Printer size={18} /> Export Excel
        </button>
      </div>

      <PeriodFilter
        period={filterPeriod}
        setPeriod={setFilterPeriod}
        date={filterDate}
        setDate={setFilterDate}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 text-center">ID / Tgl</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Hari Kirim</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-emerald-600">{order.id}</div>
                    <div className="text-[10px] text-slate-400">{order.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{order.customer}</div>
                    <div className="text-xs text-slate-400">{order.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{order.deliveryDay || '-'}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{formatRupiah(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${order.paymentStatus === 'Lunas' ? 'text-emerald-600' : 'text-rose-500'}`}>{order.paymentStatus}</span>
                      <span className="text-[10px] text-slate-400">{order.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDetail(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Approve Order */}
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleApproveOrder(order.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                          title="Approve Order"
                        >
                          <Check size={16} />
                        </button>
                      )}

                      {/* Approve Pembayaran */}
                      {order.paymentStatus !== 'Lunas' && (
                        <button
                          onClick={() => { setSelectedOrder(order); setShowPayment(true); }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                          title="Approve Pembayaran"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}

                      {/* Dikirim */}
                      {(order.status === 'Process' || (order.status === 'Paid' && order.paymentStatus === 'Lunas')) && (
                        <button
                          onClick={() => updateStatus(order.id, 'Shipped')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Dikirim"
                        >
                          <Truck size={16} />
                        </button>
                      )}

                      {/* Selesai */}
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => updateStatus(order.id, 'Done')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                          title="Selesai"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {/* Dibatalkan */}
                      {['Pending', 'Draft', 'Process', 'Paid'].includes(order.status) && (
                        <button
                          onClick={() => { askConfirm("Batalkan pesanan ini?", () => { updateStatus(order.id, 'Batal'); notify("Pesanan dibatalkan", "info"); }); }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                          title="Dibatalkan"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Detail Pesanan {selectedOrder.id}</h3>
                <p className="text-sm text-slate-500">{selectedOrder.customer} - {selectedOrder.date}</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-2 text-left">Produk</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Harga</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-right">{formatRupiah(item.price)}</td>
                      <td className="px-4 py-3 text-right font-bold">{formatRupiah(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/50">
                    <td colSpan="3" className="px-4 py-4 text-right font-bold text-slate-600">Total Tagihan</td>
                    <td className="px-4 py-4 text-right font-bold text-xl text-emerald-600">{formatRupiah(selectedOrder.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Approval Modal */}
      {showPayment && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-50">
              <h3 className="text-xl font-bold text-amber-900">Konfirmasi Pembayaran</h3>
              <button onClick={() => setShowPayment(false)} className="text-amber-700 hover:text-amber-900 p-2"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 text-center">
              <p className="text-sm text-slate-600">Bukti transfer dari <strong>{selectedOrder.customer}</strong> senilai <strong>{formatRupiah(selectedOrder.total)}</strong></p>
              <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner">
                <img src={selectedOrder.paymentProof} alt="Bukti Bayar" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => handleApprovePayment(selectedOrder.id)}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
              >
                <Check size={20} /> Konfirmasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

// 8. Finance View (Updated with Transaction Form)
const FinanceView = ({ transactions, setTransactions, notify }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("HARI");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTrx, setNewTrx] = useState({ type: 'Keluar', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });

  const filteredTransactions = filterDataByPeriod(transactions, filterPeriod, filterDate);

  const handleAddTrx = () => {
    if (!newTrx.amount || !newTrx.category || !newTrx.note) return notify("Mohon lengkapi semua data transaksi", "error");

    const trx = {
      id: `TRX-${Date.now()}`,
      ...newTrx,
      amount: parseInt(newTrx.amount),
    };

    // Add to top of list
    setTransactions([trx, ...transactions]);
    setIsFormOpen(false);
    // Reset form but keep date
    setNewTrx({ type: 'Keluar', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
  };

  const income = filteredTransactions.filter(t => t.type === 'Masuk').reduce((a, b) => a + b.amount, 0);
  const expense = filteredTransactions.filter(t => t.type === 'Keluar').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h2>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredTransactions, 'laporan-keuangan.csv')}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={18} /> Export Excel
          </button>
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-700 flex items-center gap-2 shadow-lg shadow-slate-200 transition-all">
            {isFormOpen ? <X size={18} /> : <Plus size={18} />}
            {isFormOpen ? 'Tutup Form' : 'Catat Transaksi'}
          </button>
        </div>
      </div>

      <PeriodFilter
        period={filterPeriod}
        setPeriod={setFilterPeriod}
        date={filterDate}
        setDate={setFilterDate}
      />

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Catat Transaksi Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Jenis Transaksi</label>
              <select
                value={newTrx.type}
                onChange={e => setNewTrx({ ...newTrx, type: e.target.value })}
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="Keluar">Pengeluaran (Expense)</option>
                <option value="Masuk">Pemasukan (Income)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tanggal</label>
              <input type="date" value={newTrx.date} onChange={e => setNewTrx({ ...newTrx, date: e.target.value })} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
              <select
                value={newTrx.category}
                onChange={e => setNewTrx({ ...newTrx, category: e.target.value })}
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="">Pilih Kategori...</option>
                {newTrx.type === 'Keluar' ? (
                  <>
                    <option value="Operasional">Biaya Operasional</option>
                    <option value="Gaji">Gaji Karyawan</option>
                    <option value="Restock">Belanja Stok (Restock)</option>
                    <option value="Maintenance">Perbaikan & Maintenance</option>
                    <option value="Lainnya">Pengeluaran Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="Penjualan">Penjualan</option>
                    <option value="Investasi">Investasi / Modal</option>
                    <option value="Lainnya">Pemasukan Lainnya</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nominal (Rp)</label>
              <input type="number" value={newTrx.amount} onChange={e => setNewTrx({ ...newTrx, amount: e.target.value })} placeholder="0" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Keterangan</label>
              <input value={newTrx.note} onChange={e => setNewTrx({ ...newTrx, note: e.target.value })} placeholder="Contoh: Bayar Listrik" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end mt-2">
              <button onClick={handleAddTrx} className={`px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-colors ${newTrx.type === 'Masuk' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}>
                Simpan {newTrx.type}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><TrendingUp size={16} className="text-emerald-500" /> Total Pemasukan</p>
            <p className="text-4xl font-bold text-slate-800">{formatRupiah(income)}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">+12% dari bulan lalu</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><TrendingDown size={16} className="text-rose-500" /> Total Pengeluaran</p>
            <p className="text-4xl font-bold text-slate-800">{formatRupiah(expense)}</p>
            <p className="text-xs text-rose-600 mt-2 font-medium">+5% dari bulan lalu</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-lg">Mutasi Rekening & Kas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((trx, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{trx.date}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${trx.type === 'Masuk' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{trx.category}</span></td>
                  <td className="px-6 py-4 text-slate-800">{trx.note}</td>
                  <td className={`px-6 py-4 font-bold text-right ${trx.type === 'Masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trx.type === 'Masuk' ? '+' : '-'} {formatRupiah(trx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

// 9. User View (Functional)
const UserView = ({ users, setUsers }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Staff");

  const addUser = () => {
    if (!name) return;
    setUsers([...users, { id: Date.now(), name, email: `${name.toLowerCase().replace(' ', '')}@koperasi.id`, role, status: 'Active' }]);
    setName("");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama User Baru" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm flex-1 w-full focus:ring-2 focus:ring-emerald-500 outline-none bg-white" />
            <div className="flex gap-2 w-full sm:w-auto">
              <select value={role} onChange={e => setRole(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none flex-1">
                <option>Admin</option>
                <option>Staff</option>
                <option>Bendahara</option>
                <option>Owner</option>
              </select>
              <button onClick={addUser} className="bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200">Tambah</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Nama User</th>
                  <th className="px-6 py-4">Email Login</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">{user.role}</span></td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Akses Role</h3>
          <div className="space-y-3">
            {['Owner', 'Admin', 'Bendahara', 'Kepala Dapur'].map((r, i) => (
              <div key={r} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">{r}</span>
                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Full Access</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 10. Customer View (NEW & Functional)
const CustomerView = ({ customers, setCustomers, notify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: '', type: 'Member', phone: '' });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      notify("Nama dan Nomor HP wajib diisi!", "error");
      return;
    }
    const newEntry = {
      id: Date.now(),
      ...newCustomer,
      spending: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setCustomers([newEntry, ...customers]);
    setNewCustomer({ name: '', type: 'Member', phone: '' });
    setIsModalOpen(false);
    notify("Member baru berhasil ditambahkan!", "success");
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Data Pelanggan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Member</p>
            <h3 className="text-2xl font-bold text-slate-800">{customers.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Member Aktif</p>
            <h3 className="text-2xl font-bold text-slate-800">{customers.filter(c => c.type === 'Member').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Pertumbuhan</p>
            <h3 className="text-2xl font-bold text-slate-800">+12%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari pelanggan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Member Baru
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Tipe Member</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Total Belanja</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">Data tidak ditemukan</td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{cust.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cust.type === 'Kepala Dapur' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {cust.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" /> {cust.phone}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{formatRupiah(cust.spending)}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{cust.joinDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-emerald-600 transition-colors"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Tambah Member Baru</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Informasi Dasar Pelanggan</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all border border-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Nama Lengkap
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Nomor Handphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Contoh: 0812XXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Tipe Pelanggan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Member', 'Kepala Dapur'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewCustomer({ ...newCustomer, type })}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${newCustomer.type === type
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all border border-slate-200 bg-white"
              >
                Batal
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Simpan Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 11. Invoice Modal (NEW)
const InvoiceModal = ({ order, isOpen, onClose, formatRupiah }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in print:shadow-none print:w-full print:max-w-none">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">KOPERASI BERGAS</h2>
            <p className="text-sm text-slate-500">Jl. Jend. Sudirman No. 45, Semarang</p>
            <p className="text-sm text-slate-500">Telp: 0812-3456-7890</p>
          </div>

          <div className="border-t border-b border-dashed border-slate-200 py-4 flex justify-between text-sm">
            <div>
              <p className="text-slate-400">Invoice:</p>
              <p className="font-bold">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Tanggal:</p>
              <p className="font-bold">{order.date}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-100">
              <tr>
                <th className="text-left py-2 font-medium">Item</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 text-slate-700 font-medium">{item.name}</td>
                  <td className="py-3 text-center">{item.qty}</td>
                  <td className="py-3 text-right font-bold">{formatRupiah(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Totals */}
          <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">{formatRupiah(order.total)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-100 pt-2">
              <span>TOTAL</span>
              <span className="text-emerald-600">{formatRupiah(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
              <span>Bayar ({order.method})</span>
              <span>{formatRupiah(order.amountPaid || order.total)}</span>
            </div>
            {order.debt > 0 && (
              <div className="flex justify-between text-sm text-rose-500 font-bold">
                <span>Kurang Bayar</span>
                <span>{formatRupiah(order.debt)}</span>
              </div>
            )}
            {order.change > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-bold">
                <span>Kembalian</span>
                <span>{formatRupiah(order.change)}</span>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm font-bold text-slate-800 italic">Terima Kasih Atas Kunjungan Anda!</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 rounded-b-3xl print:hidden">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Tutup</button>
          <button onClick={handlePrint} className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all">
            <Printer size={18} /> Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};

// 12. POS History View
const POSHistoryView = ({ orders, setOrders, formatRupiah, getStatusColor, onPrintInvoice }) => {
  const [filterPeriod, setFilterPeriod] = useState("HARI");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const posOrders = orders.filter(o => o.source === 'POS' || o.customer === 'Walk-in Customer');
  const filteredOrders = filterDataByPeriod(posOrders, filterPeriod, filterDate);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  const handleUpdatePayment = () => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        const newDebt = Math.max(0, o.debt - amount);
        const newPaid = o.amountPaid + amount;
        return {
          ...o,
          amountPaid: newPaid,
          debt: newDebt,
          paymentStatus: newDebt === 0 ? 'Lunas' : 'Belum Lunas'
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    setIsPayModalOpen(false);
    setPayAmount('');
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Riwayat Transaksi POS</h2>
          <p className="text-slate-500 text-sm">Daftar semua transaksi yang dilakukan melalui kasir.</p>
        </div>
        <button
          onClick={() => exportToExcel(filteredOrders, 'riwayat-pos.csv')}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Printer size={18} /> Export Excel
        </button>
      </div>

      <PeriodFilter
        period={filterPeriod}
        setPeriod={setFilterPeriod}
        date={filterDate}
        setDate={setFilterDate}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Cari No. Invoice..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">No. Invoice</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Hutang</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400">Belum ada transaksi POS</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-emerald-600">{order.id}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">{order.method}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-4 font-bold text-rose-500">{order.debt > 0 ? formatRupiah(order.debt) : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.debt > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {order.debt > 0 ? 'Belum Lunas' : 'Lunas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {order.debt > 0 && (
                          <button
                            onClick={() => { setSelectedOrder(order); setIsPayModalOpen(true); }}
                            className="text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Bayar
                          </button>
                        )}
                        <button onClick={() => onPrintInvoice(order)} className="text-slate-400 hover:text-emerald-600 transition-colors" title="Print Struk">
                          <Printer size={18} />
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

      {isPayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Pelunasan Hutang</h3>
              <p className="text-sm text-slate-500">Invoice: {selectedOrder?.id}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex justify-between items-center">
                <span className="text-sm font-bold text-rose-700 uppercase">Sisa Hutang</span>
                <span className="text-lg font-bold text-rose-700">{formatRupiah(selectedOrder?.debt)}</span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Jumlah Bayar</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">Rp</span>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white outline-none font-bold"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setIsPayModalOpen(false); setPayAmount(''); }}
                className="py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleUpdatePayment}
                className="py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 13. Settings View (Functional Placeholder)
const SettingsView = () => (
  <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-slate-800">Pengaturan Aplikasi</h2>
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 mb-1">Profil Koperasi</h3>
        <p className="text-slate-500 text-sm">Informasi dasar koperasi yang tampil di invoice.</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Koperasi</label>
            <input defaultValue="Koperasi Sejahtera Bersama" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nomor Telepon</label>
            <input defaultValue="021-555-0192" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Lengkap</label>
            <textarea defaultValue="Jl. Jendral Sudirman No. 45, Jakarta Pusat" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 h-24"></textarea>
          </div>
        </div>
      </div>
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-colors">Simpan Perubahan</button>
      </div>
    </div>
  </div>
);

// 12. Payment Options View (NEW)
const PaymentOptionsView = ({ accounts, setAccounts, askConfirm, notify }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAcc, setNewAcc] = useState({ bankName: '', accountNumber: '', holderName: '' });

  const handleAdd = () => {
    if (!newAcc.bankName || !newAcc.accountNumber) return;
    setAccounts([...accounts, { id: Date.now(), ...newAcc }]);
    setNewAcc({ bankName: '', accountNumber: '', holderName: '' });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    askConfirm("Hapus opsi pembayaran ini?", () => {
      setAccounts(accounts.filter(a => a.id !== id));
      notify("Opsi pembayaran dihapus", "success");
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Opsi Pembayaran</h2>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-700 flex items-center gap-2">
          {isFormOpen ? <X size={18} /> : <Plus size={18} />}
          Tambah Opsi
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <div className="grid md:grid-cols-3 gap-4">
            <input value={newAcc.bankName} onChange={e => setNewAcc({ ...newAcc, bankName: e.target.value })} placeholder="Nama Bank (ex: Mandiri)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
            <input value={newAcc.accountNumber} onChange={e => setNewAcc({ ...newAcc, accountNumber: e.target.value })} placeholder="Nomor Rekening" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
            <input value={newAcc.holderName} onChange={e => setNewAcc({ ...newAcc, holderName: e.target.value })} placeholder="Nama Pemilik" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
            <div className="md:col-span-3 flex justify-end">
              <button onClick={handleAdd} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">Simpan Opsi</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-lg text-slate-800">{acc.bankName}</p>
              <p className="text-slate-500 font-mono text-sm">{acc.accountNumber}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{acc.holderName}</p>
            </div>
            <button onClick={() => handleDelete(acc.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 13. Purchase View (NEW)
const PurchaseView = ({ purchases, setPurchases, products, setProducts, notify }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("HARI");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPurchase, setNewPurchase] = useState({ productId: '', supplier: '', qty: '', unitCost: '' });

  const filteredPurchases = filterDataByPeriod(purchases, filterPeriod, filterDate);

  const handleAdd = () => {
    if (!newPurchase.productId || !newPurchase.qty || !newPurchase.unitCost) return;

    const product = products.find(p => p.id === parseInt(newPurchase.productId));
    const qty = parseInt(newPurchase.qty);
    const unitCost = parseInt(newPurchase.unitCost);

    const purchase = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      productId: product.id,
      productName: product.name,
      supplier: newPurchase.supplier,
      qty: qty,
      unitCost: unitCost,
      total: qty * unitCost,
      date: new Date().toISOString().split('T')[0],
      status: "Diterima"
    };

    setPurchases([purchase, ...purchases]);

    // Update Product Stock
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock + qty } : p));

    notify("Pembelian berhasil dicatat & Stok diperbarui", "success");
    setNewPurchase({ productId: '', supplier: '', qty: '', unitCost: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pembelian & Stok Masuk</h2>
          <p className="text-slate-500 text-sm">Catat penambahan stok dari supplier.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredPurchases, 'laporan-pembelian.csv')}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={18} /> Export Excel
          </button>
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-700 flex items-center gap-2">
            {isFormOpen ? <X size={18} /> : <Plus size={18} />}
            {isFormOpen ? 'Tutup Form' : 'Tambah Stok'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Produk</label>
              <select value={newPurchase.productId} onChange={e => setNewPurchase({ ...newPurchase, productId: e.target.value })} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                <option value="">Pilih Produk</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Supplier</label>
              <input
                type="text"
                value={newPurchase.supplier}
                onChange={e => setNewPurchase({ ...newPurchase, supplier: e.target.value })}
                placeholder="Nama Supplier"
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Jumlah (Qty)</label>
              <input type="number" value={newPurchase.qty} onChange={e => setNewPurchase({ ...newPurchase, qty: e.target.value })} placeholder="0" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Harga Beli Satuan</label>
              <input type="number" value={newPurchase.unitCost} onChange={e => setNewPurchase({ ...newPurchase, unitCost: e.target.value })} placeholder="Rp" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button onClick={handleAdd} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100">Simpan Pembelian</button>
            </div>
          </div>
        </div>
      )}

      <PeriodFilter
        period={filterPeriod}
        setPeriod={setFilterPeriod}
        date={filterDate}
        setDate={setFilterDate}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">ID / Tgl</th>
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4 text-right">Total Biaya</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPurchases.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{p.id}</div>
                  <div className="text-[10px] text-slate-400">{p.date}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{p.productName}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{p.supplier}</td>
                <td className="px-6 py-4 text-center font-bold text-emerald-600">+{p.qty}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-700">{formatRupiah(p.total)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 14. Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    info: <AlertCircle className="text-blue-500" size={20} />
  };

  const bgColors = {
    success: 'border-emerald-100 bg-emerald-50/90',
    error: 'border-rose-100 bg-rose-50/90',
    info: 'border-blue-100 bg-blue-50/90'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-slide-in-right ${bgColors[type]}`}>
      {icons[type]}
      <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{message}</p>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={16} /></button>
    </div>
  );
};

// 15. Confirmation Modal
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi</h3>
          <p className="text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="p-6 bg-slate-50 grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Batal</button>
          <button onClick={onConfirm} className="py-3.5 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all">Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

// 14. Marketplace Content View (NEW)
const MarketplaceContentView = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Konten Homepage Marketplace</h2>
          <p className="text-slate-500 text-sm">Atur banner, kategori unggulan, dan promo di halaman depan.</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200">Simpan Perubahan</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-emerald-500" /> Header Banners</h3>
          <div className="space-y-4">
            <div className="aspect-[21/9] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <span className="text-slate-400 text-sm">Banner 1 (1920x820)</span>
            </div>
            <div className="aspect-[21/9] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <span className="text-slate-400 text-sm">Banner 2</span>
            </div>
            <button className="text-emerald-600 font-bold text-sm underline">+ Tambah Banner</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Tag size={18} className="text-emerald-500" /> Produk Unggulan</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded mt-2"></div>
                </div>
                <button className="text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:bg-slate-50 hover:border-emerald-200 transition-all">Pilih Produk</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 15. Delivery Schedule View (NEW)
const DeliveryScheduleView = () => {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Jadwal Pengiriman Mingguan</h2>
        <p className="text-slate-500 text-sm">Atur kuota dan ketersediaan pengiriman.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</span>
            <div className="my-4 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck size={24} />
            </div>
            <div className="text-lg font-bold text-slate-800">20/50</div>
            <span className="text-[10px] text-slate-400 uppercase">Kuota Paket</span>
            <button className="mt-4 text-xs font-bold text-emerald-600 hover:underline">Edit Kuota</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // GLOBAL STATE
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [paymentAccounts, setPaymentAccounts] = useState(INITIAL_PAYMENT_ACCOUNTS);
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);

  const notify = (message, type = 'success') => setToast({ show: true, message, type });
  const askConfirm = (message, onConfirm) => setConfirmModal({ show: true, message, onConfirm });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView products={products} orders={orders} transactions={transactions} users={users} />;
      case 'products': return <ProductView products={products} setProducts={setProducts} categories={categories} notify={notify} askConfirm={askConfirm} />;
      case 'pos': return <POSView products={products} setProducts={setProducts} setTransactions={setTransactions} setOrders={setOrders} notify={notify} askConfirm={askConfirm} onCheckoutSuccess={(order) => setInvoiceToPrint(order)} />;
      case 'pos-history': return <POSHistoryView orders={orders} setOrders={setOrders} formatRupiah={formatRupiah} getStatusColor={getStatusColor} onPrintInvoice={(order) => setInvoiceToPrint(order)} />;
      case 'categories': return <CategoryView categories={categories} setCategories={setCategories} notify={notify} askConfirm={askConfirm} />;
      case 'promos': return <PromoView promos={promos} setPromos={setPromos} notify={notify} />;
      case 'orders': return <OrderView orders={orders} setOrders={setOrders} notify={notify} askConfirm={askConfirm} />;
      case 'finance': return <FinanceView transactions={transactions} setTransactions={setTransactions} notify={notify} />;
      case 'users': return <UserView users={users} setUsers={setUsers} notify={notify} />;
      case 'customers': return <CustomerView customers={customers} setCustomers={setCustomers} notify={notify} />;
      case 'purchase': return <PurchaseView purchases={purchases} setPurchases={setPurchases} products={products} setProducts={setProducts} notify={notify} />;
      case 'marketplace-homepage': return <MarketplaceContentView />;
      case 'delivery-schedule': return <DeliveryScheduleView />;
      case 'settings': return <SettingsView />;
      case 'payment-options': return <PaymentOptionsView accounts={paymentAccounts} setAccounts={setPaymentAccounts} askConfirm={askConfirm} />;
      default: return <DashboardView products={products} orders={orders} transactions={transactions} users={users} />;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
          <header className="h-20 glass-effect border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-lg">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-800 hidden md:block tracking-tight">
                {activeTab === 'pos' ? 'Point of Sale' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <input className="bg-slate-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all" placeholder="Pencarian global..." />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button className="relative text-slate-500 hover:text-emerald-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-sm font-bold text-slate-800">Billy</p>
                  <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Owner</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                  H
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-x-hidden">
            {renderContent()}
          </main>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        {confirmModal.show && (
          <ConfirmationModal
            message={confirmModal.message}
            onCancel={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
            onConfirm={() => { confirmModal.onConfirm(); setConfirmModal({ show: false, message: '', onConfirm: null }); }}
          />
        )}
        <InvoiceModal
          isOpen={!!invoiceToPrint}
          order={invoiceToPrint}
          onClose={() => setInvoiceToPrint(null)}
          formatRupiah={formatRupiah}
        />
      </div>
    </>
  );
};

export default App;