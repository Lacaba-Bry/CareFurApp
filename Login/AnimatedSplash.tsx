import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function AnimatedSplash({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const scale = useRef(new Animated.Value(0.75)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [pawCount, setPawCount] = useState(1);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const pawTimer = setInterval(() => {
      setPawCount((current) => {
        if (current >= 10) {
          clearInterval(pawTimer);

          setTimeout(() => {
            onFinish();
          }, 500);

          return 10;
        }

        return current + 1;
      });
    }, 220);

    return () => {
      clearInterval(pawTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={require('../assets/Login/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Text style={styles.loadingText}>
        Preparing your pet's stay...
      </Text>

      <View style={styles.pawContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Ionicons
            key={index}
            name="paw"
            size={18}
            color={
              index < pawCount
                ? '#14646B'
                : '#D8E7E6'
            }
          />
        ))}
      </View>

      <Text style={styles.loadingNumber}>
        {pawCount}/10
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoWrapper: {
    width: 190,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 95,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#14646B',
  },

  pawContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },

  loadingNumber: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#16444A',
  },
});