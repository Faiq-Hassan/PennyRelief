import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheck,
  FaRobot,
  FaGraduationCap,
  FaCoins,
  FaHeart,
  FaShieldAlt,
  FaUniversity,
  FaBolt,
  FaLock,
  FaTimes,
  FaStar,
  FaCalculator,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { FiDollarSign, FiActivity, FiUsers, FiAward } from 'react-icons/fi';

export default function LandingPage() {
  const navigate = useNavigate();

  // Interactive Need Calculator state
  const [calcIncome, setCalcIncome] = useState(45000);
  const [calcMembers, setCalcMembers] = useState(6);
  const [calcCgpa, setCalcCgpa] = useState(3.4);
  const [calcAmount, setCalcAmount] = useState(25000);

  // Modals state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState(100);
  const [donateSuccess, setDonateSuccess] = useState(false);

  // Calculator computations
  const perCapita = Math.round(calcIncome / Math.max(1, calcMembers));
  const isIncomeEligible = perCapita <= 15000;
  const isCgpaEligible = calcCgpa >= 2.0;
  const isEligible = isIncomeEligible && isCgpaEligible;
  const calculatedScore = Math.min(
    99,
    Math.max(
      15,
      Math.round((1 - perCapita / 25000) * 50 + (calcCgpa / 4.0) * 35 + (calcMembers >= 5 ? 15 : 8))
    )
  );

  return (
    <div className="min-h-screen bg-[#f3fbf6] text-[#0d3829] font-sans selection:bg-[#ff8f6b] selection:text-white overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR
      ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#f3fbf6]/90 border-b border-[#d8ede1] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.jpg"
              alt="PennyRelief Logo"
              className="h-11 w-11 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border border-[#34d399]/40"
            />
            <div>
              <span className="font-serif-editorial font-bold text-2xl tracking-tight text-[#072a1e]">
                penny relief
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#c1e8d5] text-[#072a1e]">
                Micro-Donation Bank
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#194f3b]">
            <a href="#how-it-works" className="hover:text-[#072a1e] transition-colors">
              How It Works
            </a>
            <a href="#ai-pipeline" className="hover:text-[#072a1e] transition-colors flex items-center gap-1.5">
              <span>AI Need Pipeline</span>
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
            </a>
            <a href="#calculator" className="hover:text-[#072a1e] transition-colors">
              Need Calculator
            </a>
            <a href="#testimonials" className="hover:text-[#072a1e] transition-colors">
              Student Stories
            </a>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-[#072a1e]/20 text-[#072a1e] hover:bg-[#072a1e] hover:text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <FaLock className="text-xs text-[#072a1e] group-hover:text-white" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full bg-[#ff8f6b] hover:bg-[#ff7a52] text-white shadow-lg shadow-[#ff8f6b]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Apply for Relief</span>
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────
          2. HERO SECTION (Editorial Serif + Mascot + Pill Track)
      ────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background ambient gradient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#c8edd8]/60 via-[#ffded4]/40 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Top Pill Announcement */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#d2ebd9] shadow-sm text-xs font-semibold text-[#0d3829] mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#ff8f6b] animate-pulse" />
            <span>Autonomous Gemini 2.5 Multi-Agent Need Auditor</span>
            <span className="text-[#34d399] font-mono font-bold">100% Fair</span>
          </motion.div>

          {/* Expressive Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#072a1e] leading-[1.08] max-w-4xl mx-auto"
          >
            Never let financial need halt{' '}
            <span className="italic font-serif font-light text-[#ff7a52]">an education</span> again.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-[#235843] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Pakistan’s first zero-bureaucracy university micro-relief fund. Powered by PKR 100 community
            micro-donations and evaluated in seconds by autonomous AI agents to protect students from dropping out.
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-4 rounded-full bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-base shadow-xl shadow-[#ff8f6b]/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <span>Apply for Emergency Relief</span>
              <FaArrowRight />
            </button>
            <button
              onClick={() => setShowDonateModal(true)}
              className="px-7 py-4 rounded-full bg-white hover:bg-[#eaf6ee] text-[#072a1e] font-bold text-base border border-[#c1e8d5] shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <FaHeart className="text-[#ff8f6b]" />
              <span>Donate PKR 100</span>
            </button>
          </motion.div>

          {/* Curved Dotted Connecting Line with Pill Tracker (matching reference) */}
          <div className="relative mt-16 max-w-3xl mx-auto h-24">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 20 80 C 150 10, 250 90, 400 50 C 550 10, 650 90, 780 40"
                stroke="#a6d8bc"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Floating Traveling Capsule Badge */}
            <motion.div
              animate={{
                x: [-120, 120, -120],
                y: [0, -12, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-[#cbe8d7] flex items-center gap-2 text-xs font-bold text-[#072a1e]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff8f6b]" />
              <span>Instant Relief: PKR 25,000 Disbursed</span>
              <span className="text-emerald-600 font-mono">0% APR</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. DARK FOREST GREEN APP SHOWCASE (Phone Mockup + Icon Cloud)
      ────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#051c14] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-t-[48px] shadow-2xl">
        {/* Subtle mesh glow inside dark container */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#13593e]/40 via-[#ff8f6b]/15 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#34d399] mb-3">
            CAMPUS MICRO-ENDOWMENT NETWORK
          </p>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Stop student debt distress <span className="italic font-serif font-light text-[#ff8f6b]">before</span> it starts.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Direct institutional micro-endowments disbursed straight into student digital wallets within minutes of automated AI validation.
          </p>

          {/* Phone Display with Surrounding Icon Grid */}
          <div className="relative mt-16 flex items-center justify-center">

            {/* Central Realistic iPhone Mockup */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-[320px] sm:w-[350px] rounded-[48px] bg-slate-900 p-3.5 shadow-2xl shadow-emerald-950/80 ring-1 ring-white/20 border-4 border-slate-800"
            >
              {/* iPhone Glass Screen */}
              <div className="w-full rounded-[40px] bg-gradient-to-b from-[#082b1d] via-[#041910] to-[#020e09] p-5 text-left border border-white/10 overflow-hidden">
                {/* Dynamic Island / Speaker */}
                <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono mb-4 px-1">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-black rounded-full mx-auto" />
                  <span>5G 100%</span>
                </div>

                {/* Student Balance Card */}
                <div className="bg-gradient-to-tr from-[#0e4d35] to-[#17724f] p-4 rounded-3xl border border-[#279267]/40 shadow-inner mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                    PennyRelief Student Wallet
                  </span>
                  <p className="text-2xl font-black text-white mt-1">PKR 35,000</p>
                  <div className="flex items-center justify-between mt-3 text-[11px]">
                    <span className="text-emerald-100 font-medium">Hamza Tariq (CS)</span>
                    <span className="bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      ✓ Active Relief
                    </span>
                  </div>
                </div>

                {/* Live Notification Pills inside Mobile Screen */}
                <div className="space-y-2.5">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Semester Tuition Cleared</p>
                      <p className="text-[10px] text-slate-300">PKR 25,000 disbursed directly</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                      <FaRobot />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">AI Need Audit Verified</p>
                      <p className="text-[10px] text-slate-300">Per-capita PKR 7,500 • Score 98%</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#ff8f6b]/20 text-[#ff8f6b] flex items-center justify-center font-bold text-sm">
                      0%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Zero Interest Micro-Plan</p>
                      <p className="text-[10px] text-slate-300">Pay forward PKR 500 when employed</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar Pill */}
                <div className="mt-5 text-center">
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-2.5 rounded-2xl bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Request Emergency Aid
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Trust Ticker Badges */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              PennyRelief Verified
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              4 Autonomous AI Agents
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff8f6b]" />
              PKR 0 Paperwork Fees
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              100% Transparent Ledger
            </span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. HOW IT WORKS (Timeline with 3 Distinct Steps)
      ────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#194f3b] bg-[#c1e8d5] px-3 py-1 rounded-full">
            DIGNIFIED ARCHITECTURE
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#072a1e] mt-4 leading-tight">
            How the student relief journey flows.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            No endless queues, no humiliating interviews. 100% digital, audited with computational fairness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-7 border border-[#d2ebd9] shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ffefe8] text-[#ff7a52] flex items-center justify-center font-serif-editorial text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#072a1e] mb-2">
                1-Minute Submission
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Student fills registration number, CNIC, household monthly income, family dependents, and fee voucher.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FaCheck className="text-emerald-500" />
              <span>Zero physical paperwork</span>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-gradient-to-b from-white to-[#f0faf3] rounded-3xl p-7 border-2 border-[#34d399]/40 shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#34d399] text-[#072a1e] px-2 py-0.5 rounded-full">
              Gemini AI
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c1e8d5] text-[#072a1e] flex items-center justify-center font-serif-editorial text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#072a1e] mb-2">
                Multi-Agent AI Audit
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our autonomous agents verify per-capita household income (benchmark: $\le 15,000$ PKR), CGPA $\ge 2.00$, and urgent tuition deadlines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <FaRobot className="text-indigo-500" />
              <span>Priority Need Score (0-100%)</span>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-7 border border-[#d2ebd9] shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ffefe8] text-[#ff7a52] flex items-center justify-center font-serif-editorial text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#072a1e] mb-2">
                Instant Disbursal
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Funds are released directly to the university fee portal or student wallet with 0% interest and a voluntary pay-it-forward pledge.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FaCoins className="text-emerald-500" />
              <span>0% APR • Pay forward later</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. INTERACTIVE NEED CALCULATOR (Live Benchmark Simulator)
      ────────────────────────────────────────────────────────── */}
      <section id="calculator" className="py-20 bg-gradient-to-b from-[#eaf6ee] to-[#f3fbf6] border-y border-[#d2ebd9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#072a1e] bg-[#c1e8d5] px-3 py-1 rounded-full">
              TRANSPARENT BENCHMARKS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#072a1e] mt-3">
              Simulate your AI need score.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              See how our Gemini Multi-Agent engine calculates per-capita thresholds and prioritizes aid transparently.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#c1e8d5] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Family Income Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#072a1e] uppercase tracking-wider">
                    Total Family Monthly Income
                  </label>
                  <span className="text-base font-extrabold text-[#072a1e]">
                    PKR {calcIncome.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="5000"
                  value={calcIncome}
                  onChange={(e) => setCalcIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff8f6b]"
                />
                <span className="text-[11px] text-slate-400">Benchmark: Total household earnings</span>
              </div>

              {/* Family Members Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#072a1e] uppercase tracking-wider">
                    Family Dependents (Members)
                  </label>
                  <span className="text-base font-extrabold text-[#072a1e]">{calcMembers} Persons</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={calcMembers}
                  onChange={(e) => setCalcMembers(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff8f6b]"
                />
              </div>

              {/* CGPA Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#072a1e] uppercase tracking-wider">
                    Current CGPA
                  </label>
                  <span className="text-base font-extrabold text-[#072a1e]">{calcCgpa.toFixed(2)} / 4.00</span>
                </div>
                <input
                  type="range"
                  min="1.50"
                  max="4.00"
                  step="0.05"
                  value={calcCgpa}
                  onChange={(e) => setCalcCgpa(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff8f6b]"
                />
                <span className="text-[11px] text-slate-400">Min qualification: CGPA ≥ 2.00</span>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#072a1e] to-[#041a12] text-white p-7 rounded-3xl border border-[#1b5840] shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#34d399]">
                  AI AUDIT RESULT
                </span>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xs text-slate-300">Priority Need Score</span>
                  <span className="text-4xl font-serif-editorial font-black text-[#ff8f6b]">
                    {isEligible ? `${calculatedScore}%` : '0%'}
                  </span>
                </div>

                {/* Per capita calculation display */}
                <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Household Per-Capita:</span>
                    <span className="font-mono font-bold text-white">PKR {perCapita.toLocaleString()} / person</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hard Cap Threshold:</span>
                    <span className="font-mono text-emerald-400">≤ PKR 15,000 / person</span>
                  </div>
                </div>

                {/* Eligibility verdict */}
                <div className="mt-5">
                  {isEligible ? (
                    <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <FaCheck />
                      <span>Eligible for Instant Relief (High Need)</span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <FaTimes />
                      <span>
                        {!isIncomeEligible
                          ? 'Per-capita income exceeds PKR 15,000'
                          : 'CGPA must be 2.00 or higher'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowApplyModal(true)}
                className="mt-6 w-full py-3 rounded-2xl bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-xs shadow-lg transition-all"
              >
                Start Formal Verification →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. COMMUNITY TESTIMONIALS (Pastel Sticky Notes Wall)
      ────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-[#051c14] text-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#34d399] bg-[#113828] px-3 py-1 rounded-full border border-[#216148]">
              STUDENT & FACULTY IMPACT
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal mt-4 text-white">
              Over the moon <span className="italic font-serif font-light text-[#ff8f6b]">stories</span>.
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Real students who stayed enrolled because of PKR 100 micro-donations and fair AI allocation.
            </p>
          </div>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Note 1 - Pink Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              className="bg-[#fed7d7] text-[#742a2a] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "I was about to drop out in semester 6 after my father’s accident. The PennyRelief AI Auditor approved my
                PKR 30,000 tuition fee in under 5 minutes without asking for humiliating proof."
              </p>
              <div className="mt-6 pt-3 border-t border-[#feb2b2] flex items-center justify-between text-xs font-bold">
                <span>Hamza Tariq</span>
                <span className="bg-[#feb2b2] px-2 py-0.5 rounded-full">CS Dept • 7th Sem</span>
              </div>
            </motion.div>

            {/* Note 2 - Orange Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="bg-[#feebc8] text-[#7b341e] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "As an alumnus, giving PKR 100 each month felt too small before. Now, seeing the transparent AI
                disbursal ledger, I know every rupee saves an engineer's degree."
              </p>
              <div className="mt-6 pt-3 border-t border-[#fbd38d] flex items-center justify-between text-xs font-bold">
                <span>Engr. Bilal Ahmed</span>
                <span className="bg-[#fbd38d] px-2 py-0.5 rounded-full">Alumni Donor</span>
              </div>
            </motion.div>

            {/* Note 3 - Mint Sage Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: -2 }}
              className="bg-[#c6f6d5] text-[#22543d] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "Zero bureaucracy. No begging committee members or waiting 3 months. My CGPA is 3.8 and this fund
                treated my family's financial crisis with true dignity."
              </p>
              <div className="mt-6 pt-3 border-t border-[#9ae6b4] flex items-center justify-between text-xs font-bold">
                <span>Ayesha Siddiqua</span>
                <span className="bg-[#9ae6b4] px-2 py-0.5 rounded-full">EE Dept • 4th Sem</span>
              </div>
            </motion.div>

            {/* Note 4 - Lavender Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: 2 }}
              className="bg-[#e9d8fd] text-[#44337a] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "As departmental advisor, we used to spend weeks manually auditing paper forms. The Gemini
                pipeline has completely eradicated bias and delays."
              </p>
              <div className="mt-6 pt-3 border-t border-[#d6bcfa] flex items-center justify-between text-xs font-bold">
                <span>Prof. Dr. Tariq</span>
                <span className="bg-[#d6bcfa] px-2 py-0.5 rounded-full">Faculty Advisor</span>
              </div>
            </motion.div>

            {/* Note 5 - Light Yellow Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              className="bg-[#fefcbf] text-[#744210] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "Interest-free micro relief that trusts students. I paid back my PKR 15,000 voucher after my
                internship so another junior could register for finals."
              </p>
              <div className="mt-6 pt-3 border-t border-[#faf089] flex items-center justify-between text-xs font-bold">
                <span>Usman Ali</span>
                <span className="bg-[#faf089] px-2 py-0.5 rounded-full">Civil Dept</span>
              </div>
            </motion.div>

            {/* Note 6 - Soft Coral Pastel */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="bg-[#ffded4] text-[#822727] p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <p className="font-serif-editorial text-base sm:text-lg italic leading-relaxed">
                "Small contributions make massive waves. Over PKR 180,000 collected in micro-coins and zero rupees
                lost to middlemen or paperwork."
              </p>
              <div className="mt-6 pt-3 border-t border-[#fca385] flex items-center justify-between text-xs font-bold">
                <span>Campus Guild</span>
                <span className="bg-[#fca385] px-2 py-0.5 rounded-full">Student Union</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. LUSH AMBIENT GRADIENT CTA BANNER
      ────────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#072a1e] via-[#0d3829] to-[#041a12] p-10 sm:p-16 text-white text-center shadow-2xl border border-[#216148]">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ff8f6b]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#34d399]/20 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-widest text-[#34d399] bg-white/10 px-3 py-1 rounded-full border border-white/20">
            JOIN THE MOVEMENT
          </span>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-normal mt-5 leading-tight max-w-3xl mx-auto">
            One application today.{' '}
            <span className="italic font-serif font-light text-[#ff8f6b]">Zero worries</span> tomorrow.
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Whether you need emergency semester tuition or want to sponsor a student with a PKR 100 coin,
            you are shaping the future of education.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-4 rounded-full bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-base shadow-xl shadow-[#ff8f6b]/40 hover:scale-105 active:scale-95 transition-all"
            >
              Apply for Student Relief
            </button>
            <button
              onClick={() => setShowDonateModal(true)}
              className="px-8 py-4 rounded-full bg-white text-[#072a1e] hover:bg-[#eaf6ee] font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <FaHeart className="text-[#ff8f6b]" />
              <span>Donate PKR 100</span>
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. FOOTER WITH LARGE WORDMARK (matching reference)
      ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#03130d] text-slate-400 py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#072a1e] text-emerald-400 flex items-center justify-center font-bold">
                  <FaUniversity />
                </div>
                <span className="font-serif-editorial text-2xl font-bold text-white tracking-tight">
                  penny relief
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                Autonomous Student Micro-Donation & Emergency Relief Platform • Every Penny Counts for Higher Education.
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                ● MongoDB Atlas Connected • Gemini 2.5 Multi-Agent Active
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#ai-pipeline" className="hover:text-white">AI Need Pipeline</a></li>
                <li><a href="#calculator" className="hover:text-white">Need Calculator</a></li>
                <li><button onClick={() => navigate('/home')} className="hover:text-white">Admin Portal</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Transparency</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-400">0% Interest Rate</span></li>
                <li><span className="text-slate-400">≤ 15,000 PKR Per Capita</span></li>
                <li><span className="text-slate-400">CGPA ≥ 2.00 Requirement</span></li>
                <li><span className="text-slate-400">Open Audited Ledger</span></li>
              </ul>
            </div>
          </div>

          {/* Huge Brand Wordmark (matching the reference footer) */}
          <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center">
            <div className="text-center font-serif-editorial text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-white/10 select-none hover:text-white/20 transition-colors">
              penny relief
            </div>
            <p className="text-xs text-slate-500 mt-4">
              © {new Date().getFullYear()} PennyRelief Foundation. Built for educational equity with Google Gemini.
            </p>
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────────
          MODAL 1: APPLY FOR RELIEF MODAL
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#d2ebd9] relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-[#ffefe8] text-[#ff7a52] flex items-center justify-center text-lg">
                  <FaGraduationCap />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">
                    Emergency Relief Application
                  </h3>
                  <p className="text-xs text-slate-500">60-second digital submission • Evaluated by Gemini AI</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Application submitted! Autonomous AI agents are evaluating your profile against the PKR 15,000 per-capita benchmark.');
                  setShowApplyModal(false);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-bold text-[#072a1e] block mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Siddiqua"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Registration No</label>
                    <input
                      type="text"
                      required
                      placeholder="2024-PNY-EE-104"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Department</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none bg-white">
                      <option>Computer Science</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Chemical Engineering</option>
                      <option>Civil Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Monthly Family Income (PKR)</label>
                    <input
                      type="number"
                      required
                      placeholder="35000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Family Dependents</label>
                    <input
                      type="number"
                      required
                      placeholder="5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Required Relief Amount (PKR)</label>
                    <input
                      type="number"
                      required
                      placeholder="25000"
                      max="50000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Current CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="3.45"
                      min="2.00"
                      max="4.00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#072a1e] block mb-1">Reason for Emergency Relief</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Father is a daily wager; semester 5 exam registration voucher due next Monday..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-[#f3fbf6] border border-[#c1e8d5] text-[11px] text-[#072a1e]">
                  ✓ Automated benchmark: Per-capita household income $\le$ 15,000 PKR and CGPA $\ge$ 2.00.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-sm shadow-xl shadow-[#ff8f6b]/30 transition-all"
                >
                  Submit for Instant AI Verification
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────
          MODAL 2: DONATE PKR 100 MODAL
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#d2ebd9] relative"
            >
              <button
                onClick={() => {
                  setShowDonateModal(false);
                  setDonateSuccess(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-[#eaf6ee] text-[#072a1e] flex items-center justify-center text-lg">
                  <FaHeart className="text-[#ff8f6b]" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">
                    Donate Micro-Relief
                  </h3>
                  <p className="text-xs text-slate-500">Every PKR 100 funds an audited student's tuition</p>
                </div>
              </div>

              {donateSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-serif-editorial text-2xl font-bold text-[#072a1e]">
                    JazakAllah Khair!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Your contribution of PKR {donateAmount.toLocaleString()} has been logged into the student welfare pool.
                  </p>
                  <button
                    onClick={() => {
                      setShowDonateModal(false);
                      setDonateSuccess(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#072a1e] text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-[#072a1e] block mb-2">Select Contribution Amount</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 5000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonateAmount(amt)}
                          className={`py-2 rounded-xl font-bold text-xs transition-all ${
                            donateAmount === amt
                              ? 'bg-[#072a1e] text-white shadow-md'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          PKR {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Donor Name (or Anonymous)</label>
                    <input
                      type="text"
                      placeholder="Engr. Ali Raza / Anonymous"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff8f6b] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#072a1e] block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2 text-center font-bold">
                      <div className="p-2 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-800">
                        JazzCash
                      </div>
                      <div className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700">
                        EasyPaisa
                      </div>
                      <div className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700">
                        Stripe / Card
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f3fbf6] border border-[#c1e8d5] text-[11px] text-[#072a1e]">
                    100% of this donation goes directly into emergency student vouchers. PKR 0 admin overhead.
                  </div>

                  <button
                    onClick={() => setDonateSuccess(true)}
                    className="w-full py-3.5 rounded-full bg-[#ff8f6b] hover:bg-[#ff7a52] text-white font-bold text-sm shadow-xl shadow-[#ff8f6b]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FaHeart />
                    <span>Confirm PKR {donateAmount.toLocaleString()} Micro-Donation</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
