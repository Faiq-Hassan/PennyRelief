import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_ENDPOINTS } from '../../constants/ProjectApi';
import { 
  FaBrain, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaBolt, 
  FaSync, 
  FaGraduationCap, 
  FaUsers, 
  FaMoneyBillWave,
  FaArrowRight
} from 'react-icons/fa';

export default function AiPipelineView({ onApplicationUpdated }) {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterTier, setFilterTier] = useState('ALL');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ADMIN_API_ENDPOINTS.fetchAiPipeline);
      if (res.data?.success) {
        setPipelineData(res.data);
      }
    } catch (err) {
      console.error('Failed to load AI pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleBatchApprove = async () => {
    try {
      setActionLoading(true);
      const res = await axios.post(ADMIN_API_ENDPOINTS.batchApproveAi, { targetTier: 'Tier-1' });
      if (res.data?.success) {
        setSuccessMessage(res.data.message || 'Deserving students batch-approved!');
        await fetchPipeline();
        if (onApplicationUpdated) onApplicationUpdated();
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      alert('Batch approval failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !pipelineData) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-gray-600 font-medium animate-pulse">Running Gemma 4 Multi-Agent Intelligence Screening...</p>
      </div>
    );
  }

  const summary = pipelineData?.pipelineSummary || {};
  const benchmarks = pipelineData?.benchmarks || {};
  const ranked = pipelineData?.rankedStudents || [];

  const filteredStudents = ranked.filter(s => {
    if (filterTier === 'ALL') return true;
    if (filterTier === 'TIER_1') return s.metrics.priorityTier.includes('Tier-1');
    if (filterTier === 'TIER_2') return s.metrics.priorityTier.includes('Tier-2');
    if (filterTier === 'INELIGIBLE') return s.metrics.priorityTier.includes('Ineligible');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <FaBrain className="animate-pulse text-indigo-400" />
              Automated Micro-Finance Intelligence Pipeline
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              AI Student Need Prioritization & Fund Allocation
            </h2>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
              Autonomous multi-agent screening audits each applicant's household per-capita income, academic GPA standing, and dependency burden to ensure 100's Rupee micro-donations reach genuinely deserving students.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchPipeline}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur text-sm font-semibold border border-white/10"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Re-evaluate
            </button>
            <button
              onClick={handleBatchApprove}
              disabled={actionLoading || summary.criticalNeedCount === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition text-white font-bold text-sm shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              <FaBolt />
              {actionLoading ? 'Processing...' : 'Batch-Approve Critical Need'}
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in shadow-sm">
          <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Benchmark Rules Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Need Threshold</div>
            <div className="text-lg font-bold text-gray-900">≤ 15,000 PKR / person</div>
            <div className="text-xs text-gray-500 mt-0.5">Household salary divided by family members</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <FaGraduationCap className="text-xl" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic Benchmark</div>
            <div className="text-lg font-bold text-gray-900">≥ 2.00 CGPA</div>
            <div className="text-xs text-gray-500 mt-0.5">Tier-A bonus for students with CGPA ≥ 3.50</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <FaUsers className="text-xl" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Micro-Fund Cap</div>
            <div className="text-lg font-bold text-gray-900">Up to 60,000 PKR</div>
            <div className="text-xs text-gray-500 mt-0.5">Subsidized via 100's Rupee micro-donations</div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Tier 1: Critical Need</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Immediate</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600">{summary.criticalNeedCount}</div>
          <p className="mt-1 text-xs text-gray-500">Passed all poverty & academic tests</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Tier 2: High Need</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Priority</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-600">{summary.highNeedCount}</div>
          <p className="mt-1 text-xs text-gray-500">Meets baseline criteria</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Total Funds Requested</span>
            <span className="text-xs text-gray-400">{summary.totalApplicants} applicants</span>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-gray-900">
            PKR {Number(summary.totalFundsRequested || 0).toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-gray-500">Aggregate application volume</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Recommended Allocation</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">AI Allocated</span>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-indigo-600">
            PKR {Number(summary.recommendedAllocation || 0).toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-gray-500">Optimized against fund reserves</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: `All Applicants (${ranked.length})` },
            { id: 'TIER_1', label: `Critical Priority (${summary.criticalNeedCount})` },
            { id: 'TIER_2', label: `High Need (${summary.highNeedCount})` },
            { id: 'INELIGIBLE', label: `Ineligible (${summary.ineligibleCount})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterTier(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterTier === t.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500">Ranked by AI Need Index</span>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student, idx) => {
          const isCritical = student.metrics.priorityTier.includes('Tier-1');
          const isEligible = student.metrics.benchmarkPassed;

          return (
            <div
              key={student.id || idx}
              className={`p-6 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md ${
                isCritical 
                  ? 'border-emerald-200/80 shadow-sm' 
                  : !isEligible 
                  ? 'border-red-200/80 bg-red-50/20' 
                  : 'border-gray-200/80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    isCritical 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : !isEligible 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-gray-900">{student.studentName}</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {student.regNo}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700">
                        {student.dept} &bull; Sem {student.semester}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Father: <span className="font-medium text-gray-700">{student.fatherOccupation}</span> &bull; 
                      Monthly Income: <span className="font-medium text-gray-700">PKR {student.fatherSalary?.toLocaleString()}</span> &bull; 
                      Family Members: <span className="font-medium text-gray-700">{student.familySize}</span>
                    </p>
                  </div>
                </div>

                {/* Right Badges & Score */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Per Capita */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Per-Capita Income</div>
                    <div className={`text-sm font-bold ${student.metrics.incomePassed ? 'text-emerald-600' : 'text-red-600'}`}>
                      PKR {student.perCapitaIncome?.toLocaleString()} / mo
                    </div>
                  </div>

                  {/* CGPA */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Academic Standing</div>
                    <div className={`text-sm font-bold ${student.cgpa >= 3.0 ? 'text-indigo-600' : student.cgpa >= 2.0 ? 'text-gray-700' : 'text-red-600'}`}>
                      CGPA {Number(student.cgpa).toFixed(2)}
                    </div>
                  </div>

                  {/* Need Score Meter */}
                  <div className="min-w-[140px] text-right">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Need Index</span>
                      <span className={isCritical ? 'text-emerald-600 font-bold' : 'text-gray-800'}>
                        {student.metrics.needScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          student.metrics.needScore >= 80 
                            ? 'bg-emerald-500' 
                            : student.metrics.needScore >= 60 
                            ? 'bg-amber-500' 
                            : 'bg-red-400'
                        }`}
                        style={{ width: `${student.metrics.needScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Priority Tier Badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isCritical
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : !isEligible
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    }`}>
                      {isCritical ? <FaCheckCircle /> : !isEligible ? <FaTimesCircle /> : <FaExclamationTriangle />}
                      {student.metrics.priorityTier.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Justification Box */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="text-gray-600 flex items-center gap-2">
                  <FaBrain className="text-indigo-500 flex-shrink-0" />
                  <span><strong>AI Decision Rationale:</strong> {student.metrics.aiRationale}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700">
                    Allocated: <span className="text-indigo-600">PKR {Number(student.metrics.recommendedAmount).toLocaleString()}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    student.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    student.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
