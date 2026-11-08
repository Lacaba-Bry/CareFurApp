import React, { useRef, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
  Alert, ActivityIndicator, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const passwordRef = useRef<TextInput>(null);
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });

  React.useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      if (Platform.OS === 'web') window.alert('Please enter your email and password.');
      else Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    try {
      Keyboard.dismiss();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), password,
      });
      if (error) throw error;
      if (!data.session || !data.user) throw new Error('Login succeeded but no session was created.');
      await AsyncStorage.removeItem('boarding_access_code');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { guestMode: true } }] });
    } catch (error: any) {
      const message = error?.message || 'Something went wrong. Please try again.';
      if (Platform.OS === 'web') window.alert(`Login failed: ${message}`);
      else Alert.alert('Login failed', message);
    } finally { setLoading(false); }
  };

  if (!fontsLoaded) {
    return <View style={styles.loading}><ActivityIndicator color="#0B6E71" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, keyboardOpen && styles.scrollFocused]}
        >
          <Text style={[styles.title, keyboardOpen && styles.titleSmall]}>Login</Text>
          <Text style={styles.subtitle}>See your pet at all times ♡</Text>
          {!keyboardOpen && <Image source={require('../assets/Login/Logo.jpg')} style={styles.logo} resizeMode="contain" />}
          {!keyboardOpen && <Image source={require('../assets/Login/Loginver2.png')} style={styles.catImage} resizeMode="contain" />}

          <View style={[styles.formContainer, keyboardOpen && styles.formFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
              editable={!loading}
              onSubmitEditing={() => passwordRef.current?.focus()}
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.passwordRow}>
              <TextInput
                ref={passwordRef}
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
                autoCapitalize="none"
                returnKeyType="done"
                editable={!loading}
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 180)}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((previous) => !previous)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={23} color="#0B6E71" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword', { email: email.trim() })}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>LOGIN WITH EMAIL</Text>}
            </TouchableOpacity>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>Sign Up!</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF8' },
  keyboardView: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36 },
  scrollFocused: { justifyContent: 'center', paddingTop: 12, paddingBottom: 36 },
  title: { marginTop: 30, fontFamily: 'DancingScript_700Bold', fontSize: 58, color: '#0B6E71' },
  titleSmall: { marginTop: 0, fontSize: 42 },
  subtitle: { fontSize: 13, color: '#0B6E71', marginBottom: 3 },
  logo: { width: 240, height: 165 },
  catImage: { width: '100%', maxWidth: 335, height: 190, marginTop: -7, marginBottom: -4 },
  formContainer: { width: '100%', maxWidth: 340, alignItems: 'center', marginTop: 4 },
  formFocused: { marginTop: 20 },
  input: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDE8E6', borderRadius: 12, height: 52, paddingHorizontal: 17, fontSize: 15, marginBottom: 11, color: '#333' },
  passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderColor: '#DDE8E6', backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10 },
  passwordInput: { flex: 1, height: '100%', paddingLeft: 17, paddingRight: 5, color: '#333', fontSize: 15 },
  eyeButton: { width: 49, height: 50, alignItems: 'center', justifyContent: 'center' },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 14, paddingVertical: 4 },
  forgotText: { color: '#0B6E71', fontSize: 13 },
  loginButton: { width: '100%', backgroundColor: '#0B6E71', minHeight: 50, paddingVertical: 13, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  loginButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  signupText: { textAlign: 'center', color: '#666', fontSize: 13.5, marginBottom: 10 },
  signupLink: { color: '#0B6E71', fontWeight: '700' },
});
