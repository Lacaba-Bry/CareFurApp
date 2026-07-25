import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

export default function WelcomeScreen({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>

        <Image
          source={require('../assets/Login/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.emailButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.emailButtonText}>LOGIN WITH EMAIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton} activeOpacity={0.8}>
          <Text style={styles.facebookButtonText}>LOGIN WITH FACEBOOK</Text>
        </TouchableOpacity>

        {/* Fixed: wrapped in <Text> */}
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>
        </Text>

        <Text style={styles.termsText}>
          By continuing you agree to our{'\n'}
          <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFdf8',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 42,
    color: '#0B6E71',
    marginBottom: 10,
  },
  logo: {
    width: 260,
    height: 260,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    maxWidth: 380,
    alignSelf: 'center',
    width: '100%',
  },
  emailButton: {
    backgroundColor: '#0B6E71',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  facebookButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 25,
  },
  signupLink: {
    color: '#0B6E71',
    fontWeight: '700',
  },
  termsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: '#0B6E71',
    fontWeight: '600',
  },
});