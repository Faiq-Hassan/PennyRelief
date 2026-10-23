const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/adminController');
const Stripecontroller = require('../Controllers/stripeController');
const AiPipelineController = require('../Controllers/aiPipelineController');

router.post('/login', AdminController.adminLogin);
router.post('/register', AdminController.adminRegister);
router.get('/users' , AdminController.Users);

// AI Need Prioritization & Fund Allocation Pipeline
router.get('/ai-pipeline', AiPipelineController.evaluateFundPipeline);
router.post('/ai-pipeline/batch-approve', AiPipelineController.batchApprovePriorityStudents);

router.delete('/deleteUser/:id', AdminController.deleteUser);
router.get('/loanApplications', AdminController.LoanApplication);
router.patch('/updateLoanApplication/:id', AdminController.updateLoanApplication);
router.delete('/deleteLoanApplication/:id', AdminController.DeleteLoanApplication);
router.get('/loanstatus', AdminController.status);
router.get('/stripe/payers', Stripecontroller.getPaymentLinkAnalytics);

module.exports = router;