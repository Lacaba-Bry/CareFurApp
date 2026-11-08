import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Read-only copy of the legal information displayed during signup.
// Update this page and SignupScreen.tsx together if the agreement changes.
export default function LegalInfoScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>Pet Owner Terms & Conditions</Text>
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
        <Text style={styles.footnote}>For agreement and account registration, continue to Sign Up.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF8' },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#DDE8E5' },
  back: { color: '#0B6E71', fontSize: 16, paddingVertical: 5 },
  title: { fontSize: 23, fontWeight: '700', color: '#0B6E71', marginTop: 4 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36 },
  description: { fontSize: 15, fontWeight: '700', color: '#16444A', marginBottom: 14 },
  termsHeading: { marginTop: 14, marginBottom: 5, color: '#16444A', fontSize: 15, fontWeight: '700' },
  termsText: { color: '#333', fontSize: 14, lineHeight: 22, textAlign: 'left' },
  endOfTerms: { marginTop: 24, marginBottom: 10, color: '#0B6E71', fontWeight: '800', textAlign: 'center' },
  footnote: { fontSize: 12, color: '#666', textAlign: 'center' },
});
