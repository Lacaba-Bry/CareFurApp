import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordScreen({ navigation, route }: any) {
  const [email, setEmail] = useState(String(route?.params?.email || ''));
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function sendResetEmail() {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      // Uses the recovery redirect configured under Supabase Auth URL Configuration.
      // The redirect destination must contain a password-update form that handles
      // Supabase recovery sessions; sending an email alone is not that form.
      const { error } = await supabase.auth.resetPasswordForEmail(normalized);
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to send the reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back to Login</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.description}>Enter the email address associated with your CareFur account. We'll send instructions to reset your password.</Text>
          {sent ? (
            <>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.description}>If an account exists for that address, a password reset email will arrive shortly. Also check your spam folder.</Text>
              <TouchableOpacity style={styles.button} onPress={() => { setSent(false); }}>
                <Text style={styles.buttonText}>SEND AGAIN</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                accessibilityLabel="Email address for password reset"
              />
              {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
              <TouchableOpacity style={[styles.button, loading && styles.disabled]} disabled={loading} onPress={sendResetEmail}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SEND RESET EMAIL</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF8' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10 },
  backText: { color: '#0B6E71', fontSize: 15, fontWeight: '600' },
  card: { width: '100%', maxWidth: 390, alignSelf: 'center', paddingTop: 45 },
  title: { color: '#0B6E71', fontSize: 29, fontWeight: '700', marginBottom: 12 },
  description: { color: '#586461', fontSize: 14, lineHeight: 22, marginBottom: 22 },
  input: { borderRadius: 12, backgroundColor: '#F0F2F1', color: '#333', paddingHorizontal: 16, height: 50, fontSize: 15, marginBottom: 12 },
  button: { backgroundColor: '#0B6E71', borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, minHeight: 49 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  disabled: { opacity: 0.65 },
  error: { color: '#B42318', marginBottom: 12, fontSize: 13 },
  successTitle: { color: '#0B6E71', fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
