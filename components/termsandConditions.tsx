import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to 100's Rupees Bank (“the App”). This App facilitates interest-free loans
        to needy individuals and students for educational and business purposes, funded by monthly donations from users.
        By accessing or using the App, you agree to be bound by these Terms and Conditions.
      </Text>

      <Text style={styles.sectionTitle}>2. Eligibility</Text>
      <Text style={styles.text}>
        You must be at least 18 years old to use this App. Students and needy individuals can apply for loans.
        Donors agree to contribute ₹100 or more monthly as donations.
      </Text>

      <Text style={styles.sectionTitle}>3. Donations</Text>
      <Text style={styles.text}>
        Donations made by users are voluntary and non-refundable. The App uses these donations to provide interest-free loans.
        The App is not responsible for any tax implications related to donations.
      </Text>

      <Text style={styles.sectionTitle}>4. Loan Eligibility and Approval</Text>
      <Text style={styles.text}>
        Loans are granted at the sole discretion of the App’s administrators based on submitted information.
        Approval depends on eligibility criteria and available funds. The App reserves the right to reject any loan application without providing reasons.
      </Text>

      <Text style={styles.sectionTitle}>5. Loan Terms</Text>
      <Text style={styles.text}>
        Loans provided through the App are interest-free. Borrowers agree to repay the principal amount as per the agreed schedule.
        Failure to repay on time may affect future loan eligibility.
      </Text>

      <Text style={styles.sectionTitle}>6. Use of Loans</Text>
      <Text style={styles.text}>
        Loans must be used only for educational expenses or starting/expanding a lawful business.
        Misuse of funds may result in penalties or legal action.
      </Text>

      <Text style={styles.sectionTitle}>7. Privacy</Text>
      <Text style={styles.text}>
        We respect your privacy and handle your personal information in accordance with our Privacy Policy.
        By using the App, you consent to data collection and usage as described.
      </Text>

      <Text style={styles.sectionTitle}>8. User Conduct</Text>
      <Text style={styles.text}>
        Users must not misuse the App or interfere with its proper functioning.
        Any fraudulent or abusive behavior may result in suspension or termination of your account.
      </Text>

      <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
      <Text style={styles.text}>
        All content, trademarks, and data on the App are the property of 100's Rupees Bank or its licensors.
        Users may not reproduce or distribute content without permission.
      </Text>

      <Text style={styles.sectionTitle}>10. Disclaimers and Limitation of Liability</Text>
      <Text style={styles.text}>
        The App is provided “as is” without warranties of any kind.
        We do not guarantee loan approvals or outcomes.
        We are not liable for any losses or damages resulting from use of the App.
      </Text>

      <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
      <Text style={styles.text}>
        We reserve the right to modify these Terms at any time.
        Continued use after changes constitutes acceptance of the new Terms.
      </Text>

      <Text style={styles.sectionTitle}>12. Governing Law</Text>
      <Text style={styles.text}>
        These Terms are governed by the laws of the jurisdiction where the App operates.
        Any disputes shall be subject to the exclusive jurisdiction of the courts in that location.
      </Text>

      <Text style={styles.sectionTitle}>13. Contact Us</Text>
      <Text style={styles.text}>
        For any questions or concerns regarding these Terms, please contact our support team through the App.
      </Text>

      <Text style={[styles.text, styles.footer]}>Last updated: May 2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11408c',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11408c',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'justify',
  },
  footer: {
    marginTop: 40,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
});
