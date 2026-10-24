const AdminModel = require("../models/Admin.Model");
const LoanApplicationModal = require("../models/LoanApplication.modal");
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User.Model")
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const otpServices = require('../Services/OptServices');


module.exports.Users = async (req, res) => {
    try {
        const users = await UserModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, users: users || [] });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(200).json({ 
          success: true, 
          users: [], 
          warning: 'Database reconnecting, served empty array',
          error: error.message 
        });
    }
};

module.exports.status = async (req, res) => {
  try {
    const aggregation = await LoanApplicationModal.LoanApplication.aggregate([
      { $match: { status: { $exists: true } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = { approved: 0, pending: 0, rejected: 0 };
    aggregation.forEach(item => {
      const key = String(item._id || '').toLowerCase();
      if (key in result) {
        result[key] = item.count;
      } else {
        result[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      statusCounts: result
    });
  } catch (error) {
    console.error('Error fetching status aggregation:', error.message);
    res.status(200).json({
      success: true,
      statusCounts: { approved: 0, pending: 0, rejected: 0 },
      warning: 'Fallback default counts served'
    });
  }
};

module.exports.LoanApplication = async (req, res) => {
  try {
    const applications = await LoanApplicationModal.LoanApplication.find()
      .populate('user', 'StudentName name email phoneNo')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.error('Error fetching loan applications:', error.message);
    return res.status(200).json({
      success: true,
      applications: [],
      warning: 'Empty application list served during DB reconnect'
    });
  }
};

module.exports.updateLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userID, loanAmount , loanPurpose } = req.body;

        // Find and update loan application
        const application = await LoanApplicationModal.LoanApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Loan application not found' });
        }

        // Find the user by userID
        const user = await UserModel.findById(userID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Load the HTML template
        const htmlPath = path.join(__dirname, '../email/loanStatusTemplate.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Customize status message
        const statusMessage = status === 'Approved'
            ? '🎉 Congratulations! Your loan application has been <strong>Approved</strong>. You can now proceed with the next steps. and Contact with our support Team <br> contact : +92-3057228059'
            : '❌ Unfortunately, your loan application has been <strong>rejected</strong> after review. For more info, please contact support.';
        console.log('Status Message:', statusMessage);
        // Replace placeholder in HTML template
        htmlContent = htmlContent
        .replace('{{STATUS_MESSAGE}}', statusMessage)
        .replace('{{USER_EMAIL}}', user.email || 'N/A')
        .replace('{{USER_ID}}', user._id || 'N/A')
  .replace('{{USER_NAME}}', user?.StudentName || 'User')
  .replace('{{REGISTRATION_NUMBER}}', user?.RegNo || 'N/A')
  .replace('{{LOAN_STATUS}}', status || 'Pending')
  .replace('{{LOAN_PURPOSE}}', user?.loanPurpose|| 'N/A')
  .replace('{{LOAN_AMOUNT}}', user?.loanAmount.toLocaleString() || 'N/A');

     
        // Send Email
        const transporter = await otpServices.transpoter();

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Loan Application Status Update',
            html: htmlContent,
        });
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            { loan: status , loanAmount, loanPurpose  },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Loan status updated and email sent successfully.',
            application,
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating loan application:', error);
        res.status(500).json({
            message: 'Error updating loan status or sending email',
            error
        });
    }
};

// module.exports.updateUserApplication = async(req,res)=>{
//     try {
//         const {id} = req.params
//         const {loan} = req.body
//         console.log('id', id)
//         console.log('loan', loan)
//         const application = await UserModel.findByIdAndUpdate(id, {loan}, {new: true});
//         if(!application){
//             return res.status(404).json({message : 'User application not found'})
//         }
//         res.status(200).json({sucess:true , message : 'User application updated successfully', application})
//     }
//     catch (error) {
//         console.log('Error to updating user application' , error)
//         res.status(400).json({message : 'Error to updating user application' , error})
//     }

// };
module.exports.DeleteLoanApplication = async(req,res)=>{
    try {
        const {id} = req.params
        const application = await LoanApplicationModal.LoanApplication.findByIdAndDelete(id)
        if(!application){
            return res.status(404).json({message : 'Loan application not found'})
        }
        res.status(200).json({sucess:true , message : 'Loan application deleted successfully'})
        
    } catch (error) {
        console.log('Error to deleting loan application' , error)
        res.status(400).json({message : 'Error to deleting loan application' , error})
    }

};
module.exports.deleteUser = async(req,res)=>{
    try {
        const {id} = req.params
        const user = await UserModel.findByIdAndDelete(id)
        if(!user){
            return res.status(404).json({message : 'User not found'})
        }
        res.status(200).json({sucess:true , message : 'User deleted successfully'})
        
    } catch (error) {
        console.log('Error to deleting user' , error)
        res.status(400).json({message : 'Error to deleting user' , error})
    }
}

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const Token = jwt.sign({
            id: admin._id,
            email: admin.email,
            name: admin.name,
        },
        process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: "Login successful", admin , Token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword
    });
     const Token = jwt.sign({
            id: newAdmin._id,
            email: newAdmin.email,
            name: newAdmin.name,
        },
        process.env.JWT_SECRET, { expiresIn: '1h' });
    
        newAdmin.Token= Token

    await newAdmin.save();
    res.status(201).json({ success: true, message: "Admin registered successfully", admin: newAdmin , Token });
  } catch (error) {
    console.error("Error during admin registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
