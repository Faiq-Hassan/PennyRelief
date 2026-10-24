import { FiDollarSign, FiCreditCard, FiCalendar, FiUser, FiLink, FiActivity } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmountUSD: 0,
    totalAmountPKR: 0,
    successfulPayments: 0,
    totalFeesUSD: 0
  });
  const [analytics, setAnalytics] = useState({
    thisMonth: { count: 0, amount_usd: 0, amount_pkr: 0, fees_usd: 0 },
    lastMonth: { count: 0, amount_usd: 0, amount_pkr: 0, fees_usd: 0 }
  });
  const [accountBalance, setAccountBalance] = useState({
    available: { usd: 0, pkr: 0 },
    pending: { usd: 0, pkr: 0 }
  });
  const [exchangeRate, setExchangeRate] = useState(280);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(ADMIN_API_ENDPOINTS.fetchDonations);
      if (response.data?.success) {
        setPayments(response.data.data?.payments || []);
        setTestMode(response.data.testMode || false);
        if (response.data.data?.account_balance) {
          setAccountBalance(response.data.data.account_balance);
        }
        if (response.data.data?.exchange_rate) {
          setExchangeRate(response.data.data.exchange_rate);
        }
        if (response.data.data?.summary) {
          setAnalytics(response.data.data.summary);
          const s = response.data.data.summary;
          setSummary({
            totalPayments: s.thisMonth.count + s.lastMonth.count,
            totalAmountUSD: s.thisMonth.amount_usd + s.lastMonth.amount_usd,
            totalAmountPKR: s.thisMonth.amount_pkr + s.lastMonth.amount_pkr,
            successfulPayments: s.thisMonth.count + s.lastMonth.count,
            totalFeesUSD: s.thisMonth.fees_usd + s.lastMonth.fees_usd
          });
        }
      } else {
        throw new Error('Unexpected data format from server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch donation records');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: ['Donations'],
    datasets: [
      {
        label: 'This Month (PKR)',
        data: [analytics.thisMonth.amount_pkr],
        backgroundColor: '#1d4ed8',
        borderColor: '#1d4ed8',
        borderWidth: 1
      },
      {
        label: 'Last Month (PKR)',
        data: [analytics.lastMonth.amount_pkr],
        backgroundColor: '#d1d5db',
        borderColor: '#d1d5db',
        borderWidth: 1
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full rounded">
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <div className="w-3 h-3 bg-[#ff8f6b] rounded-full mr-2"></div>
            This Month: {analytics.thisMonth.count} micro-donations (PKR {analytics.thisMonth.amount_pkr.toLocaleString()})
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#c1e8d5] rounded-full mr-2"></div>
            Last Month: {analytics.lastMonth.count} micro-donations (PKR {analytics.lastMonth.amount_pkr.toLocaleString()})
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">Micro-Donation Transactions Ledger</h1>
            <p className="text-[#5f8574] text-xs mt-0.5">Community contributions routed via Stripe & PayFast for student emergency relief</p>
            {testMode && <div className="text-xs font-bold text-amber-700 mt-1">● Sandbox Mode: Active Ledger Simulator</div>}
          </div>
          <button
            onClick={exportLedgerCSV}
            disabled={payments.length === 0}
            className="px-4 py-2 bg-[#e2f3e9] hover:bg-[#c1e8d5] text-[#072a1e] font-bold rounded-xl text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {[
            {
              label: 'Total Payments',
              value: summary.totalPayments,
              icon: <FiDollarSign className="text-blue-600 text-xl" />,
              color: 'bg-blue-100'
            },
            {
              label: 'Total Amount (USD)',
              value: `$${summary.totalAmountUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              icon: <FiCreditCard className="text-green-600 text-xl" />,
              color: 'bg-green-100'
            },
            {
              label: 'Total Amount (PKR)',
              value: `PKR ${summary.totalAmountPKR.toLocaleString()}`,
              icon: <FiUser className="text-purple-600 text-xl" />,
              color: 'bg-purple-100'
            },
            {
              label: 'Total Fees (USD)',
              value: `$${summary.totalFeesUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              icon: <FiActivity className="text-red-600 text-xl" />,
              color: 'bg-red-100'
            }
          ].map((card, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Payment Link', 'Amount', 'Payment Method', 'Date', 'Status'].map((h, idx) => (
                  <th key={idx} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{payment.customer?.name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{payment.customer?.email || 'No email'}</div>
                        {payment.customer?.phone && (
                          <div className="text-xs text-gray-400 mt-1">{payment.customer.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiLink className="text-indigo-600 mr-2" />
                      <div>
                        <div className="font-medium text-sm">{payment.payment_link?.name || 'Unnamed Product'}</div>
                        <a href={payment.payment_link?.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                          View Payment Link
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <FiDollarSign className="text-green-600 mr-2" />
                        <span className="text-sm font-medium">
                          {payment.amount.original_currency === 'usd' ? '$' : ''}
                          {payment.amount.original.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          {payment.amount.original_currency === 'pkr' ? ' PKR' : ''}
                        </span>
                      </div>
                      {payment.amount.usd && (
                        <div className="text-xs text-gray-500">
                          ${payment.amount.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      {payment.amount.pkr && (
                        <div className="text-xs text-gray-500">
                          PKR {payment.amount.pkr.toLocaleString()}
                        </div>
                      )}
                      {payment.fee && (
                        <div className="text-xs text-red-500 mt-1">
                          Fee: ${payment.fee.usd?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 'N/A'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCreditCard className="text-indigo-600 mr-2" />
                      <div>
                        {payment.payment_method?.details?.brand ? (
                          <>
                            {payment.payment_method.details.brand.toUpperCase()} •••• {payment.payment_method.details.last4}
                            <div className="text-xs text-gray-500">Exp: {payment.payment_method.details.exp_month}/{payment.payment_method.details.exp_year}</div>
                          </>
                        ) : payment.payment_method?.type ? (
                          payment.payment_method.type.toUpperCase()
                        ) : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm">{new Date(payment.created).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(payment.created).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;
