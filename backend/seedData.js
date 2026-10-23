const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./models/User.Model');
const { LoanApplication } = require('./models/LoanApplication.modal');
require('dotenv').config();

const dummyStudents = [
  {
    StudentName: 'Hamza Tariq',
    email: 'student@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-001',
    password: 'studentpassword123',
    semester: '5th',
    Dept: 'Computer Science',
    phoneNo: '03001234567',
    cnic: '3520112345671',
    loan: 'pending',
    loanAmount: 25000,
    loanPurpose: 'Semester 5 Tuition Fee Support'
  },
  {
    StudentName: 'Ayesha Siddiqua',
    email: 'ayesha.s@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-014',
    password: 'studentpassword123',
    semester: '6th',
    Dept: 'Electrical Engineering',
    phoneNo: '03019876543',
    cnic: '3520298765432',
    loan: 'approved',
    loanAmount: 30000,
    loanPurpose: 'Lab Kits & Exam Registration'
  },
  {
    StudentName: 'Bilal Ahmed',
    email: 'bilal.ahmed@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-029',
    password: 'studentpassword123',
    semester: '4th',
    Dept: 'Mechanical Engineering',
    phoneNo: '03124567890',
    cnic: '3520145678901',
    loan: 'pending',
    loanAmount: 20000,
    loanPurpose: 'Semester Books & Transportation'
  },
  {
    StudentName: 'Zainab Fatima',
    email: 'zainab.f@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-045',
    password: 'studentpassword123',
    semester: '7th',
    Dept: 'Chemical Engineering',
    phoneNo: '03337654321',
    cnic: '3520376543219',
    loan: 'approved',
    loanAmount: 35000,
    loanPurpose: 'Final Year Capstone Project Materials'
  },
  {
    StudentName: 'Usman Ali',
    email: 'usman.ali@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-058',
    password: 'studentpassword123',
    semester: '3rd',
    Dept: 'Civil Engineering',
    phoneNo: '03451122334',
    cnic: '3520111223345',
    loan: 'rejected',
    loanAmount: 40000,
    loanPurpose: 'Hostel Accommodation Fee'
  },
  {
    StudentName: 'Fatima Noor',
    email: 'fatima.noor@nfc.edu.pk',
    RegNo: 'uet-nfc-fd-bsc-072',
    password: 'studentpassword123',
    semester: '2nd',
    Dept: 'Computer Science',
    phoneNo: '03215544332',
    cnic: '3520155443321',
    loan: 'pending',
    loanAmount: 18000,
    loanPurpose: 'Laptop Repair & Software Licenses'
  }
];

const dummyApplicationsData = [
  {
    regNo: 'uet-nfc-fd-bsc-001',
    studentName: 'Hamza Tariq',
    email: 'student@nfc.edu.pk',
    phoneNo: '03001234567',
    semester: 5,
    cgpa: 3.52,
    dept: 'Computer Science',
    loanAmount: 25000,
    loanPurpose: 'Semester 5 Tuition Fee Support',
    fatherName: 'Tariq Mehmood',
    fatherOccupation: 'School Teacher (Retired)',
    fatherSalary: 45000,
    siblings: 4,
    status: 'pending',
    additionalNotes: 'Urgent fee deadline approaching. Father retired with pension.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    regNo: 'uet-nfc-fd-bsc-014',
    studentName: 'Ayesha Siddiqua',
    email: 'ayesha.s@nfc.edu.pk',
    phoneNo: '03019876543',
    semester: 6,
    cgpa: 3.84,
    dept: 'Electrical Engineering',
    loanAmount: 30000,
    loanPurpose: 'Lab Kits & Exam Registration',
    fatherName: 'Muhammad Siddique',
    fatherOccupation: 'Daily Wage Laborer',
    fatherSalary: 32000,
    siblings: 5,
    status: 'approved',
    additionalNotes: 'Dean honor list student. High financial need verified by department head.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    regNo: 'uet-nfc-fd-bsc-029',
    studentName: 'Bilal Ahmed',
    email: 'bilal.ahmed@nfc.edu.pk',
    phoneNo: '03124567890',
    semester: 4,
    cgpa: 3.12,
    dept: 'Mechanical Engineering',
    loanAmount: 20000,
    loanPurpose: 'Semester Books & Transportation',
    fatherName: 'Ahmed Raza',
    fatherOccupation: 'Small Shopkeeper',
    fatherSalary: 38000,
    siblings: 3,
    status: 'pending',
    additionalNotes: 'Need 100rs micro-loan grant for public transit and drawing supplies.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    regNo: 'uet-nfc-fd-bsc-045',
    studentName: 'Zainab Fatima',
    email: 'zainab.f@nfc.edu.pk',
    phoneNo: '03337654321',
    semester: 7,
    cgpa: 3.65,
    dept: 'Chemical Engineering',
    loanAmount: 35000,
    loanPurpose: 'Final Year Capstone Project Materials',
    fatherName: 'Ghulam Mustafa',
    fatherOccupation: 'Farmer',
    fatherSalary: 28000,
    siblings: 6,
    status: 'approved',
    additionalNotes: 'Rural background. Single earning member for family of 8.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    regNo: 'uet-nfc-fd-bsc-058',
    studentName: 'Usman Ali',
    email: 'usman.ali@nfc.edu.pk',
    phoneNo: '03451122334',
    semester: 3,
    cgpa: 1.85,
    dept: 'Civil Engineering',
    loanAmount: 40000,
    loanPurpose: 'Hostel Accommodation Fee',
    fatherName: 'Liaqat Ali',
    fatherOccupation: 'Business Owner',
    fatherSalary: 95000,
    siblings: 2,
    status: 'rejected',
    additionalNotes: 'High household income and CGPA below 2.0 minimum benchmark.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    regNo: 'uet-nfc-fd-bsc-072',
    studentName: 'Fatima Noor',
    email: 'fatima.noor@nfc.edu.pk',
    phoneNo: '03215544332',
    semester: 2,
    cgpa: 3.30,
    dept: 'Computer Science',
    loanAmount: 18000,
    loanPurpose: 'Laptop Repair & Software Licenses',
    fatherName: 'Noor Muhammad',
    fatherOccupation: 'Security Guard',
    fatherSalary: 35000,
    siblings: 4,
    status: 'under_review',
    additionalNotes: 'Requires micro-loan for digital device access to complete programming assignments.',
    cnicFrontImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    cnicBackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    electricityBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    gasBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    waterBillImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas for Seeding...');

  // 1. Seed Students
  const userMap = {};
  for (const s of dummyStudents) {
    let user = await UserModel.findOne({ email: s.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(s.password, 10);
      user = new UserModel({
        ...s,
        password: hashedPassword,
        isVerified: true
      });
      await user.save();
      console.log(`Created student: ${s.StudentName} (${s.RegNo})`);
    } else {
      user.loan = s.loan;
      user.loanAmount = s.loanAmount;
      user.loanPurpose = s.loanPurpose;
      await user.save();
      console.log(`Updated student: ${s.StudentName}`);
    }
    userMap[s.RegNo] = user._id;
  }

  // 2. Seed Loan Applications
  for (const app of dummyApplicationsData) {
    const existing = await LoanApplication.findOne({ regNo: app.regNo });
    if (!existing) {
      const newApp = new LoanApplication({
        ...app,
        user: userMap[app.regNo]
      });
      await newApp.save();
      console.log(`Created loan application for ${app.studentName} [Status: ${app.status}]`);
    } else {
      existing.status = app.status;
      existing.loanAmount = app.loanAmount;
      existing.cgpa = app.cgpa;
      existing.fatherSalary = app.fatherSalary;
      await existing.save();
      console.log(`Updated loan application for ${app.studentName}`);
    }
  }

  console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
