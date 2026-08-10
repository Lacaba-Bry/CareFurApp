import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles from '../assets/css/EditProfileStyles';

export default function EditProfileScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('Beia');
  const [lastName, setLastName] = useState('Ann');
  const [birthday, setBirthday] = useState('');
  const [age, setAge] = useState('23');
  const [sex, setSex] = useState('Female');

  const [showSexOptions, setShowSexOptions] = useState(false);

  const handleApply = () => {
    console.log({
      firstName,
      lastName,
      birthday,
      age,
      sex,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#16444A"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* PROFILE PHOTO */}
      <View style={styles.photoSection}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/Login/Logo.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.cameraButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="camera"
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.changeText}>
            Change Picture
          </Text>
        </TouchableOpacity>
      </View>

      {/* FORM CARD */}
      <View style={styles.form}>

        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />

        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />

        <Input
          label="Birthday"
          value={birthday}
          onChangeText={setBirthday}
          placeholder="MM/DD/YYYY"
          keyboardType="numbers-and-punctuation"
        />

        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="number-pad"
        />

        {/* SEX */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            Sex
          </Text>

          <View style={styles.selectWrapper}>
            <Pressable
              style={styles.select}
              onPress={() =>
                setShowSexOptions(!showSexOptions)
              }
            >
              <Text style={styles.selectText}>
                {sex}
              </Text>

              <Ionicons
                name={
                  showSexOptions
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color="#16444A"
              />
            </Pressable>

            {showSexOptions && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSex('Female');
                    setShowSexOptions(false);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    Female
                  </Text>
                </TouchableOpacity>

                <View style={styles.dropdownDivider} />

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSex('Male');
                    setShowSexOptions(false);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    Male
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

      </View>

      {/* BUTTONS */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancel}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>
            CANCEL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.apply}
          activeOpacity={0.8}
          onPress={handleApply}
        >
          <Text style={styles.applyText}>
            APPLY
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

/* REUSABLE INPUT */

type InputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'numbers-and-punctuation';
};

function Input({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
}: InputProps) {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}