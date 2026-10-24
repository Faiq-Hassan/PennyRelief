import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { FaUserShield, FaLock, FaEye, FaEyeSlash, FaDownload, FaFilePdf, FaRegFilePdf, FaFileExport, FaRobot, FaGraduationCap, FaCoins, FaChartBar, FaBolt, FaUniversity } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import Loan from '../components/Loan';
import PayerDetailsTable from '../components/PayersDetails';
import DonationStatusCard from '../components/DonationCard';
import AiPipelineView from '../components/AiPipelineView';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';
import { generateExecutiveReliefPDF, generateIndividualVoucherPDF, SAMPLE_RELIEF_DATA } from '../utils/pdfGenerator';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [users, setUsers] = useState([]); // State for user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedUser, setSelectedUser] = useState(null);
  const [status , setStatusCount] = useState({ approved: 0, pending: 0, rejected: 0 });
  const navigate = useNavigate();

const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ADMIN_API_ENDPOINTS.fetchUsers);
      const statusRes = await axios.get(ADMIN_API_ENDPOINTS.loanstatus);
      const statusCount = statusRes.data.statusCounts || { approved: 0, pending: 0, rejected: 0 };
      if (response.status === 200 && response.data?.users && statusRes.status === 200) {
        setUsers(response.data.users);
        // Normalize all keys to lowercase so display always matches
        setStatusCount({
          approved: statusCount.approved || statusCount.Approved || 0,
          pending:  statusCount.pending  || statusCount.Pending  || 0,
          rejected: statusCount.rejected || statusCount.Rejected || 0,
        });
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setModalMessage('Failed to load user data');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const donationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    amounts: [12000, 19000, 15000, 28000, 22000, 32000],
    thisMonth: 45,
    lastMonth: 32,
  };

  // User data by department
// Replace the hardcoded userData with a computed version
 const userData = {
    total: users.length,
    departments: users.reduce((acc, user) => {
      const dept = user.Dept || 'UNKNOWN';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {})
  };


  // Sample user details data
  // Sample loan applications data

  // Sample donations data
  const donations = [
    {
      id: 1,
      name: 'Ali Khan',
      department: 'CHEM',
      amount: 5000,
      date: '2023-06-15',
      method: 'JazzCash',
      status: 'completed',
      profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Hassnat Asim',
      department: 'SCS',
      amount: 3000,
      date: '2023-06-14',
      method: 'EasyPaisa',
      status: 'completed',
      profilePhoto: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    {
      id: 3,
      name: 'Hamza Naeem',
      department: 'CIVIL',
      amount: 2000,
      date: '2023-06-13',
      method: 'Bank Transfer',
      status: 'completed',
      profilePhoto: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    {
      id: 4,
      name: 'Umer Shahid',
      department: 'ELEC',
      amount: 10000,
      date: '2023-06-12',
      method: 'Credit Card',
      status: 'pending',
      profilePhoto: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    {
      id: 5,
      name: 'Hamza Maqsood',
      department: 'MECH',
      amount: 7500,
      date: '2023-06-11',
      method: 'JazzCash',
      status: 'completed',
      profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
  ];

  const chartData = {
    labels: donationData.labels,
    datasets: [
      {
        label: 'Donations (PKR)',
        data: donationData.amounts,
        backgroundColor: '#11408c',
        borderRadius: 6,
      },
    ],
  };

  const userChartData = {
    labels: Object.keys(userData.departments),
    datasets: [
      {
        data: Object.values(userData.departments),
        backgroundColor: [
          '#11408c',
          '#2c5282',
          '#4a6fa5',
          '#6d8dc5',
          '#93b0e1'
        ],
        borderWidth: 1,
      },
    ],
  };
  // Handle user actions
const handleViewUser = (userId) => {
  const user = users.find(u => (u._id || u.id) === userId);
  setSelectedUser(user);
  setShowModal(true);
};

  const handleDeleteUser = async (userId) => {
   try {
      setLoading(true)
      await axios.delete(`${ADMIN_API_ENDPOINTS.deleteuser}/${userId}`);
      setUsers(prevUsers => prevUsers.filter(u => (u._id || u.id) != userId))
      setModalMessage('User Deleted Succesfully')
      setShowModal(true);
    
   } catch (error) {
    setError(error.message)
    setModalMessage('Failed to delete this user')
    setShowModal(true);    
   }finally{
    setLoading(false)
   }
  };


const exportAllUsers = (format = 'pdf') => {
  if (format === 'pdf') {
    generateAllUsersPDF();
  } else {
    if (users.length === 0) {
      setModalMessage('No user records currently in database for Excel export.');
      setShowModal(true);
      return;
    }
    generateAllUsersExcel();
  }
};

const generateAllUsersPDF = async () => {
  try {
    setLoading(true);
    await generateExecutiveReliefPDF(users);
    setModalMessage('Official PennyRelief Executive Disbursal Audit Report downloaded successfully!');
    setShowModal(true);
  } catch (error) {
    console.error('Error generating PDF:', error);
    setModalMessage('Failed to generate PDF: ' + error.message);
    setShowModal(true);
  } finally {
    setLoading(false);
  }
};
const generateAllUsersExcel = () => {
  // You'll need to install 'xlsx' package first: npm install xlsx
  import('xlsx').then((XLSX) => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map(user => ({
        PHOTO: user.profileImage ? user.profileImage : 'N/A',
        ID: user._id || user.id,
        Name: user.StudentName || user.name || 'N/A',
        Email: user.email || 'N/A',
        Department: user.Dept || user.department || 'N/A',
        'Registration No': user.RegNo || user.registrationNumber || 'N/A',
        Status: user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'N/A',
        'Join Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Auto-size columns
    worksheet['!cols'] = [
      { wch: 25 }, // ID
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Department
      { wch: 15 }, // Reg No
      { wch: 10 }, // Status
      { wch: 15 }  // Join Date
    ];
    
    XLSX.writeFile(workbook, `100sRupweeBank_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
  });
};
  // Generate PDF for user details
  const generateUserPDF = (user) => {
    const doc = new jsPDF();
    
    doc.setProperties({
    title: `User Report - ${user.StudentName}`,
    subject: 'User Details',
    author: "PennyRelief",
    creator: "PennyRelief Student Aid Admin Portal"
  });

  // Add bank logo and header
  doc.setFontSize(20);
  doc.setTextColor(17, 64, 140); // Brand color
  doc.setFont('helvetica', 'bold');
  doc.text("PennyRelief • Relief Bank", 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('User Details Report', 105, 30, { align: 'center' });

  // Add horizontal line
  doc.setDrawColor(17, 64, 140);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Add user image with border
  if (user.profileImage) {
    doc.rect(80, 45, 50, 50); // Border around image
    doc.addImage(user.profileImage, 'JPEG', 85, 50, 40, 40);
  }

  // Add user details section
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  
  // Left column
  doc.text('User Information:', 20, 110);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID: ${user._id}`, 20, 120);
  doc.text(`Name: ${user.StudentName}`, 20, 130);
  doc.text(`Email: ${user.email}`, 20, 140);
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Account Details:', 110, 110);
  doc.setFont('helvetica', 'normal');
  doc.text(`Department: ${user.Dept}`, 110, 120);
  doc.text(`Registration No: ${user.RegNo}`, 110, 130);
  doc.text(`Status: ${user.status}`, 110, 140);

  // Add additional details section
  doc.setFont('helvetica', 'bold');
  doc.text('Additional Information:', 20, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Member since: ' + new Date().toLocaleDateString('en-PK', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }), 20, 170);
  
  // Add footer with timestamp
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Report generated on: ${new Date().toLocaleString()}`, 20, 280);
  
  doc.setFontSize(8);
  doc.setTextColor(17, 64, 140);
  doc.text("100's Rupwee Bank - Confidential", 105, 290, { align: 'center' });
  
  // Add page border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 280);

  // Save the PDF
  doc.save(`100sRupweeBank_UserReport_${user.StudentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

  };


  // // Generate PDF for loan application
  // const generateLoanPDF = (application) => {
  //   const doc = new jsPDF();
    
  //   // Add title
  //   doc.setFontSize(18);
  //   doc.text('Loan Application Details', 105, 15, { align: 'center' });
    
  //   // Add applicant image
  //   doc.addImage(application.profilePhoto, 'JPEG', 85, 25, 40, 40);
    
  //   // Add application details
  //   doc.setFontSize(12);
  //   doc.text(`Application ID: ${application.id}`, 20, 80);
  //   doc.text(`Applicant: ${application.applicant}`, 20, 90);
  //   doc.text(`Amount: PKR ${application.amount.toLocaleString()}`, 20, 100);
  //   doc.text(`Purpose: ${application.purpose}`, 20, 110);
  //   doc.text(`Application Date: ${application.date}`, 20, 120);
  //   doc.text(`Status: ${application.status.charAt(0).toUpperCase() + application.status.slice(1)}`, 20, 130);
    
  //   // Add documents section
  //   doc.text('Submitted Documents:', 20, 150);
  //   application.documents.forEach((doc, index) => {
  //     doc.text(`- ${doc}`, 25, 160 + (index * 10));
  //   });
    
  //   // Add footer
  //   doc.setFontSize(10);
  //   doc.setTextColor(150);
  //   doc.text('PennyRelief - Loan Application Report', 105, 290, { align: 'center' });
    
  //   // Save the PDF
  //   doc.save(`loan_application_${application.id}.pdf`);
  // };

  // Generate PDF for all users
  // const generateAllUsersPDF = () => {
  //   const doc = new jsPDF();
    
  //   // Add title
  //   doc.setFontSize(18);
  //   doc.text('All Users Report', 105, 15, { align: 'center' });
    
  //   // Add table
  //   const userDataForTable = users.map(user => [
  //     user.id,
  //     user.name,
  //     user.email,
  //     user.department,
  //     user.registrationDate,
  //     user.status.charAt(0).toUpperCase() + user.status.slice(1)
  //   ]);
    
  //   doc.autoTable({
  //     startY: 25,
  //     head: [['ID', 'Name', 'Email', 'Department', 'Registration Date', 'Status']],
  //     body: userDataForTable,
  //     theme: 'grid',
  //     headStyles: {
  //       fillColor: [17, 64, 140] // PennyRelief brand color
  //     }
  //   });
    
  //   // Add footer
  //   doc.setFontSize(10);
  //   doc.setTextColor(150);
  //   doc.text(`Generated on ${new Date().toLocaleDateString()} - PennyRelief`, 105, doc.lastAutoTable.finalY + 10, { align: 'center' });
    
  //   // Save the PDF
  //   doc.save('all_users_report.pdf');
  // };

  // // Generate PDF for all loan applications
  // const generateAllLoansPDF = () => {
  //   const doc = new jsPDF();
    
  //   // Add title
  //   doc.setFontSize(18);
  //   doc.text('All Loan Applications Report', 105, 15, { align: 'center' });
    
  //   // Add table
  //   const loanDataForTable = loanApplications.map(loan => [
  //     loan.id,
  //     loan.applicant,
  //     `PKR ${loan.amount.toLocaleString()}`,
  //     loan.purpose,
  //     loan.date,
  //     loan.status.charAt(0).toUpperCase() + loan.status.slice(1)
  //   ]);
    
  //   doc.autoTable({
  //     startY: 25,
  //     head: [['ID', 'Applicant', 'Amount', 'Purpose', 'Date', 'Status']],
  //     body: loanDataForTable,
  //     theme: 'grid',
  //     headStyles: {
  //       fillColor: [17, 64, 140] // PennyRelief brand color
  //     }
  //   });
    
  //   // Add footer
  //   doc.setFontSize(10);
  //   doc.setTextColor(150);
  //   doc.text(`Generated on ${new Date().toLocaleDateString()} - PennyRelief`, 105, doc.lastAutoTable.finalY + 10, { align: 'center' });
    
  //   // Save the PDF
  //   doc.save('all_loan_applications_report.pdf');
  // };

  // // Handle loan application actions
  // const handleDownloadApplication = (applicationId) => {
  //   const application = loanApplications.find(app => app.id === applicationId);
  //   if (application) {
  //     generateLoanPDF(application);
  //   }
  // };

  const handleUpdateStatus = (applicationId, newStatus) => {
    console.log(`Updating application ${applicationId} to ${newStatus}`);
    setModalMessage(`Application ${applicationId} status updated to ${newStatus}`);
    setShowModal(true);
  };

  // // Handle donation actions
  // const handleExportDonations = () => {
  //   console.log('Exporting donations data, users, and loan applications');
  //   setModalMessage('Exporting all users and loan applications to PDF, and donations data (functionality not implemented)');
  //   setShowModal(true);
  //   // Trigger PDF generation for all users and all loan applications
  //   generateAllUsersPDF();
  //   generateAllLoansPDF();
  // };

  const handleViewDonation = (donationId) => {
    console.log('View donation:', donationId);
    setModalMessage(`Viewing donation ID: ${donationId}`);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3fbf6] font-sans text-[#072a1e]">
      {/* Executive Top Bar */}
      <header className="bg-[#072a1e] text-white shadow-xl border-b border-[#1b5840]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src="/logo.jpg"
                alt="PennyRelief Emblem"
                className="h-12 w-12 rounded-2xl object-cover shadow-lg border border-[#34d399]/40"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif-editorial text-2xl md:text-3xl font-bold tracking-tight text-white">
                    PennyRelief • Student Aid Portal
                  </h1>
                  <span className="bg-[#34d399]/20 text-[#34d399] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#34d399]/30">
                    Executive Admin
                  </span>
                </div>
                <p className="text-xs text-emerald-200/70 mt-1 flex items-center gap-2">
                  <span>Automated Need-Based Micro-Donation & Relief Loan Management</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[#34d399] flex items-center gap-1 font-mono font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
                    Atlas DB & Gemini AI Active
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              {/* PDF Actions */}
              <button
                onClick={() => generateExecutiveReliefPDF(users)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#ff8f6b] hover:bg-[#ff7a52] rounded-xl shadow-lg shadow-[#ff8f6b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Download Official Multi-Student Audit Disbursal Ledger PDF"
              >
                <FaDownload className="text-xs" />
                <span>Audit PDF</span>
              </button>
              <button
                onClick={() => generateIndividualVoucherPDF()}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-emerald-100 bg-[#0b3324] hover:bg-[#134934] rounded-xl border border-[#34d399]/30 hover:border-[#34d399] transition-all cursor-pointer"
                title="Download Official Individual Student Relief Voucher (Certificate PDF)"
              >
                <FaFilePdf className="text-xs text-[#34d399]" />
                <span>Voucher PDF</span>
              </button>

              <div className="hidden lg:flex flex-col text-right pl-2 border-l border-emerald-900/40">
                <span className="text-xs font-bold text-white">System Administrator</span>
                <span className="text-xs font-mono text-emerald-300">admin@pennyrelief.org</span>
              </div>
              <button
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#0b3324] hover:bg-[#ff8f6b] rounded-xl border border-[#1b5840] hover:border-[#ff8f6b] transition-all duration-200 shadow-sm cursor-pointer"
                onClick={() => {
                  localStorage.removeItem('token');
                  sessionStorage.removeItem('token');
                  navigate('/login');
                }}
              >
                <FaLock className="text-[#34d399]" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Pill Bar */}
          <div className="flex space-x-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-[#ff8f6b] text-white shadow-lg shadow-[#ff8f6b]/30 ring-1 ring-[#ff7a52]'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar />
              <span>Overview</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative ${
                activeTab === 'ai-pipeline'
                  ? 'bg-[#ff8f6b] text-white shadow-lg shadow-[#ff8f6b]/30 ring-1 ring-[#ff7a52]'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('ai-pipeline')}
            >
              <FaRobot className={activeTab === 'ai-pipeline' ? 'text-white' : 'text-[#34d399]'} />
              <span>AI Fund Allocation Pipeline</span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#34d399]/20 text-[#34d399] rounded-full border border-[#34d399]/40">
                Auto-Audit
              </span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'loans'
                  ? 'bg-[#ff8f6b] text-white shadow-lg shadow-[#ff8f6b]/30 ring-1 ring-[#ff7a52]'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('loans')}
            >
              <FaCoins />
              <span>Loan Applications</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-[#ff8f6b] text-white shadow-lg shadow-[#ff8f6b]/30 ring-1 ring-[#ff7a52]'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <FaGraduationCap />
              <span>Registered Students ({users.length})</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'donations'
                  ? 'bg-[#ff8f6b] text-white shadow-lg shadow-[#ff8f6b]/30 ring-1 ring-[#ff7a52]'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('donations')}
            >
              <FaUniversity />
              <span>Donations & Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Banner Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#072a1e] via-[#0b3324] to-[#041a12] p-6 md:p-8 text-white shadow-2xl border border-[#279267]/40">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30">
                    <FaBolt className="text-[#ff8f6b]" />
                    Autonomous Multi-Agent Need Auditor
                  </div>
                  <h2 className="font-serif-editorial text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Smart Filtering & Priority Disbursal Engine
                  </h2>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                    Audits every applicant against strict financial need benchmarks (household per-capita income ≤ 15,000 PKR, CGPA ≥ 2.00, emergency tuition dues). Transparently ranks students who need funds the most and flags ineligibility without bias.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('ai-pipeline')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-sm shadow-xl shadow-[#ff8f6b]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <FaRobot className="text-lg" />
                    <span>Run AI Allocation Pipeline →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-[#d8ede1] shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#c1e8d5] text-[#072a1e] flex items-center justify-center text-xl font-bold">
                  <FaGraduationCap />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5f8574] uppercase tracking-wider">Registered Students</p>
                  <p className="font-serif-editorial text-3xl font-black text-[#072a1e] mt-0.5">{users.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#d8ede1] shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5f8574] uppercase tracking-wider">Approved Loans</p>
                  <p className="font-serif-editorial text-3xl font-black text-[#15803d] mt-0.5">{status.approved || 0}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#d8ede1] shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center text-xl font-bold">
                  ⏳
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5f8574] uppercase tracking-wider">Pending Review</p>
                  <p className="font-serif-editorial text-3xl font-black text-[#b45309] mt-0.5">{status.pending || 0}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#d8ede1] shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center text-xl font-bold">
                  ✗
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5f8574] uppercase tracking-wider">Declined</p>
                  <p className="font-serif-editorial text-3xl font-black text-[#b91c1c] mt-0.5">{status.rejected || 0}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6">
                <h2 className="font-serif-editorial text-xl font-bold text-[#072a1e] mb-4 flex items-center gap-2">
                  <span>Application Status Breakdown</span>
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#e6f4ea] border border-[#c1e8d5] p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-[#15803d] uppercase tracking-wider">Approved</p>
                    <p className="font-serif-editorial text-3xl font-black text-[#15803d] mt-1">{status.approved || 0}</p>
                    <span className="text-[11px] text-[#166534] mt-1 font-semibold">Funds Disbursed</span>
                  </div>
                  <div className="bg-[#fef9c3] border border-[#fde047]/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-[#b45309] uppercase tracking-wider">Pending</p>
                    <p className="font-serif-editorial text-3xl font-black text-[#b45309] mt-1">{status.pending || 0}</p>
                    <span className="text-[11px] text-[#854d0e] mt-1 font-semibold">Under Review</span>
                  </div>
                  <div className="bg-[#fee2e2] border border-[#fca5a5]/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-[#b91c1c] uppercase tracking-wider">Rejected</p>
                    <p className="font-serif-editorial text-3xl font-black text-[#b91c1c] mt-1">{status.rejected || 0}</p>
                    <span className="text-[11px] text-[#991b1b] mt-1 font-semibold">Ineligible</span>
                  </div>
                </div>
              </div>

              {/* Donation Status Card */}
              <DonationStatusCard/>

      {/* User Statistics Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6 lg:col-span-2">
            <h2 className="font-serif-editorial text-xl font-bold text-[#072a1e] mb-4">Student Demographic Distribution</h2>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#34d399]"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-rose-600">
                Error loading user statistics: {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-64">
                  <Pie
                    data={userChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const percentage = Math.round((value / userData.total) * 100);
                              return `${label}: ${value} students (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <div className="mb-6 p-5 bg-[#e6f4ea] rounded-2xl text-[#072a1e] border border-[#c1e8d5]">
                    <p className="text-xs font-bold text-[#5f8574] uppercase tracking-wider">Total Enrolled Students</p>
                    <p className="font-serif-editorial text-4xl font-black mt-1 text-[#072a1e]">{userData.total}</p>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(userData.departments).map(([dept, count]) => {
                      const percentage = Math.round((count / userData.total) * 100);
                      return (
                        <div key={dept} className="mb-4">
                          <div className="flex justify-between mb-1.5 text-xs font-bold text-[#072a1e]">
                            <span>{dept}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#e2f3e9] rounded-full h-2.5">
                            <div 
                              className="bg-[#ff8f6b] h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Donations Tab Content */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          {/* Donation Analytics Chart */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Donation Analytics</h2>
            <div className="h-96">
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: {
                          size: 14
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `PKR ${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'PKR ' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div> */}

        <PayerDetailsTable/>
        </div>
      )}

       {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Statistics Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Distribution by Department</h2>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-600">
                Error loading user statistics: {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-96">
                  <Pie
                    data={userChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const percentage = Math.round((value / userData.total) * 100);
                              return `${label}: ${value} users (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-800 border border-blue-200">
                    <p className="text-sm font-medium">Total Registered Users</p>
                    <p className="text-4xl font-bold mt-2">{userData.total}</p>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(userData.departments).map(([dept, count]) => {
                      const percentage = Math.round((count / userData.total) * 100);
                      return (
                        <div key={dept} className="mb-4">
                          <div className="flex justify-between mb-1 text-gray-700">
                            <span className="font-medium">{dept}</span>
                            <span className="font-medium">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-700 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Details Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">Registered Student Registry</h2>
                <p className="text-xs text-[#5f8574] mt-0.5">Verified university candidates eligible for automated micro-relief</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={fetchUsers}
                  className="bg-[#e2f3e9] text-[#072a1e] font-bold px-4 py-2 rounded-xl hover:bg-[#c1e8d5] transition duration-200 flex items-center text-xs"
                >
                  Refresh Data
                </button>
                <button 
                  onClick={generateAllUsersExcel}
                  className="bg-[#072a1e] hover:bg-[#0b3324] text-white font-bold px-4 py-2 rounded-xl transition duration-200 flex items-center text-xs shadow-sm"
                >
                  <FaFileExport className="mr-1.5" />
                  Excel Export
                </button>
                <button 
                  onClick={generateAllUsersPDF}
                  className="bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold px-4 py-2 rounded-xl transition duration-200 flex items-center text-xs shadow-sm"
                >
                  <FaFilePdf className="mr-1.5" />
                  PDF Export
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-600">
                Error loading users: {error}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                             <img 
                                className="h-10 w-10 rounded-full object-cover bg-[#e2f3e9]" 
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.StudentName || 'U')}&background=c1e8d5&color=072a1e&bold=true`}
                                alt={user.StudentName || 'User'}
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.StudentName || 'U')}&background=c1e8d5&color=072a1e&bold=true`; }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.StudentName}</div>
                              <div className="text-sm text-gray-500">
                                CNIC {user.cnic}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.Dept || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.isVerified === true || user.isVerified === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isVerified === true || user.isVerified === 'true' ? 'Verified' : 'Not Verified'}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewUser(user._id || user.id)}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150 ease-in-out"
                          >
                            View
                          </button>
                       
                          <button 
                            onClick={() => generateUserPDF(user)}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150 ease-in-out"
                          >
                            <FaFilePdf className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id || user.id)}
                            className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loans Tab Content */}
      {activeTab === 'loans' && (
       <Loan/>
      )}

      {/* AI Fund Allocation Pipeline Tab Content */}
      {activeTab === 'ai-pipeline' && (
        <AiPipelineView onApplicationUpdated={() => { fetchUsers(); }} />
      )}
      </main>

{showModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      {selectedUser ? (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Details</h3>
          <table className="min-w-full text-sm text-left mb-6">
            <tbody>
              <tr><td className="font-semibold pr-4 py-1">Name:</td><td>{selectedUser.StudentName || selectedUser.name || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Phone:</td><td>{selectedUser.phoneNo || selectedUser.phoneNumber || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Email:</td><td>{selectedUser.email || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Department:</td><td>{selectedUser.Dept || selectedUser.department || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Semester:</td><td>{selectedUser.semester || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">CNIC:</td><td>{selectedUser.cnic || 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Verified:</td><td>{selectedUser.isVerified === true || selectedUser.isVerified === 'true' ? '✓ Verified' : 'Not Verified'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Registration Date:</td><td>{selectedUser.registrationDate ? new Date(selectedUser.registrationDate).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><td className="font-semibold pr-4 py-1">Profile Image:</td>
                <td className="py-1">
                  <img 
                    src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.StudentName || selectedUser.name || 'User')}&background=072a1e&color=fff`} 
                    alt="Profile" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.StudentName || selectedUser.name || 'User')}&background=072a1e&color=fff`;
                    }}
                    className="h-16 w-16 rounded-full object-cover border border-gray-200" 
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              onClick={() => { setShowModal(false); setSelectedUser(null); }}
              className="bg-[#072a1e] hover:bg-[#0c402e] text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification</h3>
          <p className="text-gray-700 mb-6">{modalMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default Dashboard;
