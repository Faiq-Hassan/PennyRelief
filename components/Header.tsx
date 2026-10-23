import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

function Header() {
  return (
      <View style={styles.topMain}>
           <View style={styles.profileInfo}>
             <Text style={styles.donationHead}>100's Rupees Bank</Text>
             <Text style={styles.amount}>Empowering Lives Through Interest-Free Support</Text>
             <Text style={styles.amount}>See the Impact We Create Together.</Text>
           </View>
         </View>
  )

}
  const styles = StyleSheet.create({
    topMain: {
      backgroundColor: 'rgba(17, 64, 140, 1)',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingTop: Platform.OS === 'android' ? 48 : 60,
      paddingBottom: 24,
      marginBottom: 20,
    },
    profileInfo: {
      marginTop: 10,
      alignItems: 'center',
    },
    donationHead: {
      color: '#e3f2fd',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
    },
    amount: {
      color: 'white',
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'center',
    },
    container: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
})

export default Header
