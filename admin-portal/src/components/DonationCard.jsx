import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const INITIAL_DONATION_DATA = {
  thisMonth: { count: 38, amount_pkr: 238000 },
  lastMonth: { count: 24, amount_pkr: 154000 }
};

const DonationStatusCard = () => {
  const [donationData] = useState(INITIAL_DONATION_DATA);

  // Chart data configuration
  const chartData = {
    labels: ['Monthly Inflow'],
    datasets: [
      {
        label: 'This Month (PKR)',
        data: [donationData.thisMonth.amount_pkr],
        backgroundColor: '#10b981', // Emerald green
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 8
      },
      {
        label: 'Last Month (PKR)',
        data: [donationData.lastMonth.amount_pkr],
        backgroundColor: '#cbd5e1', // Slate light gray
        borderColor: '#94a3b8',
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 13,
            family: 'Inter, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#072a1e',
        titleFont: {
          size: 13,
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 12,
          family: 'Inter, sans-serif'
        },
        callbacks: {
          label: (context) => `PKR ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: '#f1f5f9'
        },
        ticks: {
          callback: function(value) {
            return 'PKR ' + (value >= 1000 ? (value / 1000) + 'k' : value);
          },
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  };

  // Calculate percentage change (this month vs last month PKR)
  const lastMonthAmt = donationData.lastMonth.amount_pkr;
  const thisMonthAmt = donationData.thisMonth.amount_pkr;
  const percentageChange = lastMonthAmt > 0
    ? Math.round(((thisMonthAmt - lastMonthAmt) / lastMonthAmt) * 100)
    : 100;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif-editorial text-xl font-bold text-[#072a1e]">Donation Analytics Vault</h2>
          <p className="text-xs text-[#5f8574] mt-0.5">Alumni & Community Micro-Contributions</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          ↑ +{percentageChange}% vs Last Month
        </span>
      </div>

      <div className="h-56">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#e6f4ea] border border-[#c1e8d5] p-4 rounded-2xl">
          <p className="text-xs text-[#15803d] font-bold uppercase tracking-wider mb-1">This Month Inflow</p>
          <p className="text-2xl font-black text-[#072a1e]">PKR {donationData.thisMonth.amount_pkr.toLocaleString()}</p>
          <p className="text-xs text-[#5f8574] mt-1 font-medium">{donationData.thisMonth.count} micro-donations received</p>
        </div>
        
        <div className="bg-[#f8fcf9] border border-[#d8ede1] p-4 rounded-2xl">
          <p className="text-xs text-[#5f8574] font-bold uppercase tracking-wider mb-1">Last Month Inflow</p>
          <p className="text-2xl font-black text-gray-700">PKR {donationData.lastMonth.amount_pkr.toLocaleString()}</p>
          <p className="text-xs text-[#5f8574] mt-1 font-medium">{donationData.lastMonth.count} micro-donations recorded</p>
        </div>
      </div>
    </div>
  );
};

export default DonationStatusCard;