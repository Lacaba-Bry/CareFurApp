import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';

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

export default function PetProfile({
  navigation,
  route,
}: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  const originalPet: Pet =
    route?.params?.pet;

  const [pet, setPet] =
    useState<Pet>(originalPet);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // Editable form values
  const [name, setName] =
    useState(originalPet?.name ?? '');

  const [species, setSpecies] =
    useState(originalPet?.species ?? '');

  const [breed, setBreed] =
    useState(originalPet?.breed ?? '');

  const [sex, setSex] =
    useState<
      'male' | 'female' | 'unknown'
    >(originalPet?.sex ?? 'unknown');

  const [weight, setWeight] =
    useState(
      originalPet?.weight_kg
        ? String(originalPet.weight_kg)
        : ''
    );

  const [birthDate, setBirthDate] =
    useState(
      originalPet?.birth_date ?? ''
    );

  const [allergies, setAllergies] =
    useState(
      originalPet?.allergies ?? ''
    );

  const [
    medicalNotes,
    setMedicalNotes,
  ] = useState(
    originalPet?.medical_notes ?? ''
  );

  const [
    feedingNotes,
    setFeedingNotes,
  ] = useState(
    originalPet?.feeding_notes ?? ''
  );

  if (!fontsLoaded) {
    return null;
  }

  // ============================================================
  // IMAGE
  // ============================================================

  const petImage =
    pet?.photo_url &&
    pet.photo_url.trim()
      ? {
          uri: pet.photo_url,
        }
      : require('../assets/Login/DogProfile.jpg');

  // ============================================================
  // CANCEL EDITING
  // ============================================================

  const cancelEditing = () => {
    setName(pet.name ?? '');
    setSpecies(pet.species ?? '');
    setBreed(pet.breed ?? '');
    setSex(
      pet.sex ?? 'unknown'
    );

    setWeight(
      pet.weight_kg
        ? String(pet.weight_kg)
        : ''
    );

    setBirthDate(
      pet.birth_date ?? ''
    );

    setAllergies(
      pet.allergies ?? ''
    );

    setMedicalNotes(
      pet.medical_notes ?? ''
    );

    setFeedingNotes(
      pet.feeding_notes ?? ''
    );

    setEditing(false);
  };

  // ============================================================
  // SAVE PET
  // ============================================================

  const savePet = async () => {
    if (!pet?.id) {
      Alert.alert(
        'Unable to save',
        'Pet ID was not found.'
      );

      return;
    }

    if (!name.trim()) {
      Alert.alert(
        'Name required',
        'Please enter your pet’s name.'
      );

      return;
    }

    if (!species.trim()) {
      Alert.alert(
        'Species required',
        'Please enter the pet species.'
      );

      return;
    }

    const parsedWeight =
      weight.trim()
        ? Number(weight)
        : null;

    if (
      parsedWeight !== null &&
      (Number.isNaN(parsedWeight) ||
        parsedWeight <= 0)
    ) {
      Alert.alert(
        'Invalid weight',
        'Please enter a valid weight.'
      );

      return;
    }

    try {
      setSaving(true);

      const updates = {
        name: name.trim(),

        species:
          species.trim(),

        breed:
          breed.trim() || null,

        sex,

        weight_kg:
          parsedWeight,

        birth_date:
          birthDate.trim() ||
          null,

        allergies:
          allergies.trim() ||
          null,

        medical_notes:
          medicalNotes.trim() ||
          null,

        feeding_notes:
          feedingNotes.trim() ||
          null,

        updated_at:
          new Date().toISOString(),
      };

      const {
        data,
        error,
      } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', pet.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPet(data);

      setEditing(false);

      Alert.alert(
        'Pet profile updated',
        `${data.name}'s profile has been saved.`
      );
    } catch (error: any) {
      console.error(
        'Pet update error:',
        error
      );

      Alert.alert(
        'Unable to save',
        error?.message ||
          'Something went wrong while updating the pet profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DISPLAY DATE
  // ============================================================

  const displayDate = (
    value?: string | null
  ) => {
    if (!value) {
      return 'Not provided';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#153F43"
            />
          </TouchableOpacity>

          <Text
            style={styles.title}
          >
            Pet Profile
          </Text>

          {!editing ? (
            <TouchableOpacity
              style={
                styles.editButton
              }
              onPress={() =>
                setEditing(true)
              }
            >
              <Ionicons
                name="create-outline"
                size={18}
                color="#14646B"
              />

              <Text
                style={
                  styles.editButtonText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                styles.headerButton
              }
              onPress={
                cancelEditing
              }
            >
              <Ionicons
                name="close"
                size={25}
                color="#A34D4D"
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          {/* PROFILE PHOTO */}

          <View
            style={
              styles.profileHeader
            }
          >
            <View
              style={
                styles.imageContainer
              }
            >
              <Image
                source={petImage}
                style={
                  styles.petImage
                }
              />

              <View
                style={
                  styles.pawBadge
                }
              >
                <Ionicons
                  name="paw"
                  size={18}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {!editing && (
              <>
                <Text
                  style={
                    styles.petName
                  }
                >
                  {pet?.name}
                </Text>

                <Text
                  style={
                    styles.petSubtitle
                  }
                >
                  {pet?.breed ||
                    pet?.species ||
                    'Pet'}
                </Text>
              </>
            )}
          </View>

          {/* EDIT FORM */}

          {editing ? (
            <>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Basic Information
              </Text>

              <InputField
                label="Pet Name"
                value={name}
                onChangeText={
                  setName
                }
                icon="paw-outline"
                placeholder="Enter pet name"
              />

              <InputField
                label="Species"
                value={species}
                onChangeText={
                  setSpecies
                }
                icon="heart-outline"
                placeholder="Example: Dog"
              />

              <InputField
                label="Breed"
                value={breed}
                onChangeText={
                  setBreed
                }
                icon="paw-outline"
                placeholder="Example: Golden Retriever"
              />

              {/* SEX */}

              <Text
                style={
                  styles.inputLabel
                }
              >
                Sex
              </Text>

              <View
                style={
                  styles.genderRow
                }
              >
                <GenderButton
                  title="Male"
                  icon="male"
                  active={
                    sex ===
                    'male'
                  }
                  onPress={() =>
                    setSex(
                      'male'
                    )
                  }
                />

                <GenderButton
                  title="Female"
                  icon="female"
                  active={
                    sex ===
                    'female'
                  }
                  onPress={() =>
                    setSex(
                      'female'
                    )
                  }
                />

                <GenderButton
                  title="Unknown"
                  icon="help"
                  active={
                    sex ===
                    'unknown'
                  }
                  onPress={() =>
                    setSex(
                      'unknown'
                    )
                  }
                />
              </View>

              <InputField
                label="Weight"
                value={weight}
                onChangeText={
                  setWeight
                }
                icon="scale-outline"
                placeholder="Example: 34"
                keyboardType="decimal-pad"
                suffix="kg"
              />

              <InputField
                label="Birth Date"
                value={
                  birthDate
                }
                onChangeText={
                  setBirthDate
                }
                icon="calendar-outline"
                placeholder="YYYY-MM-DD"
              />

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Health & Care
              </Text>

              <InputField
                label="Allergies"
                value={
                  allergies
                }
                onChangeText={
                  setAllergies
                }
                icon="alert-circle-outline"
                placeholder="None"
                multiline
              />

              <InputField
                label="Medical Notes"
                value={
                  medicalNotes
                }
                onChangeText={
                  setMedicalNotes
                }
                icon="medkit-outline"
                placeholder="Enter medical notes"
                multiline
              />

              <InputField
                label="Feeding Notes"
                value={
                  feedingNotes
                }
                onChangeText={
                  setFeedingNotes
                }
                icon="restaurant-outline"
                placeholder="Enter feeding notes"
                multiline
              />

              {/* SAVE */}

              <TouchableOpacity
                style={
                  styles.saveButton
                }
                onPress={savePet}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.saveButtonText
                      }
                    >
                      Save Changes
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={
                  cancelEditing
                }
                disabled={saving}
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* VIEW PROFILE */}

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Pet Information
              </Text>

              <View
                style={
                  styles.infoCard
                }
              >
                <ProfileRow
                  icon="paw-outline"
                  label="Name"
                  value={
                    pet?.name ||
                    'Not provided'
                  }
                />

                <Divider />

                <ProfileRow
                  icon="heart-outline"
                  label="Species"
                  value={
                    pet?.species ||
                    'Not provided'
                  }
                />

                <Divider />

                <ProfileRow
                  icon="paw-outline"
                  label="Breed"
                  value={
                    pet?.breed ||
                    'Not provided'
                  }
                />

                <Divider />

                <ProfileRow
                  icon={
                    pet?.sex ===
                    'female'
                      ? 'female'
                      : pet?.sex ===
                          'male'
                        ? 'male'
                        : 'help-circle-outline'
                  }
                  label="Sex"
                  value={
                    pet?.sex
                      ? pet.sex
                          .charAt(0)
                          .toUpperCase() +
                        pet.sex.slice(
                          1
                        )
                      : 'Unknown'
                  }
                />

                <Divider />

                <ProfileRow
                  icon="scale-outline"
                  label="Weight"
                  value={
                    pet?.weight_kg
                      ? `${pet.weight_kg} kg`
                      : 'Not provided'
                  }
                />

                <Divider />

                <ProfileRow
                  icon="calendar-outline"
                  label="Birthday"
                  value={displayDate(
                    pet?.birth_date
                  )}
                />
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Health & Care
              </Text>

              <View
                style={
                  styles.infoCard
                }
              >
                <ProfileRow
                  icon="alert-circle-outline"
                  label="Allergies"
                  value={
                    pet?.allergies ||
                    'None recorded'
                  }
                  vertical
                />

                <Divider />

                <ProfileRow
                  icon="medkit-outline"
                  label="Medical Notes"
                  value={
                    pet?.medical_notes ||
                    'None recorded'
                  }
                  vertical
                />

                <Divider />

                <ProfileRow
                  icon="restaurant-outline"
                  label="Feeding Notes"
                  value={
                    pet?.feeding_notes ||
                    'None recorded'
                  }
                  vertical
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// INPUT COMPONENT
// ============================================================

function InputField({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  suffix,
}: any) {
  return (
    <View
      style={
        styles.inputGroup
      }
    >
      <Text
        style={
          styles.inputLabel
        }
      >
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          multiline &&
            styles.multilineContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color="#14646B"
          style={
            multiline
              ? styles.multilineIcon
              : undefined
          }
        />

        <TextInput
          value={value}
          onChangeText={
            onChangeText
          }
          placeholder={
            placeholder
          }
          placeholderTextColor="#A0ADAE"
          keyboardType={
            keyboardType
          }
          multiline={multiline}
          style={[
            styles.input,
            multiline &&
              styles.multilineInput,
          ]}
        />

        {suffix && (
          <Text
            style={
              styles.inputSuffix
            }
          >
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
}

// ============================================================
// GENDER BUTTON
// ============================================================

function GenderButton({
  title,
  icon,
  active,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={[
        styles.genderButton,
        active &&
          styles.genderButtonActive,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={17}
        color={
          active
            ? '#FFFFFF'
            : '#14646B'
        }
      />

      <Text
        style={[
          styles.genderButtonText,
          active &&
            styles.genderButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// PROFILE ROW
// ============================================================

function ProfileRow({
  icon,
  label,
  value,
  vertical = false,
}: any) {
  return (
    <View
      style={[
        styles.profileRow,
        vertical &&
          styles.profileRowVertical,
      ]}
    >
      <View
        style={
          styles.profileIcon
        }
      >
        <Ionicons
          name={icon}
          size={19}
          color="#14646B"
        />
      </View>

      <View
        style={
          styles.profileTextContainer
        }
      >
        <Text
          style={
            styles.profileLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.profileValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={
        styles.divider
      }
    />
  );
}