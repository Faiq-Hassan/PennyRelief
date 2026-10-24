import { FiDollarSign, FiCreditCard, FiCalendar, FiUser, FiLink, FiActivity } from 'react-icons/fi';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DUMMY_PAYMENTS = [
  {
    payment_id: 'PR-DON-2026-001',
    customer: { name: 'Dr. Tariq Mahmood (Alumni Chair)', email: 'tariq.m@nfc.edu.pk' },
    payment_link: { name: 'Emergency Tuition Relief Fund' },
    amount: { usd: 150, pkr: 42000 },
    fee: { usd: 3.5 },
    payment_method: { type: 'card', details: { brand: 'Mastercard', last4: '8842' } },
    created: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'succeeded'
  },
  {
    payment_id: 'PR-DON-2026-002',
    customer: { name: 'Engr. Ayesha Malik (Class of 2018)', email: 'ayesha.m@alumni.edu.pk' },
    payment_link: { name: 'Semester Lab & Exam Grants' },
    amount: { usd: 100, pkr: 28000 },
    fee: { usd: 2.3 },
    payment_method: { type: 'card', details: { brand: 'Visa', last4: '4129' } },
    created: new Date(Date.now() - 3600000 * 14).toISOString(),
    status: 'succeeded'
  },
  {
    payment_id: 'PR-DON-2026-003',
    customer: { name: 'NFC Student Welfare Foundation', email: 'welfare@nfc.edu.pk' },
    payment_link: { name: 'General Student Aid Pool' },
    amount: { usd: 250, pkr: 70000 },
    fee: { usd: 5.0 },
    payment_method: { type: 'card', details: { brand: 'Visa', last4: '9901' } },
    created: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'succeeded'
  },
  {
    payment_id: 'PR-DON-2026-004',
    customer: { name: 'Prof. Junaid Akhtar', email: 'junaid.a@nfc.edu.pk' },
    payment_link: { name: 'Hostel & Mess Sustenance Relief' },
    amount: { usd: 50, pkr: 14000 },
    fee: { usd: 1.2 },
    payment_method: { type: 'card', details: { brand: 'Mastercard', last4: '3310' } },
    created: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'succeeded'
  },
  {
    payment_id: 'PR-DON-2026-005',
    customer: { name: 'Overseas Alumni Network UK', email: 'uk-alumni@pennyrelief.org' },
    payment_link: { name: 'Final Year Capstone Project Aid' },
    amount: { usd: 300, pkr: 84000 },
    fee: { usd: 6.8 },
    payment_method: { type: 'card', details: { brand: 'Visa', last4: '7723' } },
    created: new Date(Date.now() - 3600000 * 96).toISOString(),
    status: 'succeeded'
  }
];

const PaymentTable = () => {
  const [payments] = useState(DUMMY_PAYMENTS);
  const [testMode] = useState(false);
  const [summary] = useState({
    totalPayments: 62,
    totalAmountUSD: 1395,
    totalAmountPKR: 392000,
    successfulPayments: 62,
    totalFeesUSD: 24.50
  });
  const [analytics] = useState({
    thisMonth: { count: 38, amount_usd: 850, amount_pkr: 238000, fees_usd: 15.20 },
    lastMonth: { count: 24, amount_usd: 545, amount_pkr: 154000, fees_usd: 9.30 }
  });

  const exportLedgerCSV = () => {
    if (payments.length === 0) return;
    const header = ['Customer Name', 'Customer Email', 'Payment Link', 'Amount (USD)', 'Amount (PKR)', 'Fee (USD)', 'Method', 'Date', 'Status'];
    const rows = payments.map(p => [
      p.customer?.name || 'N/A',
      p.customer?.email || 'N/A',
      p.payment_link?.name || 'N/A',
      p.amount?.usd || '',
      p.amount?.pkr || '',
      p.fee?.usd || '',
      p.payment_method?.details?.brand ? `${p.payment_method.details.brand} ****${p.payment_method.details.last4}` : (p.payment_method?.type || 'N/A'),
      p.created ? new Date(p.created).toLocaleString() : 'N/A',
      p.status || 'N/A',
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PennyRelief_Donations_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = {
    labels: ['Donations Inflow'],
    datasets: [
      {
        label: 'This Month (PKR)',
        data: [analytics.thisMonth.amount_pkr],
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 8
      },
      {
        label: 'Last Month (PKR)',
        data: [analytics.lastMonth.amount_pkr],
        backgroundColor: '#cbd5e1',
        borderColor: '#94a3b8',
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => `PKR ${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => 'PKR ' + value.toLocaleString()
        }
      }
    }
  };

  return (
    <div className="bg-transparent px-4 sm:px-6 py-4 font-sans text-[#072a1e]">
      {/* Chart */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-4 sm:p-6 mb-6">
        <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#072a1e] mb-4">Monthly Community Micro-Donation Inflow</h2>
        <div className="h-64 sm:h-80">
          <Bar data={chartData} options={options} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-4 text-[#5f8574] text-xs font-semibold">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div>
            This Month: {analytics.thisMonth.count} micro-donations (PKR {analytics.thisMonth.amount_pkr.toLocaleString()})
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#cbd5e1] rounded-full mr-2"></div>
            Last Month: {analytics.lastMonth.count} micro-donations (PKR {analytics.lastMonth.amount_pkr.toLocaleString()})
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">Micro-Donation Transactions Ledger</h1>
            <p className="text-[#5f8574] text-xs mt-0.5">Community contributions routed via Student Welfare Trust for emergency relief</p>
          </div>
          <button
            onClick={exportLedgerCSV}
            disabled={payments.length === 0}
            className="px-4 py-2 bg-[#e2f3e9] hover:bg-[#c1e8d5] text-[#072a1e] font-bold rounded-xl text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {[
            {
              label: 'Total Donations',
              value: summary.totalPayments,
              icon: <FiDollarSign className="text-emerald-700 text-xl" />,
              color: 'bg-emerald-100'
            },
            {
              label: 'Total Inflow (USD)',
              value: `$${summary.totalAmountUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              icon: <FiCreditCard className="text-blue-700 text-xl" />,
              color: 'bg-blue-100'
            },
            {
              label: 'Total Inflow (PKR)',
              value: `PKR ${summary.totalAmountPKR.toLocaleString()}`,
              icon: <FiUser className="text-purple-700 text-xl" />,
              color: 'bg-purple-100'
            },
            {
              label: 'Processing Fees (USD)',
              value: `$${summary.totalFeesUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              icon: <FiActivity className="text-amber-700 text-xl" />,
              color: 'bg-amber-100'
            }
          ].map((card, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-[#d8ede1] flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs font-semibold">{card.label}</p>
                <p className="text-xl font-bold text-[#072a1e] mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#d8ede1]">
              <thead className="bg-[#eef7f2] text-[#072a1e]">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                    Donor / Benefactor
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                    Allocation Purpose
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                    Amount (PKR)
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                    Date & Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#d8ede1]/60">
                {payments.map((p, index) => (
                  <tr key={index} className="hover:bg-[#f8fcf9] transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#072a1e]">{p.customer?.name}</div>
                      <div className="text-xs text-[#5f8574]">{p.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-[#072a1e] bg-[#eef7f2] px-2.5 py-1 rounded-lg">
                        {p.payment_link?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-emerald-800">
                        PKR {Number(p.amount?.pkr || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#5f8574]">${p.amount?.usd} USD</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#072a1e]">
                      {p.payment_method?.details?.brand} •••• {p.payment_method?.details?.last4}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Disbursed
                      </span>
                      <div className="text-[10px] text-[#5f8574] mt-0.5">
                        {new Date(p.created).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
