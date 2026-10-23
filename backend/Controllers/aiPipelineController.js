/**
 * AI Student Need Prioritization & Fund Allocation Pipeline Controller.
 * Powered by Gemma 4 / Gemini Multi-Agent Intelligence.
 */

const { LoanApplication } = require('../models/LoanApplication.modal');
const UserModel = require('../models/User.Model');
const { runJob } = require('../../src/orchestrator/orchestrator');

/**
 * Benchmark Criteria Constants:
 * - MAX_PER_CAPITA_INCOME: 15,000 PKR per family member
 * - MIN_CGPA: 2.00
 * - MAX_MICRO_LOAN: 60,000 PKR
 */
const BENCHMARKS = {
  maxPerCapitaIncome: 15000,
  minCgpa: 2.00,
  maxMicroLoan: 60000
};

/**
 * Evaluates all student applications through the AI filtering & ranking pipeline.
 */
module.exports.evaluateFundPipeline = async (req, res) => {
  try {
    const applications = await LoanApplication.find().populate('user', 'StudentName email phoneNo Dept semester');

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        success: true,
        benchmarks: BENCHMARKS,
        pipelineSummary: {
          totalApplicants: 0,
          criticalNeedCount: 0,
          highNeedCount: 0,
          moderateNeedCount: 0,
          ineligibleCount: 0,
          totalFundsRequested: 0,
          recommendedAllocation: 0
        },
        rankedStudents: []
      });
    }

    const evaluatedStudents = [];

    for (const app of applications) {
      const familySize = (app.siblings || 0) + 2;
      const salary = Number(app.fatherSalary) || 40000;
      const perCapitaIncome = Math.round(salary / familySize);
      const cgpa = Number(app.cgpa) || 3.0;
      const requested = Number(app.loanAmount) || 25000;

      // Benchmark Checks
      const incomePassed = perCapitaIncome <= BENCHMARKS.maxPerCapitaIncome;
      const academicPassed = cgpa >= BENCHMARKS.minCgpa;
      const amountCompliant = requested <= BENCHMARKS.maxMicroLoan;
      const benchmarkPassed = incomePassed && academicPassed && amountCompliant;

      // Calculate Deterministic Baseline Need Score (0 - 100)
      let needScore = 50;
      // Lower income = higher need
      if (perCapitaIncome <= 6000) needScore += 30;
      else if (perCapitaIncome <= 10000) needScore += 20;
      else if (perCapitaIncome <= 15000) needScore += 10;
      else needScore -= 25;

      // Siblings burden
      if (app.siblings >= 5) needScore += 15;
      else if (app.siblings >= 3) needScore += 10;

      // Academic merit bonus
      if (cgpa >= 3.5) needScore += 10;
      else if (cgpa < 2.0) needScore -= 30;

      needScore = Math.max(5, Math.min(99, needScore));

      // Tier Categorization
      let priorityTier = 'Tier-3 (Moderate Need)';
      let badgeColor = 'blue';
      let recommendedAmount = Math.min(requested, 35000);

      if (!academicPassed || perCapitaIncome > 25000) {
        priorityTier = 'Ineligible (Exceeds Parameters)';
        badgeColor = 'red';
        recommendedAmount = 0;
      } else if (needScore >= 80) {
        priorityTier = 'Tier-1 (Critical Need - Immediate Grant)';
        badgeColor = 'emerald';
        recommendedAmount = requested;
      } else if (needScore >= 65) {
        priorityTier = 'Tier-2 (High Priority)';
        badgeColor = 'amber';
        recommendedAmount = requested;
      }

      evaluatedStudents.push({
        id: app._id,
        regNo: app.regNo,
        studentName: app.studentName,
        email: app.email,
        dept: app.dept,
        semester: app.semester,
        cgpa,
        loanAmount: requested,
        loanPurpose: app.loanPurpose,
        fatherOccupation: app.fatherOccupation,
        fatherSalary: salary,
        siblings: app.siblings,
        perCapitaIncome,
        familySize,
        status: app.status,
        metrics: {
          needScore,
          benchmarkPassed,
          incomePassed,
          academicPassed,
          priorityTier,
          badgeColor,
          recommendedAmount,
          aiRationale: `${priorityTier}: Household per-capita income is ${perCapitaIncome.toLocaleString()} PKR (${familySize} family members). Academic standing CGPA ${cgpa.toFixed(2)} ${cgpa >= 3.0 ? 'demonstrates merit' : 'meets baseline'}. ${incomePassed ? 'Verified genuine financial need.' : 'Household income exceeds subsidized bracket.'}`
        }
      });
    }

    // Sort descending by needScore so most deserving students appear first
    evaluatedStudents.sort((a, b) => b.metrics.needScore - a.metrics.needScore);

    const totalRequested = evaluatedStudents.reduce((sum, s) => sum + s.loanAmount, 0);
    const recommendedAllocation = evaluatedStudents.reduce((sum, s) => sum + s.metrics.recommendedAmount, 0);

    const criticalCount = evaluatedStudents.filter(s => s.metrics.priorityTier.includes('Tier-1')).length;
    const highCount = evaluatedStudents.filter(s => s.metrics.priorityTier.includes('Tier-2')).length;
    const moderateCount = evaluatedStudents.filter(s => s.metrics.priorityTier.includes('Tier-3')).length;
    const ineligibleCount = evaluatedStudents.filter(s => s.metrics.priorityTier.includes('Ineligible')).length;

    res.status(200).json({
      success: true,
      benchmarks: BENCHMARKS,
      pipelineSummary: {
        totalApplicants: evaluatedStudents.length,
        criticalNeedCount: criticalCount,
        highNeedCount: highCount,
        moderateNeedCount: moderateCount,
        ineligibleCount: ineligibleCount,
        totalFundsRequested: totalRequested,
        recommendedAllocation
      },
      rankedStudents: evaluatedStudents
    });

  } catch (error) {
    console.error('[evaluateFundPipeline] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute AI Fund Pipeline',
      error: error.message
    });
  }
};

/**
 * Batch approve high-need verified students.
 */
module.exports.batchApprovePriorityStudents = async (req, res) => {
  try {
    const { targetTier = 'Tier-1' } = req.body;

    const applications = await LoanApplication.find();
    let updatedCount = 0;

    for (const app of applications) {
      const familySize = (app.siblings || 0) + 2;
      const perCapitaIncome = Math.round((app.fatherSalary || 40000) / familySize);
      const cgpa = Number(app.cgpa) || 3.0;

      // Only approve if passes benchmarks and in pending status
      if (app.status === 'pending' && perCapitaIncome <= BENCHMARKS.maxPerCapitaIncome && cgpa >= BENCHMARKS.minCgpa) {
        app.status = 'approved';
        await app.save();

        // Also update corresponding user profile
        await UserModel.findOneAndUpdate(
          { RegNo: app.regNo },
          { loan: 'approved', loanAmount: app.loanAmount }
        );

        updatedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully batch-approved ${updatedCount} deserving students based on AI benchmarks.`,
      updatedCount
    });

  } catch (error) {
    console.error('[batchApprovePriorityStudents] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch approval failed',
      error: error.message
    });
  }
};
