Security Policy

NFC 100's Rupee Bank

Thank you for helping us keep the NFC 100's Rupee Bank project secure.

This project handles sensitive information such as user accounts, authentication credentials, student information, loan applications, uploaded documents, transactions, and payment-related data. Security issues should be reported responsibly and privately.

Supported Versions

Security updates are currently provided for the latest version of the project available in the "main" branch.

Version| Supported
Latest "main"| ✅
Older versions| ❌

Reporting a Vulnerability

If you discover a security vulnerability in this project, please do not report it through a public GitHub issue or pull request.

Please report security issues privately using one of the following methods:

- Email: muhammadrabeet15@gmail.com
- GitHub Security Advisory: If private vulnerability reporting is enabled for this repository, please use GitHub's private security reporting feature.

When reporting a vulnerability, please include:

1. A clear description of the vulnerability.
2. Steps to reproduce the issue.
3. The affected repository and file/endpoint, if known.
4. The potential security impact.
5. Any proof-of-concept or screenshots that help explain the issue.
6. A suggested fix, if you have one.

Please do not include real passwords, API keys, JWT secrets, payment credentials, personal documents, CNIC numbers, or other sensitive information in your report.

Response Process

We will make reasonable efforts to:

1. Acknowledge valid security reports as soon as possible.
2. Investigate and reproduce the reported issue.
3. Assess its severity and potential impact.
4. Develop and test an appropriate fix.
5. Release the fix when practical.
6. Credit the reporter if they wish to be acknowledged.

Response times may vary depending on the severity and complexity of the vulnerability.

Responsible Disclosure

Please give the maintainers reasonable time to investigate and address a vulnerability before publicly disclosing it.

Do not:

- Publicly disclose an unpatched vulnerability.
- Access, modify, or delete another user's data.
- Perform attacks that could interrupt or degrade the service.
- Attempt to obtain passwords, tokens, payment information, or other sensitive credentials.
- Upload malicious files to production systems.
- Conduct denial-of-service or other disruptive testing.

Security research should be performed responsibly and only against systems and data you are authorized to test.

Sensitive Information

Never commit sensitive credentials or secrets to this repository, including:

- JWT secrets
- MongoDB connection strings
- Cloudinary credentials
- Stripe secret keys
- SMTP credentials
- API keys
- User passwords
- Authentication tokens
- Private certificates or private keys
- Student personal information or documents

Use environment variables and appropriate secret-management mechanisms for sensitive configuration.

If a secret is accidentally committed, consider it compromised and rotate/revoke it immediately.

Security Practices

The project is designed with security measures including:

- JWT-based authentication
- Password hashing
- OTP/email verification
- Protected routes
- Input validation
- Request rate limiting
- CORS configuration
- File upload validation
- Secure session/token handling
- Error handling
- Secure environment configuration

The backend also integrates services such as MongoDB, Cloudinary, Nodemailer, and Stripe, so their credentials and configuration must be kept private.

Scope

This security policy applies to the NFC 100's Rupee Bank frontend and backend repositories maintained under:

- "Muhammadrabeet56/100-s-Rupee-Bank-front-end"
- "Muhammadrabeet56/100-s-Bank-Back-end"

Contact

For security-related concerns:

Muhammad Rabeet
Email: muhammadrabeet15@gmail.com

Thank you for helping us keep NFC 100's Rupee Bank secure.
