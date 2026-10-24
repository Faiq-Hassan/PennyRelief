import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DonationStatusCard = () => {
  const [donationData, setDonationData] = useState({
    thisMonth: { count: 0, amount_pkr: 0 },
    lastMonth: { count: 0, amount_pkr: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint
        const response = await axios.get(ADMIN_API_ENDPOINTS.fetchDonations);
        
        if (response.data && response.data.data && response.data.data.summary) {
          const summary = response.data.data.summary;
          setDonationData({
            thisMonth: {
              count: summary.thisMonth?.count || 0,
              amount_pkr: summary.thisMonth?.amount_pkr || 0
            },
            lastMonth: {
              count: summary.lastMonth?.count || 0,
              amount_pkr: summary.lastMonth?.amount_pkr || 0
            }
          });
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (err) {
        console.error('Error fetching donation data:', err);
        setError(err.message || 'Failed to load donation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, []);

  // Chart data configuration
  const chartData = {
    labels: ['Donations'],
    datasets: [
      {
        label: 'This Month (PKR)',
        data: [donationData.thisMonth.amount_pkr],
        backgroundColor: '#4f46e5', // More vibrant blue
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 4 // Rounded corners for bars
      },
      {
        label: 'Last Month (PKR)',
        data: [donationData.lastMonth.amount_pkr],
        backgroundColor: '#e5e7eb', // Lighter gray
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 4 // Rounded corners for bars
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
            size: 14,
            family: 'Inter, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: {
          size: 14,
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 13,
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
          color: '#e5e7eb'
        },
        ticks: {
          callback: function(value) {
            return 'PKR ' + value.toLocaleString();
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
    : thisMonthAmt > 0 ? 100 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif-editorial text-xl font-bold text-[#072a1e]">Donation Analytics Vault</h2>
        {!loading && !error && (
          <span className={`text-sm font-medium px-2 py-1 rounded-md ${
            percentageChange >= 0 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}%
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-4">
          <svg className="w-12 h-12 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 font-medium mb-2">Error loading data</p>
          <p className="text-gray-500 text-sm max-w-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={options}
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium mb-1">This Month</p>
              <p className="text-2xl font-semibold text-gray-800">PKR {donationData.thisMonth.amount_pkr.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{donationData.thisMonth.count} donations</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-1">Last Month</p>
              <p className="text-2xl font-semibold text-gray-800">PKR {donationData.lastMonth.amount_pkr.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{donationData.lastMonth.count} donations</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationStatusCard;