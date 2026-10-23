import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Linking
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { router, useNavigation } from 'expo-router';
import { API_URL } from '@/constants/Project.Api';
import AuthWrapper from '@/components/AuthWrapper';
import { Route } from 'expo-router/build/Route';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.login);
  const { StudentName, RegNo, loanAmount , loanPurpose , loan } = user;
  const imageUrl = `${API_URL}${user.profileImage}`;
  const [modalVisible, setModalVisible] = useState(false);

  // Mock loan details - replace with actual data from your backend
  const activeLoanDetails = {
    totalAmount: loanAmount || 50000,
    loanPurpose: loanPurpose || 'Education',
    remainingAmount: loanAmount ,
    monthlyInstallment: 5000,
    nextDueDate: '2025-08-21',
    status: loan || 'Pending',
    // payments: [
    //   { date: '2023-11-15', amount: 5000, status: 'paid' },
    //   { date: '2023-10-15', amount: 5000, status: 'paid' }
    // ]
  };

  const showComingSoon = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 1500);
  };

  // const navigateToRepayment = () => {
  //   navigation.navigate('loanrepayment', { loanDetails: activeLoanDetails });
  // };

  // const getNextPaymentStatus = () => {
  //   const nextPayment = activeLoanDetails.payments.find(p => p.status === 'pending');
  //   return nextPayment ? 'Pending' : 'Up to date';
  // };

  return (
    <AuthWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={require('../../assets/images/topImg.png')}
              style={styles.logo}
            />
            <View style={styles.headerIcons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={showComingSoon}
              >
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.userInfo}>
            <View>
              <Text style={styles.userName}>{StudentName}</Text>
              <Text style={styles.userAccount}>{RegNo}</Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceText}>Rs. 00.0</Text>
              <TouchableOpacity 
                style={styles.addMoneyButton}
                onPress={showComingSoon}
              >
                <Text style={styles.addMoneyText}>+ Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loan Repayment Section - Only shown if user has loan */}
        {user.loan === 'Approved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loan Repayment</Text>
            <View style={styles.divider} />
            <View style={styles.loanRepaymentContainer}>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanLabel}>Loan Amount</Text>
                <Text style={styles.loanValue}>Rs. {activeLoanDetails.totalAmount}</Text>
              </View>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanLabel}>Monthly Installment:</Text>
                <Text style={styles.loanValue}>Rs. {activeLoanDetails.monthlyInstallment}</Text>
              </View>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanLabel}>Remaining Amount:</Text>
                <Text style={styles.loanValue}>Rs. {activeLoanDetails.remainingAmount}</Text>
              </View>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanLabel}>Next Due Date:</Text>
                <Text style={styles.loanValue}>{activeLoanDetails.nextDueDate}</Text>
              </View>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanLabel}>Status:</Text>
                <Text style={[styles.loanValue, 
                  activeLoanDetails.status === 'Pending' ? styles.pendingStatus : styles.paidStatus]}>
                  {activeLoanDetails.status}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.repayButton}
                  onPress={() => Linking.openURL('https://buy.stripe.com/test_fZu8wRgp88ed5qHcNcdAk05')}
              >
                <Text style={styles.repayButtonText}>Pay Installment</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions
        <View style={styles.section}>
         
          <View style={styles.divider} />
          <View style={styles.quickActions}>
            {[
              { icon: 'payment', label: 'Payments' },
              { icon: 'send', label: 'Send Money' },
              { icon: 'mobile-friendly', label: 'Mobile Load' }
            ].map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.actionButton}
                onPress={showComingSoon}
              >
                <MaterialIcons name={action.icon} size={24} color="#11408c" />
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Donation Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardMain}>
            <Image
              style={styles.cardImg}
              source={require('../../assets/images/hand-coins.png')}
            />
            <Text style={styles.cardHead}>
              Contribute 100rs to uplift a student's future
            </Text>
            <Text style={styles.cardText}>
              A tiny act of kindness, a lifetime of change
            </Text>
          </View>
       <TouchableOpacity
      style={styles.cardBottom}
      // onPress={()=> navigation.navigate('paymentScreen')}
      onPress={() => navigation.navigate('amount')}
    >
      <Text style={styles.bottomText}>Donate Now</Text>
      <Feather name="arrow-right" size={24} color="white" />
    </TouchableOpacity>
        </View>

        {/* Loan Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardMain}>
            <Image
              source={require('../../assets/images/book-copy.png')}
              style={styles.cardImg}
            />
            <Text style={styles.cardHead}>
              Need Help? Get a Hassle-Free Loan in Minutes.
            </Text>
            <Text style={styles.cardText}>
              Study Now, Pay When You're Able.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.cardBottom} 
            onPress={() => navigation.navigate('personalInfo')}
          >
            <Text style={styles.bottomText}>Apply For Loan</Text>
            <Feather name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle2}>Comming soon Features</Text>
          <Text style={styles.sectionTitle}>Top Picks for You</Text>
          <View style={styles.divider} />
          <View style={styles.gridContainer}>
            {[
              { icon: 'send', label: 'Send Money' },
              { icon: 'mobile-friendly', label: 'Mobile Load' },
              { icon: 'receipt', label: 'Tax Payment' },
              { icon: 'directions-car', label: 'M-Tag Recharge' },
              { icon: 'local-library', label: 'Library Fees' },
              { icon: 'school', label: 'Semester Fees' },
              { icon: 'book', label: 'Book shop' },
              { icon: 'payment', label: 'BNPL' },
            
            ].map((service, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.gridItem}
                onPress={showComingSoon}
              >
                <View style={styles.gridIcon}>
                  <MaterialIcons name={service.icon} size={24} color="#11408c" />
                </View>
                <Text style={styles.gridText}>{service.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Coming Soon Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <MaterialIcons name="timer" size={40} color="#11408c" style={styles.modalIcon} />
              <Text style={styles.modalTitle}>Feature Coming Soon!</Text>
              <Text style={styles.modalSubtitle}>We're working hard to bring you this functionality</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Got It</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AuthWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#11408c',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 120,
    height: 36,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userAccount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addMoneyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addMoneyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
  },
  sectionTitle: {
    color: '#11408c',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle2: {
    color: '#11408c',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionText: {
    color: '#11408c',
    fontSize: 12,
    marginTop: 8,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    overflow: 'hidden',
  },
  cardMain: {
    backgroundColor: 'rgba(206, 240, 249, 0.76)',
    padding: 24,
    paddingBottom: 36,
  },
  cardImg: {
    width: 32,
    height: 32,
    marginBottom: 12,
  },
  cardHead: {
    color: '#11408c',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  cardText: {
    color: '#11408c',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#11408c',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  bottomText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  gridIcon: {
    backgroundColor: '#e6f0ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gridText: {
    color: '#11408c',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11408c',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    backgroundColor: '#11408c',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Loan Repayment Styles
  loanRepaymentContainer: {
    paddingVertical: 8,
  },
  loanInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loanLabel: {
    color: '#555',
    fontSize: 14,
  },
  loanValue: {
    color: '#11408c',
    fontSize: 14,
    fontWeight: '500',
  },
  repayButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#11408c',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  repayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingStatus: {
    color: '#FF5722',
  },
  paidStatus: {
    color: '#4CAF50',
  }
});

export default HomeScreen;