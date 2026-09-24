import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export async function pickImageFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required to choose a picture.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.82,
  });

  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return result.assets[0];
}

export async function uploadPublicImage({
  bucket,
  folder,
  ownerKey,
  uri,
}: {
  bucket: string;
  folder: string;
  ownerKey: string;
  uri: string;
}) {
  const extension = getExtension(uri);
  const path = `${folder}/${ownerKey}-${Date.now()}.${extension}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    cacheControl: '3600',
    upsert: true,
    contentType: blob.type || contentTypeFor(extension),
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data.publicUrl) throw new Error('The photo uploaded, but its public URL could not be created.');
  return data.publicUrl;
}

function getExtension(uri: string) {
  const clean = uri.split('?')[0];
  const ext = clean.split('.').pop()?.toLowerCase();
  if (ext === 'png' || ext === 'webp' || ext === 'jpeg' || ext === 'jpg') return ext === 'jpeg' ? 'jpg' : ext;
  return 'jpg';
}

function contentTypeFor(extension: string) {
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}
