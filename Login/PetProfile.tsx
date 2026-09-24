import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import { pickImageFromLibrary, uploadPublicImage } from '../lib/media';
import styles from '../assets/css/PetProfileStyles';

type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  sex?: 'male' | 'female' | 'unknown' | null;
  birth_date?: string | null;
  weight_kg?: number | string | null;
  allergies?: string | null;
  medical_notes?: string | null;
  feeding_notes?: string | null;
  photo_url?: string | null;
};

export default function PetProfile({ navigation, route }: any) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const initialPet: Pet | null = route?.params?.pet ?? null;
  const petId = route?.params?.pet?.id ?? null;

  const [pet, setPet] = useState<Pet | null>(initialPet);
  const [loading, setLoading] = useState(!initialPet);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [name, setName] = useState(initialPet?.name ?? '');
  const [species, setSpecies] = useState(initialPet?.species ?? '');
  const [breed, setBreed] = useState(initialPet?.breed ?? '');
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>(initialPet?.sex ?? 'unknown');
  const [weight, setWeight] = useState(initialPet?.weight_kg != null ? String(initialPet.weight_kg) : '');
  const [birthDate, setBirthDate] = useState(initialPet?.birth_date ?? '');
  const [allergies, setAllergies] = useState(initialPet?.allergies ?? '');
  const [medicalNotes, setMedicalNotes] = useState(initialPet?.medical_notes ?? '');
  const [feedingNotes, setFeedingNotes] = useState(initialPet?.feeding_notes ?? '');

  const syncForm = useCallback((nextPet: Pet) => {
    setName(nextPet.name ?? '');
    setSpecies(nextPet.species ?? '');
    setBreed(nextPet.breed ?? '');
    setSex(nextPet.sex ?? 'unknown');
    setWeight(nextPet.weight_kg != null ? String(nextPet.weight_kg) : '');
    setBirthDate(nextPet.birth_date ?? '');
    setAllergies(nextPet.allergies ?? '');
    setMedicalNotes(nextPet.medical_notes ?? '');
    setFeedingNotes(nextPet.feeding_notes ?? '');
  }, []);

  const loadPet = useCallback(async () => {
    if (!petId) {
      setLoading(false);
      setError('Pet ID was not found.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('pets')
        .select('id,name,species,breed,sex,birth_date,weight_kg,allergies,medical_notes,feeding_notes,photo_url')
        .eq('id', petId)
        .single();

      if (error) throw error;
      setPet(data as Pet);
      syncForm(data as Pet);
    } catch (err: any) {
      console.error('Pet profile fetch error:', err);
      setError(err?.message || 'Unable to refresh pet profile.');
    } finally {
      setLoading(false);
    }
  }, [petId, syncForm]);

  useFocusEffect(
    useCallback(() => {
      loadPet();
    }, [loadPet])
  );

  const petImage = useMemo(
    () =>
      localPhoto
        ? { uri: localPhoto }
        : pet?.photo_url?.trim()
          ? { uri: pet.photo_url }
          : require('../assets/Login/DogProfile.jpg'),
    [localPhoto, pet?.photo_url]
  );

  const choosePetPhoto = async () => {
    try {
      const asset = await pickImageFromLibrary();
      if (asset?.uri) setLocalPhoto(asset.uri);
    } catch (err: any) {
      showAlert('Photo', err?.message || 'Unable to choose a photo.');
    }
  };

  const cancelEditing = () => {
    if (pet) syncForm(pet);
    setLocalPhoto(null);
    setEditing(false);
  };

  const savePet = async () => {
    if (!pet?.id) return;
    if (!name.trim()) return showAlert('Name required', 'Please enter the pet name.');
    if (!species.trim()) return showAlert('Species required', 'Please enter the pet species.');

    const parsedWeight = weight.trim() ? Number(weight) : null;
    if (parsedWeight !== null && (!Number.isFinite(parsedWeight) || parsedWeight <= 0)) {
      return showAlert('Invalid weight', 'Enter a valid weight greater than 0.');
    }

    if (birthDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
      return showAlert('Invalid birth date', 'Use YYYY-MM-DD format, for example 2022-05-10.');
    }

    try {
      setSaving(true);
      let nextPhotoUrl = pet.photo_url ?? null;
      if (localPhoto) {
        setUploadingPhoto(true);
        nextPhotoUrl = await uploadPublicImage({
          bucket: 'pet-photos',
          folder: 'pets',
          ownerKey: pet.id,
          uri: localPhoto,
        });
      }

      const updates = {
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim() || null,
        sex,
        weight_kg: parsedWeight,
        birth_date: birthDate.trim() || null,
        allergies: allergies.trim() || null,
        medical_notes: medicalNotes.trim() || null,
        feeding_notes: feedingNotes.trim() || null,
        photo_url: nextPhotoUrl,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', pet.id)
        .select('id,name,species,breed,sex,birth_date,weight_kg,allergies,medical_notes,feeding_notes,photo_url')
        .single();

      if (error) throw error;
      setPet(data as Pet);
      syncForm(data as Pet);
      setLocalPhoto(null);
      setEditing(false);
      showAlert('Saved', `${data.name}'s profile has been updated.`);
    } catch (err: any) {
      console.error('Pet update error:', err);
      showAlert('Unable to save', err?.message || 'The pet profile could not be updated.');
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={colors.primaryDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Pet Profile</Text>
          {!editing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)} disabled={!pet}>
              <Ionicons name="create-outline" size={17} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.headerButton} onPress={cancelEditing} disabled={saving}>
              <Ionicons name="close" size={25} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        {loading && !pet ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading pet profile...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {error ? (
              <View style={styles.noticeCard}>
                <Ionicons name="information-circle-outline" size={18} color={colors.warning} />
                <Text style={styles.noticeText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.heroCard}>
              <View style={styles.petImageWrap}>
                <Image source={petImage} style={styles.petImage} resizeMode="cover" />
                {editing ? (
                  <TouchableOpacity style={styles.photoButton} onPress={choosePetPhoto} disabled={saving}>
                    <Ionicons name="camera" size={16} color="#FFF" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.heroText}>
                <Text style={styles.petName}>{pet?.name || 'Pet'}</Text>
                <Text style={styles.petSubtitle}>{[pet?.breed, pet?.species].filter(Boolean).join(' • ') || 'Pet profile'}</Text>
                <View style={styles.miniBadge}>
                  <Ionicons name="paw" size={13} color={colors.primary} />
                  <Text style={styles.miniBadgeText}>CareFur Pet</Text>
                </View>
              </View>
            </View>

            {editing ? (
              <>
                <SectionTitle title="Basic Information" subtitle="Update the details used by the pet hotel." />
                <View style={styles.formCard}>
                  <InputField label="Pet Name" value={name} onChangeText={setName} icon="paw-outline" placeholder="Pet name" />
                  <InputField label="Species" value={species} onChangeText={setSpecies} icon="heart-outline" placeholder="Dog, Cat, etc." />
                  <InputField label="Breed" value={breed} onChangeText={setBreed} icon="paw-outline" placeholder="Breed" />

                  <Text style={styles.inputLabel}>Sex</Text>
                  <View style={styles.segmentRow}>
                    <Segment title="Male" icon="male" active={sex === 'male'} onPress={() => setSex('male')} />
                    <Segment title="Female" icon="female" active={sex === 'female'} onPress={() => setSex('female')} />
                    <Segment title="Unknown" icon="help" active={sex === 'unknown'} onPress={() => setSex('unknown')} />
                  </View>

                  <InputField label="Weight" value={weight} onChangeText={setWeight} icon="scale-outline" placeholder="Example: 12.5" keyboardType="decimal-pad" suffix="kg" />
                  <InputField label="Birth Date" value={birthDate} onChangeText={setBirthDate} icon="calendar-outline" placeholder="YYYY-MM-DD" />
                </View>

                <SectionTitle title="Health & Care" subtitle="Keep care notes clear for hotel staff." />
                <View style={styles.formCard}>
                  <InputField label="Allergies" value={allergies} onChangeText={setAllergies} icon="alert-circle-outline" placeholder="None" multiline />
                  <InputField label="Medical Notes" value={medicalNotes} onChangeText={setMedicalNotes} icon="medkit-outline" placeholder="Medical notes" multiline />
                  <InputField label="Feeding Notes" value={feedingNotes} onChangeText={setFeedingNotes} icon="restaurant-outline" placeholder="Feeding notes" multiline />
                </View>

                <TouchableOpacity style={[styles.saveButton, saving && styles.disabledButton]} onPress={savePet} disabled={saving}>
                  {saving ? <ActivityIndicator color="#FFF" /> : <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                    <Text style={styles.saveButtonText}>{uploadingPhoto ? 'Uploading photo...' : 'Save Changes'}</Text>
                  </>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing} disabled={saving}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <SectionTitle title="Pet Information" subtitle="Profile details from the current pet record." />
                <View style={styles.infoCard}>
                  <InfoRow icon="paw-outline" label="Name" value={pet?.name || 'Not provided'} />
                  <InfoRow icon="heart-outline" label="Species" value={pet?.species || 'Not provided'} />
                  <InfoRow icon="paw-outline" label="Breed" value={pet?.breed || 'Not provided'} />
                  <InfoRow icon={pet?.sex === 'female' ? 'female' : pet?.sex === 'male' ? 'male' : 'help-circle-outline'} label="Sex" value={capitalize(pet?.sex) || 'Unknown'} />
                  <InfoRow icon="scale-outline" label="Weight" value={pet?.weight_kg != null ? `${pet.weight_kg} kg` : 'Not provided'} />
                  <InfoRow icon="calendar-outline" label="Birthday" value={displayDate(pet?.birth_date)} last />
                </View>

                <SectionTitle title="Health & Care" subtitle="Information shared with the pet hotel." />
                <View style={styles.infoCard}>
                  <InfoRow icon="alert-circle-outline" label="Allergies" value={pet?.allergies || 'None recorded'} vertical />
                  <InfoRow icon="medkit-outline" label="Medical Notes" value={pet?.medical_notes || 'None recorded'} vertical />
                  <InfoRow icon="restaurant-outline" label="Feeding Notes" value={pet?.feeding_notes || 'None recorded'} vertical last />
                </View>
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View>;
}

function InputField({ label, value, onChangeText, icon, placeholder, keyboardType = 'default', multiline = false, suffix }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
        <Ionicons name={icon} size={19} color={colors.primary} style={multiline ? styles.multilineIcon : undefined} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.input, multiline && styles.multilineInput]}
        />
        {suffix ? <Text style={styles.inputSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function Segment({ title, icon, active, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.segment, active && styles.segmentActive]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={active ? '#FFF' : colors.primary} />
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ icon, label, value, vertical = false, last = false }: any) {
  return (
    <View style={[styles.infoRow, vertical && styles.infoRowVertical, !last && styles.infoRowBorder]}>
      <View style={styles.infoIcon}><Ionicons name={icon} size={19} color={colors.primary} /></View>
      <View style={styles.infoText}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>
    </View>
  );
}

function displayDate(value?: string | null) {
  if (!value) return 'Not provided';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function capitalize(value?: string | null) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}: ${message}`);
  else Alert.alert(title, message);
}
