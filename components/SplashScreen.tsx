import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomSplashScreen({ onAnimationComplete }) {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hideAsync();

    // Parallel animations
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onAnimationComplete, 500); // Extra delay for smooth transition
    });
  }, []);

  return (
    <LinearGradient
      colors={['#030960', '#1a237e']}
      style={styles.container}
    >
      <Animated.Image
        source={require('../assets/images/splash-logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});