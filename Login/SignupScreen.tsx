import { useRef, useState } from 'react';
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
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [messageModal, setMessageModal] = useState<{ title: string; message: string; success?: boolean } | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const showMessage = (title: string, message: string, success = false) =>
    setMessageModal({ title, message, success });


  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  const openTerms = () => {
    setTermsRead(false);
    setTermsVisible(true);
  };

  const acceptTerms = () => {
    setTermsAccepted(true);
    setAgreed(true);
    setTermsVisible(false);
  };

  const handleCheckbox = () => {
    if (!termsAccepted) {
      openTerms();
      return;
    }
    setAgreed(previousValue => !previousValue);
  };

  const handleTermsScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const reachedBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (reachedBottom) {
      setTermsRead(true);
    }
  };

  const handleSignUp = async () => {
    if (!fullName.trim()) return showMessage('Name required', 'Please enter your full name.');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return showMessage('Email required', 'Enter a valid email address.');
    if (!password) return showMessage('Password required', 'Please enter a password.');
    if (password.length < 6) return showMessage('Password too short', 'Use at least 6 characters.');
    if (password !== confirmPassword) return showMessage('Passwords do not match', 'Please check your confirmation password.');
    if (!agreed) return showMessage('Agreement required', 'Please read and accept the Terms & Conditions.');

    setLoading(true);
    Keyboard.dismiss();
    const normalized = email.trim().toLowerCase();
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: normalized, password });
      if (authError) {
        const text = authError.message || '';
        if (/already|registered|exists|duplicate/i.test(text) || authError.status === 422) {
          showMessage('Account already exists', 'An account may already be registered with this email. Please log in or use Forgot Password.');
        } else showMessage('Sign up failed', text || 'Please try again later.');
        return;
      }
      // With email confirmations enabled Supabase can return an obfuscated user
      // with an empty identities array for an existing account.
      if (authData.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0) {
        showMessage('Account may already exist', 'Please sign in or use Forgot Password if you have registered with this email.');
        return;
      }
      if (!authData.user) {
        showMessage('Check your email', 'If registration can continue, follow the instructions sent to your email.');
        return;
      }

      // Existing application profile setup is preserved.
      const { error: insertError } = await supabase.from('owners').insert({
        id: authData.user.id, full_name: fullName.trim(), email: normalized,
      });
      if (insertError) {
        if (insertError.code === '23505') {
          showMessage('Account already exists', 'This email is already registered. Please log in or use Forgot Password.');
        } else {
          showMessage('Account created — setup incomplete', 'Please confirm your email and contact CareFur staff if your profile does not appear.');
          console.warn('Owner profile setup warning:', insertError.message);
        }
        return;
      }
      const { error: userProfileError } = await supabase.from('users').upsert({
        id: authData.user.id, full_name: fullName.trim(), email: normalized, role: 'owner',
      }, { onConflict: 'id' });
      if (userProfileError) console.warn('Public users profile warning:', userProfileError.message);
      showMessage('Account created', 'Your account has been created. Please confirm your email if requested, then log in.', true);
    } catch (err: any) {
      showMessage('Sign up failed', err?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.upper}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>See your pet at all times ♡</Text>

          <Image
            source={require('../assets/Login/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordField}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(v => !v)} accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color="#0B6E71" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordField}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(v => !v)} accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color="#0B6E71" />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreed && styles.checkboxChecked]}
                activeOpacity={0.8}
                onPress={handleCheckbox}
                disabled={loading}
              >
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.checkboxText}>
                I agree to the{' '}
                <Text style={styles.termsLink} onPress={openTerms}>
                  Terms & Conditions
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Image
            source={require('../assets/Login/LogoSignup.png')}
            style={styles.dogImage}
            resizeMode="cover"
          />

          <View style={styles.overlay}>
            <TouchableOpacity
              style={[
                styles.createButton,
                (!agreed || loading) && styles.createButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!agreed || loading}
              onPress={handleSignUp}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.createButtonText}>CREATE AN ACCOUNT</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Click Here!</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        </ScrollView>
        {/* Styled signup alerts */}
        <Modal transparent animationType="fade" visible={messageModal !== null} onRequestClose={() => setMessageModal(null)}>
          <View style={styles.alertBackdrop}>
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Ionicons name={messageModal?.success ? 'checkmark-circle-outline' : 'information-circle-outline'} size={34} color="#0B6E71" />
              </View>
              <Text style={styles.alertTitle}>{messageModal?.title}</Text>
              <Text style={styles.alertBody}>{messageModal?.message}</Text>
              <TouchableOpacity style={styles.alertAction} onPress={() => {
                const succeeded = messageModal?.success;
                setMessageModal(null);
                if (succeeded) navigation.navigate('Login');
              }}>
                <Text style={styles.alertActionText}>{messageModal?.success ? 'CONTINUE TO LOGIN' : 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Terms Modal */}
        <Modal
          visible={termsVisible}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setTermsVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Pet Owner Terms & Conditions
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTermsVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.readInstruction}>
                Scroll to the bottom to enable the agreement button.
              </Text>

              <ScrollView
                style={styles.termsScroll}
                contentContainerStyle={styles.termsContent}
                showsVerticalScrollIndicator
                onScroll={handleTermsScroll}
                scrollEventThrottle={16}
              >
                <Text style={styles.termsHeading}>1. Accurate Pet Information</Text>
                <Text style={styles.termsText}>
                  The pet owner must provide complete and accurate information
                  about the pet, including its name, breed, age, sex, weight,
                  temperament, health condition, feeding schedule, allergies,
                  medications and special care requirements.
                </Text>

                <Text style={styles.termsHeading}>
                  2. Health and Vaccination Requirements
                </Text>
                <Text style={styles.termsText}>
                  The pet owner confirms that the pet is healthy enough for
                  boarding and has received all vaccinations required by
                  Snuggles Premium Pet Hotel. Any contagious illness or recent
                  exposure to another sick animal must be disclosed before
                  admission.
                </Text>

                <Text style={styles.termsHeading}>
                  3. Medication and Special Care
                </Text>
                <Text style={styles.termsText}>
                  All medicines must be properly labelled and supplied with
                  clear written instructions. The pet hotel may refuse to
                  administer medication when the instructions are incomplete or
                  when doing so would place the pet or staff at risk.
                </Text>

                <Text style={styles.termsHeading}>4. Feeding Instructions</Text>
                <Text style={styles.termsText}>
                  The pet hotel will follow the feeding instructions submitted
                  by the owner. The owner is responsible for providing enough
                  food when a special diet is required. Minor schedule
                  adjustments may be made for safety or operational reasons.
                </Text>

                <Text style={styles.termsHeading}>5. Behaviour and Safety</Text>
                <Text style={styles.termsText}>
                  The owner must disclose aggressive, destructive, fearful or
                  escape-prone behaviour. Snuggles Premium Pet Hotel may
                  separate, restrict or relocate a pet when necessary to protect
                  the pet, other animals and staff members.
                </Text>

                <Text style={styles.termsHeading}>
                  6. Emergency Veterinary Care
                </Text>
                <Text style={styles.termsText}>
                  If the owner or emergency contact cannot be reached, the owner
                  authorizes the pet hotel to obtain reasonable veterinary
                  treatment when immediate care is necessary. Veterinary,
                  transportation and related expenses remain the owner's
                  responsibility.
                </Text>

                <Text style={styles.termsHeading}>
                  7. Camera Monitoring and Photos
                </Text>
                <Text style={styles.termsText}>
                  Cameras may be used to monitor pets, document feeding
                  activities and provide updates to owners. Camera availability
                  may be interrupted by maintenance, internet issues, power
                  outages or other technical problems.
                </Text>

                <Text style={styles.termsHeading}>8. Drop-off and Pickup</Text>
                <Text style={styles.termsText}>
                  The owner agrees to follow the confirmed drop-off and pickup
                  schedule. Additional charges may apply when a pet is collected
                  after the agreed time or requires an extended stay.
                </Text>

                <Text style={styles.termsHeading}>9. Fees and Payments</Text>
                <Text style={styles.termsText}>
                  The owner agrees to pay all boarding, feeding, veterinary and
                  additional service charges associated with the pet's stay.
                  Unpaid balances may affect future reservations.
                </Text>

                <Text style={styles.termsHeading}>
                  10. Personal Data and Privacy
                </Text>
                <Text style={styles.termsText}>
                  Owner and pet information will be used for account management,
                  reservations, pet care, communication, emergency response and
                  service improvement. Access will be limited to authorized
                  personnel and service providers as required for these purposes.
                </Text>

                <Text style={styles.termsHeading}>11. Owner Responsibility</Text>
                <Text style={styles.termsText}>
                  The owner remains responsible for undisclosed health
                  conditions, behaviour, inaccurate instructions and damage
                  caused by the pet. The pet hotel will use reasonable care but
                  cannot guarantee that every illness, injury, escape attempt or
                  unexpected event can be prevented.
                </Text>

                <Text style={styles.endOfTerms}>END OF TERMS</Text>

                <Text style={styles.termsText}>
                  By selecting I AGREE, you confirm that you have read,
                  understood and accepted all sections of these Pet Owner Terms
                  and Conditions.
                </Text>
              </ScrollView>

              <TouchableOpacity
                disabled={!termsRead}
                style={[
                  styles.acceptButton,
                  !termsRead && styles.disabledButton,
                ]}
                activeOpacity={0.85}
                onPress={acceptTerms}
              >
                <Text style={styles.acceptText}>
                  {termsRead ? 'I AGREE' : 'READ TERMS FIRST'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  keyboardView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF8',
  },
  upper: {
    zIndex: 2,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 20,
    color: '#0B6E71',
    fontFamily: 'DancingScript_700Bold',
    fontSize: 40,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 4,
    color: '#0B6E71',
    fontSize: 13,
  },
  logo: {
    width: 180,
    height: 180,
  },
  form: {
    zIndex: 3,
    width: '100%',
    maxWidth: 360,
    marginTop: 8,
  },
  input: {
    height: 46,
    marginBottom: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    color: '#333',
    fontSize: 15,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', height: 46, marginBottom: 9, borderRadius: 12, backgroundColor: '#F0F0F0' },
  passwordField: { flex: 1, height: '100%', paddingLeft: 16, fontSize: 15, color: '#333' },
  eyeButton: { width: 48, height: 46, alignItems: 'center', justifyContent: 'center' },
  alertBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)', padding: 24 },
  alertCard: { width: '100%', maxWidth: 370, padding: 25, borderRadius: 22, backgroundColor: '#FFFDF8', alignItems: 'center' },
  alertIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#E5F4F1', alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  alertTitle: { fontSize: 19, fontWeight: '800', color: '#16444A', textAlign: 'center', marginBottom: 10 },
  alertBody: { fontSize: 14, lineHeight: 21, color: '#607477', textAlign: 'center', marginBottom: 22 },
  alertAction: { width: '100%', backgroundColor: '#0B6E71', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  alertActionText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
    marginTop: 2,
  },
  checkbox: {
    width: 21,
    height: 21,
    marginRight: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0B6E71',
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#0B6E71',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxText: {
    flex: 1,
    color: '#555',
    fontSize: 13,
  },
  termsLink: {
    color: '#0B6E71',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    flex: 1,
    minHeight: 170,
    marginTop: -25,
    position: 'relative',
  },
  dogImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    bottom: 22,
    left: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  createButton: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#0B6E71',
  },
  createButtonDisabled: {
    opacity: 0.55,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginText: {
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
  },
  loginLink: {
    color: '#FFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalBox: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '88%',
    alignSelf: 'center',
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFDF8',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    flex: 1,
    paddingLeft: 30,
    color: '#0B6E71',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#444',
    fontSize: 28,
    lineHeight: 28,
  },
  readInstruction: {
    marginBottom: 10,
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
  },
  termsScroll: {
    flexGrow: 0,
    marginBottom: 14,
  },
  termsContent: {
    paddingBottom: 12,
  },
  termsHeading: {
    marginTop: 8,
    marginBottom: 4,
    color: '#16444A',
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    color: '#333',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'justify',
  },
  endOfTerms: {
    marginTop: 18,
    marginBottom: 8,
    color: '#0B6E71',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  acceptButton: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0B6E71',
  },
  disabledButton: {
    backgroundColor: '#AAA',
  },
  acceptText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});