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
} from 'react-native';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

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
        style={{ flex: 1 }}
      >
        {/* ========== UPPER PART ========== */}
        <View style={styles.upper}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>See your pet at all times ♡</Text>

          {/* Circular logo in the center */}
          <Image
            source={require('../assets/Login/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Form fields + checkbox */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
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
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>Agree with the Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== BOTTOM DOG + OVERLAY ========== */}
        <View style={styles.bottomSection}>
          {/* Dog photo (Logo.jpg) */}
          <Image
            source={require('../assets/Login/LogoSignup.png')}
            style={styles.dogImage}
            resizeMode="cover"
          />

          {/* Button + link overlaid on the dog */}
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.createButton} activeOpacity={0.85}>
              <Text style={styles.createButtonText}>CREATE AN ACCOUNT</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Click Here!</Text>
              </Text>
            </TouchableOpacity>
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
  upper: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 40,
    color: '#0B6E71',
    marginTop: 50,
  },
  subtitle: {
    fontSize: 13,
    color: '#0B6E71',
    marginTop: 4,
    marginBottom: 12,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 18,
  },
  form: {
    width: '100%',
    maxWidth: 340,
    marginTop: 40,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 11,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0B6E71',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0B6E71',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 13,
    color: '#555',
  },

  // Bottom dog section
  bottomSection: {
    flex: 1,
    position: 'relative',
    marginTop: -220,
  },
 dogImage: {
  ...StyleSheet.absoluteFill,   // ← changed here
  width: '100%',
  height: '100%',
},
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  createButton: {
    backgroundColor: '#0B6E71',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
    maxWidth: 340,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  loginLink: {
    color: '#fff',
    fontWeight: '700',
  },
});