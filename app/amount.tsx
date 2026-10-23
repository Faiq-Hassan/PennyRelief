import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const DonationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make your Impact</Text>
      
      {/* Card 1 */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: 'rgba(3, 9, 96, 1)' }]}
        onPress={() => Linking.openURL('https://buy.stripe.com/test_aFabJ30qa6658CTeVkdAk00')}
      >
        <Text style={styles.amount}>Rs. 1,000</Text>
        {/* <Text style={styles.cause}>Food Supplies</Text> */}
      </TouchableOpacity>

      {/* Card 2 */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: 'rgba(3, 9, 96, 1)' }]}
        onPress={() => Linking.openURL('https://buy.stripe.com/test_00wfZjeh00LL1ar6oOdAk02')}
      >
        <Text style={styles.amount}>Rs. 2,000</Text>
        {/* <Text style={styles.cause}>Clean Water</Text> */}
      </TouchableOpacity>

      {/* Card 3 */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: 'rgba(3, 9, 96, 1)' }]}
        onPress={() => Linking.openURL('https://buy.stripe.com/test_eVq28t3CmbqpaL114udAk04')}
      >
        <Text style={styles.amount}>Rs. 3,000</Text>
        {/* <Text style={styles.cause}>Education</Text> */}
      </TouchableOpacity>

      {/* Card 4 */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: 'rgba(3, 9, 96, 1)' }]}
        onPress={() => Linking.openURL('https://buy.stripe.com/test_8x214p6Oy3XX2ev6oOdAk03')}
      >
        <Text style={styles.amount}>Rs. 4,000</Text>
        {/* <Text style={styles.cause}>Medical Care</Text> */}
      </TouchableOpacity>

      {/* Card 5 */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: 'rgba(3, 9, 96, 1)' }]}
        onPress={() => Linking.openURL('https://buy.stripe.com/test_3cI5kF1ue5213iz8wWdAk01')}
      >
        <Text style={styles.amount}>Rs. 5,000</Text>
     
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: width - 40,
    height: 100,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  cause: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
});

export default DonationScreen;