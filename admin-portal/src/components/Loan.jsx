import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaCheck, FaTimes, FaEye, FaTrash, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';

function Loan() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [applicationsResponse, usersResponse] = await Promise.all([
        axios.get(ADMIN_API_ENDPOINTS.fetchApplications),
        axios.get(ADMIN_API_ENDPOINTS.fetchUsers)
      ]);
      console.log('Applications Response:', applicationsResponse.data.applications);
      console.log('Users Response:', usersResponse.data.user);

      if (applicationsResponse.status === 200 && usersResponse.status === 200) {
        setLoanApplications(applicationsResponse.data.applications || []);
        setUsers(usersResponse.data.users || []);
      } else {
        setLoanApplications([]);
        setUsers([]);
      }
      console.log('Loan Applications:',loanApplications );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  // const getApplicationWithUser = (application) => {
  //   const user = users.find(u => u._id === application.user);
  //   return {
  //     ...application,
  //     user: user || null
  //   };
  // };
  // console.log('Loan Applications with User:', getApplicationWithUser(loanApplications));

  const updateApplicationStatus = async (applicationId,userID,loanAmount,loanPurpose, newStatus ) => {
    console.log('Updating Application ID:', applicationId, 'to Status:', newStatus, 'for User ID:', userID);
    try {
      const response = await axios.patch(
        `${ADMIN_API_ENDPOINTS.updateloan}/${applicationId}`,
        { status: newStatus , userID: userID , loanAmount: loanAmount, loanPurpose: loanPurpose }
      );
      
      if (response.status === 200) {
        setLoanApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const response = await axios.delete(
          `${ADMIN_API_ENDPOINTS.DeleteLoanApplication}/${applicationId}`
        );
        
        if (response.status === 200) {
          setLoanApplications(prev => prev.filter(app => app._id !== applicationId));
        }
      } catch (err) {
        console.error('Error deleting application:', err);
      }
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApp(application);
    setShowModal(true);
  };

  const generateLoanPDF = (application) => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: `Loan Application - ${application.studentName}`,
        subject: 'Loan Application Details',
        author: "PennyRelief",
        creator: "PennyRelief Student Relief Admin Portal"
    });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(17, 64, 140); // PennyRelief brand color
    doc.setFont('helvetica', 'bold');
    doc.text("PennyRelief • Student Aid", 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Loan Application Details', 105, 30, { align: 'center' });

    // Horizontal line
    doc.setDrawColor(17, 64, 140);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Application ID
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Application ID: ${application._id}`, 105, 42, { align: 'center' });

    // Student Information Section
    doc.setFontSize(12);
    doc.setTextColor(17, 64, 140);
    doc.setFont('helvetica', 'bold');
    doc.text("Student Information", 20, 55);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 57, 60, 57);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    // Left column
    doc.text(`Name: ${application.studentName}`, 20, 65);
    doc.text(`Registration No: ${application.regNo}`, 20, 75);
    doc.text(`Email: ${application.email}`, 20, 85);
    doc.text(`Phone: ${application.phoneNo}`, 20, 95);
    
    // Right column
    doc.text(`Department: ${application.dept}`, 110, 65);
    doc.text(`Semester: ${application.semester}`, 110, 75);
    doc.text(`CGPA: ${application.cgpa}`, 110, 85);

    // Family Information Section
    doc.setFontSize(12);
    doc.setTextColor(17, 64, 140);
    doc.setFont('helvetica', 'bold');
    doc.text("Family Information", 20, 115);
    doc.line(20, 117, 60, 117);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Father's Name: ${application.fatherName}`, 20, 125);
    doc.text(`Occupation: ${application.fatherOccupation}`, 20, 135);
    doc.text(`Salary: PKR ${application.fatherSalary}`, 20, 145);
    doc.text(`Siblings: ${application.siblings}`, 20, 155);

    // Loan Details Section
    doc.setFontSize(12);
    doc.setTextColor(17, 64, 140);
    doc.setFont('helvetica', 'bold');
    doc.text("Loan Details", 110, 115);
    doc.line(110, 117, 140, 117);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Amount: PKR ${application.loanAmount}`, 110, 125);
    doc.text(`Status: ${application.status}`, 110, 135);
    doc.text(`Applied On: ${new Date(application.submittedAt).toLocaleDateString()}`, 110, 145);
    
    // Additional Notes (multi-line support)
    const splitNotes = doc.splitTextToSize(`Additional Notes: ${application.additionalNotes}`, 80);
    doc.text(splitNotes, 110, 155);

    // Document Images Section
    doc.setFontSize(12);
    doc.setTextColor(17, 64, 140);
    doc.setFont('helvetica', 'bold');
    doc.text("Submitted Documents", 20, 175);
    doc.line(20, 177, 60, 177);

    // Calculate positions for images
    const startY = 185;
    const imgWidth = 40;
    const imgHeight = 30;
    const spacing = 10;

    // CNIC Front Image
    if (application.cnicFrontImage) {
        doc.text("CNIC Front:", 20, startY);
        doc.addImage(application.cnicFrontImage, 'JPEG', 20, startY + 5, imgWidth, imgHeight);
    }

    // CNIC Back Image
    if (application.cnicBackImage) {
        doc.text("CNIC Back:", 70, startY);
        doc.addImage(application.cnicBackImage, 'JPEG', 70, startY + 5, imgWidth, imgHeight);
    }

    // Utility Bills (second row)
    if (application.electricityBillImage) {
        doc.text("Electricity Bill:", 20, startY + imgHeight + 15);
        doc.addImage(application.electricityBillImage, 'JPEG', 20, startY + imgHeight + 20, imgWidth, imgHeight);
    }

    if (application.gasBillImage) {
        doc.text("Gas Bill:", 70, startY + imgHeight + 15);
        doc.addImage(application.gasBillImage, 'JPEG', 70, startY + imgHeight + 20, imgWidth, imgHeight);
    }

    if (application.waterBillImage) {
        doc.text("Water Bill:", 120, startY + imgHeight + 15);
        doc.addImage(application.waterBillImage, 'JPEG', 120, startY + imgHeight + 20, imgWidth, imgHeight);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 280);
    
    doc.setFontSize(8);
    doc.setTextColor(17, 64, 140);
    doc.text("100's Rupee Bank - Confidential", 105, 290, { align: 'center' });

    // Page border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 280);

    // Save the PDF
    doc.save(`100sRupeeBank_LoanApplication_${application.regNo}_${application.studentName.replace(/\s+/g, '_')}.pdf`);
  };

  const generateAllLoansPDF = () => {
    try {
      // Initialize jsPDF instance
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: "All Loan Applications Report",
        subject: 'Loan Applications Summary',
        author: "PennyRelief",
        creator: "PennyRelief Student Relief Admin Portal"
      });

      // Add header
      doc.setFontSize(20);
      doc.setTextColor(17, 64, 140); // PennyRelief brand color
      doc.setFont('helvetica', 'bold');
      doc.text("PennyRelief • Student Aid", 105, 15, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('All Loan Applications Report', 105, 25, { align: 'center' });

      // Prepare data for the table
      const headers = [
        ['App ID', 'Student', 'Reg No', 'Amount', 'Status', 'Applied On', 'Department']
      ];
      
      const data = loanApplications.map(loan => [
        loan._id.substring(0, 8) + '...', // Shorten ID for display
        loan.studentName || 'N/A',
        loan.regNo || 'N/A',
        `PKR ${loan.loanAmount || '0'}`,
        loan.status || 'Pending',
        new Date(loan.submittedAt).toLocaleDateString(),
        loan.dept || 'N/A'
      ]);

      // Generate the table using autoTable
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 35,
        styles: {
          cellPadding: 5,
          fontSize: 8,
          valign: 'middle',
          textColor: [60, 60, 60]
        },
        columnStyles: {
          0: { cellWidth: 20 }, // App ID
          1: { cellWidth: 30 }, // Student
          2: { cellWidth: 20 }, // Reg No
          3: { cellWidth: 20 }, // Amount
          4: { cellWidth: 20 }, // Status
          5: { cellWidth: 20 }, // Applied On
          6: { cellWidth: 30 }  // Department
        },
        headStyles: {
          fillColor: [17, 64, 140],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        didDrawPage: function (data) {
          // Add footer to each page
          doc.setFontSize(5);
          doc.setTextColor(150, 150, 150);
          doc.text(`Page ${data.pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });

      // Add summary statistics
      const totalLoans = loanApplications.length;
      const approvedLoans = loanApplications.filter(loan => loan.status === 'Approved').length;
      const pendingLoans = loanApplications.filter(loan => loan.status === 'Pending').length;
      const totalAmount = loanApplications.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);

      doc.setFontSize(10);
      doc.setTextColor(17, 64, 140);
      doc.text('Summary Statistics:', 14, doc.lastAutoTable.finalY + 10);
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Applications: ${totalLoans}`, 14, doc.lastAutoTable.finalY + 18);
      doc.text(`Approved: ${approvedLoans}`, 14, doc.lastAutoTable.finalY + 26);
      doc.text(`Pending: ${pendingLoans}`, 14, doc.lastAutoTable.finalY + 34);
      doc.text(`Total Amount Requested: PKR ${totalAmount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 42);

      // Add footer
      const date = new Date().toLocaleString();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${date}`, 14, doc.internal.pageSize.height - 20);
      doc.text("PennyRelief - Confidential Audit Record", 105, doc.internal.pageSize.height - 10, { align: 'center' });

      // Save the PDF
      doc.save(`PennyRelief_LoanApplications_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating loan applications PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Error loading loan applications: {error}
        <button 
          onClick={fetchData}
          className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#d8ede1] p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">Student Relief Applications</h2>
          <p className="text-xs text-[#5f8574] mt-0.5">Audited micro-loan requests under active review</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData}
            className="bg-[#e2f3e9] text-[#072a1e] font-bold px-4 py-2 rounded-xl hover:bg-[#c1e8d5] transition duration-200 flex items-center text-xs"
          >
            <FaSync className="mr-1.5" />
            Refresh
          </button>
          <button 
            onClick={generateAllLoansPDF}
            className="bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold px-4 py-2 rounded-xl transition duration-200 flex items-center text-xs shadow-sm"
          >
            <FaFilePdf className="mr-1.5" />
            Export All in PDF
          </button>
        </div>
      </div>
      
      {loanApplications.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No loan applications found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#d8ede1]">
          <table className="min-w-full divide-y divide-[#d8ede1]">
            <thead className="bg-[#eef7f2] text-[#072a1e]">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Registration No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Loan Amount
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
              {loanApplications.map(application => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                    <div className="text-sm text-gray-500">{application.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.regNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.dept}</div>
                    <div className="text-sm text-gray-500">Semester: {application.semester}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      PKR {Number(application.loanAmount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const st = (application.status || 'pending').toLowerCase();
                      if (st === 'approved') {
                        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">✓ Approved</span>;
                      }
                      if (st === 'rejected') {
                        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300">✗ Rejected</span>;
                      }
                      return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">⏳ Pending Review</span>;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => viewApplicationDetails(application)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(application._id, application.user?._id || application.user, application.loanAmount, application.loanPurpose, 'Approved')}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 transition"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(application._id, application.user?._id || application.user, application.loanAmount, application.loanPurpose, 'Rejected')}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                    <button 
                      onClick={() => generateLoanPDF(application)}
                      className="text-purple-600 hover:text-purple-800 mr-3 transition duration-150 ease-in-out"
                      title="Download PDF"
                    >
                      <FaFilePdf />
                    </button>
                    <button 
                      onClick={() => handleDeleteApplication(application._id)}
                      className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">
                  Loan Application Details
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-blue-700">Student Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedApp.studentName}</p>
                    <p><span className="font-medium">Registration No:</span> {selectedApp.regNo}</p>
                    <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedApp.phoneNo}</p>
                    <p><span className="font-medium">Department:</span> {selectedApp.dept}</p>
                    <p><span className="font-medium">Semester:</span> {selectedApp.semester}</p>
                    <p><span className="font-medium">CGPA:</span> {selectedApp.cgpa}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-3 text-blue-700">Family Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Father's Name:</span> {selectedApp.fatherName}</p>
                    <p><span className="font-medium">Occupation:</span> {selectedApp.fatherOccupation}</p>
                    <p><span className="font-medium">Salary:</span> PKR {selectedApp.fatherSalary}</p>
                    <p><span className="font-medium">Siblings:</span> {selectedApp.siblings}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-3 text-blue-700">Loan Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Amount:</span> PKR {selectedApp.loanAmount}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full 
                        ${selectedApp.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          selectedApp.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedApp.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Applied On:</span> {new Date(selectedApp.applicationDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Additional Notes:</span> {selectedApp.additionalNotes}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-3 text-blue-700">Submitted Documents</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">CNIC Front:</p>
                      <a 
                        href={selectedApp.cnicFrontImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">CNIC Back:</p>
                      <a 
                        href={selectedApp.cnicBackImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">Electricity Bill:</p>
                      <a 
                        href={selectedApp.electricityBillImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">Gas Bill:</p>
                      <a 
                        href={selectedApp.gasBillImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">Water Bill:</p>
                      <a 
                        href={selectedApp.waterBillImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => generateLoanPDF(selectedApp)}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center"
                >
                  <FaFilePdf className="mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loan;





