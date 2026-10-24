import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaCheck, FaTimes, FaEye, FaTrash, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';
import { generateExecutiveReliefPDF, generateIndividualVoucherPDF, SAMPLE_RELIEF_DATA } from '../utils/pdfGenerator';

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
      if (applicationsResponse.status === 200 && usersResponse.status === 200) {
        setLoanApplications(applicationsResponse.data.applications || []);
        setUsers(usersResponse.data.users || []);
      } else {
        setLoanApplications([]);
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateApplicationStatus = async (applicationId, userID, loanAmount, loanPurpose, newStatus) => {
    try {
      const response = await axios.patch(
        `${ADMIN_API_ENDPOINTS.updateloan}/${applicationId}`,
        { status: newStatus, userID: userID, loanAmount: loanAmount, loanPurpose: loanPurpose }
      );
      
      if (response.status === 200) {
        setLoanApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (err) {
      alert(`Failed to update application status: ${err?.response?.data?.message || err.message}`);
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

  const generateLoanPDF = async (application) => {
    try {
      await generateIndividualVoucherPDF(application);
    } catch (err) {
      console.error('Error generating voucher PDF:', err);
    }
  };

  const generateAllLoansPDF = async () => {
    try {
      await generateExecutiveReliefPDF(loanApplications);
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
        <div className="text-center py-12 px-6 rounded-2xl bg-[#f8fcf9] border border-dashed border-[#c1e8d5]">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#c1e8d5]/40 flex items-center justify-center text-[#072a1e] mb-3">
            <FaFilePdf className="text-xl text-[#ff8f6b]" />
          </div>
          <h3 className="font-serif-editorial text-lg font-bold text-[#072a1e]">No Live Applications in Database</h3>
          <p className="text-xs text-[#5f8574] max-w-md mx-auto mt-1 mb-5">
            You can load realistic audited student relief records to test the table and preview the executive PDF ledger and individual voucher formats.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <button
              onClick={() => setLoanApplications(SAMPLE_RELIEF_DATA)}
              className="bg-[#072a1e] hover:bg-[#0c402e] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Load 10 Sample Audited Applications</span>
            </button>
            <button
              onClick={() => generateExecutiveReliefPDF(null)}
              className="bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FaFilePdf />
              <span>Download Executive Audit PDF</span>
            </button>
          </div>
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





