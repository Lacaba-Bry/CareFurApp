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

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import { pickImageFromLibrary, uploadPublicImage } from '../lib/media';
import styles from '../assets/css/EditProfileStyles';

type OwnerProfile = {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  avatar_url?: string | null;
};

export default function EditProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) throw new Error('You need to be logged in to edit your profile.');

      const { data, error } = await supabase
        .from('owners')
        .select('id,full_name,email,phone,notes')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;

      const metadataAvatar = user.user_metadata?.avatar_url ?? null;
      let fallbackAvatar: string | null = null;
      if (!metadataAvatar) {
        const { data: userRow } = await supabase.from('users').select('avatar_url').eq('id', user.id).maybeSingle();
        fallbackAvatar = userRow?.avatar_url ?? null;
      }

      const next: OwnerProfile = data ?? {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: null,
        notes: null,
      };

      setProfile(next);
      setFullName(next.full_name || '');
      setEmail(next.email || user.email || '');
      setPhone(next.phone || '');
      setNotes(next.notes || '');
      setAvatarUrl(metadataAvatar || fallbackAvatar);
      setLocalAvatar(null);
    } catch (err: any) {
      console.error('Edit profile fetch error:', err);
      setError(err?.message || 'Unable to load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));

  const chooseAvatar = async () => {
    try {
      const asset = await pickImageFromLibrary();
      if (asset?.uri) setLocalAvatar(asset.uri);
    } catch (err: any) {
      showAlert('Photo', err?.message || 'Unable to choose a photo.');
    }
  };

  const saveProfile = async () => {
    if (!fullName.trim()) return showAlert('Name required', 'Please enter your full name.');

    try {
      setSaving(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) throw new Error('Your login session has expired.');

      let nextAvatar = avatarUrl;
      if (localAvatar) {
        setUploadingPhoto(true);
        nextAvatar = await uploadPublicImage({
          bucket: 'avatars',
          folder: 'owners',
          ownerKey: user.id,
          uri: localAvatar,
        });
      }

      const payload = {
        id: user.id,
        full_name: fullName.trim(),
        email: user.email ?? email.trim().toLowerCase(),
        phone: phone.trim() || null,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('owners')
        .upsert(payload, { onConflict: 'id' })
        .select('id,full_name,email,phone,notes')
        .single();
      if (error) throw error;

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), avatar_url: nextAvatar },
      });
      if (metadataError) throw metadataError;

      // Keep public.users synchronized because conversations.owner_id references it.
      const { error: userProfileError } = await supabase.from('users').upsert({
        id: user.id,
        full_name: fullName.trim(),
        email: user.email ?? email.trim().toLowerCase(),
        phone: phone.trim() || null,
        avatar_url: nextAvatar,
        role: 'owner',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (userProfileError) {
        console.warn('Public users sync warning:', userProfileError);
      }

      setProfile({ ...data, avatar_url: nextAvatar });
      setAvatarUrl(nextAvatar);
      setLocalAvatar(null);
      showAlert('Profile updated', 'Your owner profile has been saved.');
      navigation.goBack();
    } catch (err: any) {
      console.error('Profile save error:', err);
      const storageHint = String(err?.message || '').toLowerCase().includes('bucket')
        ? ' Create a public Supabase Storage bucket named "avatars" first.'
        : '';
      showAlert('Unable to save', (err?.message || 'Your profile could not be updated.') + storageHint);
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const avatarSource = useMemo(
    () => localAvatar ? { uri: localAvatar } : avatarUrl ? { uri: avatarUrl } : require('../assets/Login/Logo.jpg'),
    [localAvatar, avatarUrl]
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={colors.primaryDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.centerState}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.stateText}>Loading your profile...</Text></View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.profileHero}>
              <View style={styles.avatarWrap}>
                <Image source={avatarSource} style={styles.profileImage} resizeMode="cover" />
                <TouchableOpacity style={styles.cameraBadge} onPress={chooseAvatar} disabled={saving}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroName}>{fullName || 'Pet Owner'}</Text>
                <Text style={styles.heroEmail}>{email || 'Owner account'}</Text>
                <TouchableOpacity style={styles.changePhotoButton} onPress={chooseAvatar} disabled={saving}>
                  <Text style={styles.changePhotoText}>{localAvatar ? 'Photo selected' : 'Change profile photo'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <View style={styles.errorCard}><Ionicons name="alert-circle-outline" size={18} color={colors.danger} /><Text style={styles.errorText}>{error}</Text></View> : null}

            <Text style={styles.sectionTitle}>Account Information</Text>
            <Text style={styles.sectionSubtitle}>Keep your contact details accurate for the pet hotel.</Text>

            <View style={styles.formCard}>
              <Field label="Full Name" icon="person-outline" value={fullName} onChangeText={setFullName} placeholder="Full name" autoCapitalize="words" />
              <Field label="Email" icon="mail-outline" value={email} onChangeText={() => {}} placeholder="Email" editable={false} />
              <Field label="Phone" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
              <Field label="Notes" icon="document-text-outline" value={notes} onChangeText={setNotes} placeholder="Optional owner notes" multiline />
            </View>

            <View style={styles.infoNotice}><Ionicons name="lock-closed-outline" size={17} color={colors.primary} /><Text style={styles.infoNoticeText}>Email is linked to your login account. Your name, phone, notes, and profile photo can be updated here.</Text></View>

            <TouchableOpacity style={[styles.saveButton, saving && styles.disabledButton]} onPress={saveProfile} disabled={saving}>
              {saving ? <><ActivityIndicator color="#FFF" /><Text style={styles.saveButtonText}>{uploadingPhoto ? 'Uploading photo...' : 'Saving...'}</Text></> : <><Ionicons name="checkmark-circle-outline" size={20} color="#FFF" /><Text style={styles.saveButtonText}>Save Profile</Text></>}
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, multiline = false, editable = true, ...props }: any) {
  return <View style={styles.fieldGroup}><Text style={styles.label}>{label}</Text><View style={[styles.inputWrap, multiline && styles.multilineWrap, !editable && styles.readOnlyWrap]}><Ionicons name={icon} size={18} color={editable ? colors.primary : colors.textMuted} style={multiline ? styles.multilineIcon : undefined} /><TextInput {...props} editable={editable} multiline={multiline} placeholderTextColor={colors.textMuted} style={[styles.input, multiline && styles.multilineInput, !editable && styles.readOnlyInput]} /></View></View>;
}
function showAlert(title: string, message: string) { if (Platform.OS === 'web') window.alert(`${title}: ${message}`); else Alert.alert(title, message); }
