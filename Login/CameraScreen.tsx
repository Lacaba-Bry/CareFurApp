import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/CameraScreenStyles';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';
const CAMERA_STREAM_URL = 'https://ground-uselessly-rosy.ngrok-free.dev/stream';
const CAMERA_CAPTURE_URL = 'https://ground-uselessly-rosy.ngrok-free.dev/capture';

type Snapshot = {
  id: string;
  uri: string;
  capturedAt: Date;
};

export default function CameraScreen({ route }: any) {
  const params = route?.params ?? {};
  const webViewRef = useRef<WebView>(null);
  const [pet, setPet] = useState<any>(params.pet ?? null);
  const [room, setRoom] = useState<any>(params.room ?? null);
  const [cameraDevice, setCameraDevice] = useState<any>(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [webReloadKey, setWebReloadKey] = useState(0);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [capturing, setCapturing] = useState(false);

  const loadContext = useCallback(async () => {
    try {
      setMetaError(null);
      const code = params.accessCode || await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
      if (!code) return;

      const { data, error } = await supabase.functions.invoke('verify-booking-code', { body: { code } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.pet) setPet(data.pet);

      if (data?.room) {
        setRoom(data.room);
        const { data: assigned, error: deviceError } = await supabase
          .from('room_devices')
          .select('device_id,devices(id,device_code,device_name,device_type,status,last_seen_at)')
          .eq('room_id', data.room.id)
          .is('unassigned_at', null);

        if (!deviceError) {
          const camera = (assigned ?? [])
            .map((x: any) => x.devices)
            .find((d: any) => d?.device_type === 'camera');
          setCameraDevice(camera ?? null);
        }
      }
    } catch (err: any) {
      console.warn('Camera context warning:', err);
      setMetaError(err?.message || 'Camera details could not be refreshed.');
    } finally {
      setRefreshing(false);
    }
  }, [params.accessCode]);

  useFocusEffect(useCallback(() => { loadContext(); }, [loadContext]));

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    setCameraLoading(true);
    const timer = setTimeout(() => setCameraLoading(false), 1400);
    return () => clearTimeout(timer);
  }, [webReloadKey]);

  const reloadCamera = () => {
    setCameraError(false);
    setCameraLoading(true);
    if (Platform.OS === 'web') setWebReloadKey((v) => v + 1);
    else webViewRef.current?.reload();
  };

  const captureSnapshot = async () => {
    try {
      setCapturing(true);
      // ESP32-CAM CameraWebServer commonly exposes /capture. Adding a timestamp
      // prevents the image from being served from cache.
      const uri = `${CAMERA_CAPTURE_URL}?t=${Date.now()}`;
      const snapshot: Snapshot = { id: String(Date.now()), uri, capturedAt: new Date() };
      setSnapshots((current) => [snapshot, ...current].slice(0, 12));
    } finally {
      setCapturing(false);
    }
  };

  const petImage = pet?.photo_url ? { uri: pet.photo_url } : require('../assets/Login/DogProfile.jpg');
  const deviceOnline = cameraDevice?.last_seen_at
    ? Date.now() - new Date(cameraDevice.last_seen_at).getTime() < 10 * 60 * 1000
    : !cameraError;

  const latestSnapshot = snapshots[0] ?? null;
  const roomLabel = useMemo(() => {
    const number = room?.room_number ? `Room ${room.room_number}` : 'Room —';
    const name = room?.room_name && !String(room.room_name).toLowerCase().includes(String(room?.room_number || '').toLowerCase())
      ? ` • ${room.room_name}`
      : '';
    return number + name;
  }, [room]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadContext();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>Live Camera</Text>
            <Text style={styles.pageSubtitle}>Check on your pet during the current boarding stay.</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={reloadCamera}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.petCard}>
          <Image source={petImage} style={styles.petImage} />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet?.name || 'Your Pet'}</Text>
            <Text style={styles.petMeta}>{roomLabel}</Text>
          </View>
          <View style={[styles.onlineBadge, !deviceOnline && styles.offlineBadge]}>
            <View style={[styles.onlineDot, !deviceOnline && styles.offlineDot]} />
            <Text style={[styles.onlineText, !deviceOnline && styles.offlineText]}>{deviceOnline ? 'Live' : 'Offline'}</Text>
          </View>
        </View>

        {metaError ? (
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={18} color={colors.warning} />
            <Text style={styles.noticeText}>{metaError}</Text>
          </View>
        ) : null}

        <View style={styles.cameraCard}>
          <View style={styles.cameraHeader}>
            <View>
              <Text style={styles.cameraTitle}>{cameraDevice?.device_name || 'CareFur Camera'}</Text>
              <Text style={styles.cameraSubtitle}>{cameraDevice?.device_code || 'Live room stream'}</Text>
            </View>
            <Ionicons name="videocam" size={20} color={colors.primary} />
          </View>

          <View style={styles.cameraContainer}>
            {cameraError ? (
              <View style={styles.cameraError}>
                <View style={styles.cameraErrorIcon}>
                  <Ionicons name="videocam-off-outline" size={34} color={colors.primary} />
                </View>
                <Text style={styles.cameraErrorTitle}>Camera unavailable</Text>
                <Text style={styles.cameraErrorText}>The stream cannot be reached. Check the ESP32-CAM and ngrok tunnel, then try again.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={reloadCamera}>
                  <Ionicons name="refresh" size={16} color="#FFF" />
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : Platform.OS === 'web' ? (
              <View style={styles.webCameraWrapper}>
                {React.createElement('iframe', {
                  key: webReloadKey,
                  src: CAMERA_STREAM_URL,
                  style: { width: '100%', height: '100%', border: 'none', display: 'block', backgroundColor: '#101515' },
                  allow: 'fullscreen',
                  onError: () => {
                    setCameraLoading(false);
                    setCameraError(true);
                  },
                })}
                {cameraLoading ? <CameraLoader /> : null}
              </View>
            ) : (
              <>
                <WebView
                  ref={webViewRef}
                  source={{ uri: CAMERA_STREAM_URL, headers: { 'ngrok-skip-browser-warning': 'true' } }}
                  style={styles.cameraWebView}
                  originWhitelist={['*']}
                  javaScriptEnabled
                  domStorageEnabled
                  mixedContentMode="always"
                  allowsFullscreenVideo
                  onLoadStart={() => {
                    setCameraLoading(true);
                    setCameraError(false);
                  }}
                  onLoadEnd={() => setCameraLoading(false)}
                  onError={() => {
                    setCameraLoading(false);
                    setCameraError(true);
                  }}
                  onHttpError={() => {
                    setCameraLoading(false);
                    setCameraError(true);
                  }}
                />
                {cameraLoading ? <CameraLoader /> : null}
              </>
            )}
          </View>

          <View style={styles.cameraActions}>
            <TouchableOpacity style={styles.captureButton} onPress={captureSnapshot} disabled={capturing}>
              {capturing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={19} color="#FFF" />
              )}
              <Text style={styles.captureButtonText}>Capture Snapshot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={reloadCamera}>
              <Ionicons name="refresh-outline" size={18} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.snapshotHeader}>
          <View>
            <Text style={styles.sectionTitle}>Captured Snapshots</Text>
            <Text style={styles.sectionSubtitle}>Photos captured during this app session.</Text>
          </View>
          <View style={styles.snapshotCountBadge}>
            <Text style={styles.snapshotCount}>{snapshots.length}</Text>
          </View>
        </View>

        {latestSnapshot ? (
          <>
            <View style={styles.latestSnapshotCard}>
              <Image source={{ uri: latestSnapshot.uri }} style={styles.latestSnapshotImage} resizeMode="cover" />
              <View style={styles.snapshotMetaBar}>
                <View>
                  <Text style={styles.snapshotMetaTitle}>Latest capture</Text>
                  <Text style={styles.snapshotMetaText}>{formatSnapshotTime(latestSnapshot.capturedAt)}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              </View>
            </View>

            {snapshots.length > 1 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.snapshotStrip}>
                {snapshots.slice(1).map((snapshot) => (
                  <View key={snapshot.id} style={styles.snapshotThumbCard}>
                    <Image source={{ uri: snapshot.uri }} style={styles.snapshotThumb} resizeMode="cover" />
                    <Text style={styles.snapshotThumbTime}>{formatTimeOnly(snapshot.capturedAt)}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </>
        ) : (
          <View style={styles.emptySnapshots}>
            <View style={styles.emptySnapshotIcon}>
              <Ionicons name="images-outline" size={26} color={colors.primary} />
            </View>
            <Text style={styles.emptySnapshotTitle}>No snapshots yet</Text>
            <Text style={styles.emptySnapshotText}>Use “Capture Snapshot” above to save a still image for this session.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CameraLoader() {
  return (
    <View style={styles.cameraLoader}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.cameraLoadingText}>Connecting to camera...</Text>
    </View>
  );
}

function formatSnapshotTime(date: Date) {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatTimeOnly(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
