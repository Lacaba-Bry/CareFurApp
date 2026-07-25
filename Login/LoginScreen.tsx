import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>See your pet at all times ♡</Text>

        {/* Logo */}
        <Image
          source={require('../assets/Login/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Cat + Form */}
        <View style={styles.catWrapper}>
          <Image
            source={require('../assets/Login/Loginver2.png')}
            style={styles.catImage}
            resizeMode="contain"
          />

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.85}>
              <Text style={styles.loginButtonText}>LOGIN WITH EMAIL</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
            Don't have an account?{' '}
<Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
  Sign Up!
</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFdf8',
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    marginTop: 50,
    fontFamily: 'DancingScript_700Bold',
    fontSize: 60,
    color: '#0B6E71',
  },
  subtitle: {
    fontSize: 13,
    color: '#0B6E71',
    marginTop: 2,
    marginBottom: 5,
  },
  logo: {
    width: 280,
    height: 220,
    marginBottom: -15,
  },
  catWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  catImage: {
    width: 330,
    height: height * 0.48, // responsive height
    bottom: -50,
  },
  formContainer: {
    position: 'absolute',
    bottom: height * 0.06,
    width: '82%',
    maxWidth: 320,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotText: {
    color: '#0B6E71',
    fontSize: 12.5,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#0B6E71',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13.5,
  },
  signupLink: {
    color: '#0B6E71',
    fontWeight: '700',
  },
});