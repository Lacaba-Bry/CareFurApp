import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Image, Platform, RefreshControl, SafeAreaView,
  ScrollView, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { getBookingMonitoring } from '../lib/bookingMonitoring';
import { colors } from '../lib/theme';
import styles from '../assets/css/CameraScreenStyles';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';
// Only the public WSS viewer URL belongs here. NEVER put an admin token,
// CAMERA_UPLOAD_KEY or Supabase service-role key in this app.
// Confirm that camera.apicarefur.me routes /ws/viewer to your VPS gateway.
const CAMERA_VIEWER_WS_URL = 'wss://camera.apicarefur.me/ws/viewer';
const WEBVIEW_BASE_URL = 'https://carefur.me'; // Allowed Origin in gateway CAREFUR_ORIGINS.

type Snapshot = { id: string; uri: string; capturedAt: Date };
type ViewerState = 'idle' | 'connecting' | 'waiting' | 'live' | 'error';

function htmlForViewer(url: string, jwt: string, bookingId: string): string {
  // JSON.stringify safely encodes values for JS string literals.
  // Escape '<' to prevent HTML/script injection in embedded source.
  const js = (value: string) => JSON.stringify(value).replace(/</g, '\\u003c');
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>*{box-sizing:border-box}html,body{padding:0;margin:0;width:100%;height:100%;background:#102529;color:white;overflow:hidden;font-family:sans-serif}#frame{width:100%;height:100%;object-fit:contain;display:none}#status{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;color:#d6e4e4;font-size:14px}</style>
  </head><body><img id="frame" alt="Live camera"/><div id="status">Connecting to secure camera…</div>
  <script>
  (function(){
    var url=${js(url)}, token=${js(jwt)}, bookingId=${js(bookingId)};
    var socket, currentObjectUrl=null, lastBlob=null, closed=false, frames=0;
    var img=document.getElementById('frame'), status=document.getElementById('status');
    function send(type, message, uri){try{window.ReactNativeWebView.postMessage(JSON.stringify({type:type,message:message||'',uri:uri||''}));}catch(e){}}
    function label(text){status.style.display='flex';status.textContent=text;}
    window.captureCurrentFrame=function(){
      if(!lastBlob){send('error','No camera image available to capture yet.');return;}
      var reader=new FileReader();
      reader.onload=function(){send('snapshot','',String(reader.result));};
      reader.onerror=function(){send('error','Could not capture camera image.');};
      reader.readAsDataURL(lastBlob);
    };
    try{
      socket=new WebSocket(url);socket.binaryType='blob';
      socket.onopen=function(){socket.send(JSON.stringify({type:'auth',token:token,booking_id:bookingId}));send('connecting');};
      socket.onmessage=function(event){
        if(typeof event.data==='string'){
          try{var data=JSON.parse(event.data);if(data.type==='ready'){
            if(!data.camera_online){label('Waiting for camera frames…');send('waiting');}
          }}catch(e){} return;
        }
        if(!(event.data instanceof Blob))return;
        lastBlob=event.data;
        var newUrl=URL.createObjectURL(lastBlob);
        img.onload=function(){if(currentObjectUrl)URL.revokeObjectURL(currentObjectUrl);currentObjectUrl=newUrl;};
        img.onerror=function(){URL.revokeObjectURL(newUrl);};
        img.src=newUrl;img.style.display='block';status.style.display='none';
        if(frames++===0)send('live');
      };
      socket.onerror=function(){label('Camera connection failed.');send('error','Could not connect to the secure camera viewer.');};
      socket.onclose=function(event){if(closed)return;label('Camera connection closed.');send('error',event.code===1008?'Camera access denied or expired.':'Camera disconnected. Tap Refresh to reconnect.');};
    }catch(e){label('Camera connection failed.');send('error',String(e));}
    window.addEventListener('pagehide',function(){closed=true;if(socket)socket.close();if(currentObjectUrl)URL.revokeObjectURL(currentObjectUrl);});
  })();
  </script></body></html>`;
}

export default function CameraScreen({ route }: any) {
  const params = route?.params ?? {};
  const webViewRef = useRef<WebView>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const readerRef = useRef<any>(null);
  const [pet, setPet] = useState<any>(params.pet ?? null);
  const [room, setRoom] = useState<any>(params.room ?? null);
  const [cameraDevice, setCameraDevice] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [cameraExpiresAt, setCameraExpiresAt] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [viewerState, setViewerState] = useState<ViewerState>('idle');
  const [viewerError, setViewerError] = useState('');
  const [webFrame, setWebFrame] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const stopViewer = useCallback(() => {
    webSocketRef.current?.close();
    webSocketRef.current = null;
    if (readerRef.current?.readyState === 1) {
      try { readerRef.current.abort(); } catch (_) { /* already stopped */ }
    }
    readerRef.current = null;
    setWebFrame(null);
    setViewerState('idle');
  }, []);

  const loadContext = useCallback(async () => {
    try {
      setMetaError(null);
      const code = params.accessCode || await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
      if (!code) { setCameraAllowed(false); stopViewer(); return; }
      const { data, error } = await supabase.functions.invoke('verify-booking-code', { body: { code } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const booking = data?.booking;
      const expires = booking?.expected_check_out_at ? Date.parse(booking.expected_check_out_at) : NaN;
      const begins = booking?.check_in_at ? Date.parse(booking.check_in_at) : NaN;
      const validStay = booking?.status === 'checked_in' && !booking?.actual_check_out_at &&
        Number.isFinite(expires) && Number.isFinite(begins) && Date.now() >= begins && Date.now() < expires;
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const signedInEmail = String(authData.user?.email ?? '').trim().toLowerCase();
      const assignedEmail = String(data?.access?.invitedEmail ?? data?.access?.invited_email ?? '').trim().toLowerCase();
      const authorized = Boolean(validStay && !authError && signedInEmail && assignedEmail === signedInEmail && booking?.id);
      setCameraExpiresAt(Number.isFinite(expires) ? expires : null);
      if (!authorized) {
        setCameraAllowed(false); setAccessToken(''); setBookingId('');
        setSnapshots([]); setCameraDevice(null); stopViewer(); return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Please log in again to access the camera.');
      if (data.pet) setPet(data.pet);
      if (data.room) setRoom(data.room);
      const monitor = await getBookingMonitoring(code);
      setCameraDevice(monitor.camera ?? null);
      setBookingId(String(booking.id));
      setAccessToken(token);
      setCameraAllowed(true);
    } catch (err: any) {
      console.warn('Camera context warning:', err);
      setCameraAllowed(false); setAccessToken(''); setBookingId('');
      stopViewer(); setMetaError(err?.message || 'Camera details could not be refreshed.');
    } finally { setRefreshing(false); }
  }, [params.accessCode, stopViewer]);

  useFocusEffect(useCallback(() => {
    loadContext();
    const timer = setInterval(loadContext, 30000);
    return () => { clearInterval(timer); stopViewer(); };
  }, [loadContext, stopViewer]));

  useEffect(() => {
    if (!cameraAllowed || !bookingId || !accessToken) return;
    if (cameraExpiresAt && Date.now() >= cameraExpiresAt) { setCameraAllowed(false); stopViewer(); return; }
    if (Platform.OS !== 'web') { setViewerState('connecting'); return; }
    let socket: WebSocket;
    let closed = false;
    let busy = false;
    setViewerError(''); setViewerState('connecting'); setWebFrame(null);
    try {
      socket = new WebSocket(CAMERA_VIEWER_WS_URL);
      webSocketRef.current = socket;
      socket.binaryType = 'blob';
      socket.onopen = () => socket.send(JSON.stringify({ type: 'auth', token: accessToken, booking_id: bookingId }));
      socket.onmessage = (event: any) => {
        if (typeof event.data === 'string') {
          try { const message = JSON.parse(event.data); if (message.type === 'ready' && !message.camera_online) setViewerState('waiting'); } catch (_) { /* ignore */ }
          return;
        }
        if (busy || !event.data) return;
        busy = true;
        const reader = new FileReader(); readerRef.current = reader;
        reader.onload = () => { if (!closed) { setWebFrame(String(reader.result)); setViewerState('live'); } busy = false; };
        reader.onerror = () => { busy = false; };
        reader.readAsDataURL(event.data);
      };
      socket.onerror = () => { if (!closed) { setViewerState('error'); setViewerError('Could not connect to the secure camera viewer.'); } };
      socket.onclose = (event: any) => { if (!closed) { setViewerState('error'); setViewerError(event.code === 1008 ? 'Camera access denied or expired.' : 'Camera disconnected. Tap Refresh to reconnect.'); } };
    } catch (err: any) { setViewerState('error'); setViewerError(err?.message || 'Could not connect to camera.'); return; }
    return () => { closed = true; socket.close(); if (webSocketRef.current === socket) webSocketRef.current = null; };
  }, [cameraAllowed, bookingId, accessToken, cameraExpiresAt, reloadKey, stopViewer]);

  const reloadCamera = () => {
    if (!cameraAllowed) { loadContext(); return; }
    setViewerError(''); setViewerState('connecting'); setReloadKey(x => x + 1);
  };
  const saveSnapshot = (uri: string) => {
    if (!uri.startsWith('data:image/')) return;
    setSnapshots(current => [{ id: `${Date.now()}`, uri, capturedAt: new Date() }, ...current].slice(0, 12));
  };
  const captureSnapshot = () => {
    if (!cameraAllowed || viewerState !== 'live' || (cameraExpiresAt && Date.now() >= cameraExpiresAt)) return;
    if (Platform.OS === 'web') { if (webFrame) saveSnapshot(webFrame); return; }
    webViewRef.current?.injectJavaScript('window.captureCurrentFrame && window.captureCurrentFrame(); true;');
  };
  const onWebViewMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'live') { setViewerState('live'); setViewerError(''); }
      if (msg.type === 'waiting') setViewerState('waiting');
      if (msg.type === 'connecting') setViewerState('connecting');
      if (msg.type === 'error') { setViewerError(msg.message || 'Camera unavailable'); setViewerState('error'); }
      if (msg.type === 'snapshot') saveSnapshot(msg.uri);
    } catch (_) { /* ignore malformed WebView events */ }
  };

  const petImage = pet?.photo_url ? { uri: pet.photo_url } : require('../assets/Login/DogProfile.jpg');
  const latestSnapshot = snapshots[0] ?? null;
  const roomLabel = useMemo(() => {
    const number = room?.room_number ? `Room ${room.room_number}` : 'Room —';
    const name = room?.room_name && !String(room.room_name).toLowerCase().includes(String(room.room_number || '').toLowerCase()) ? ` • ${room.room_name}` : '';
    return number + name;
  }, [room]);
  const isLive = cameraAllowed && viewerState === 'live';
  const html = useMemo(() => htmlForViewer(CAMERA_VIEWER_WS_URL, accessToken, bookingId), [accessToken, bookingId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadContext(); }} tintColor={colors.primary} />}>
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
          <View style={[styles.onlineBadge, !isLive && styles.offlineBadge]}>
            <View style={[styles.onlineDot, !isLive && styles.offlineDot]} />
            <Text style={[styles.onlineText, !isLive && styles.offlineText]}>{isLive ? 'Live' : 'Offline'}</Text>
          </View>
        </View>
        {metaError ? <View style={styles.notice}><Ionicons name="information-circle-outline" size={18} color={colors.warning} /><Text style={styles.noticeText}>{metaError}</Text></View> : null}
        <View style={styles.cameraCard}>
          <View style={styles.cameraHeader}>
            <View>
              <Text style={styles.cameraTitle}>{cameraDevice?.device_name || 'CareFur Camera'}</Text>
              <Text style={styles.cameraSubtitle}>{cameraDevice?.device_code || 'Live room stream'}</Text>
            </View>
            <Ionicons name="videocam" size={20} color={colors.primary} />
          </View>
          <View style={styles.cameraContainer}>
            {!cameraAllowed ? (
              <View style={styles.cameraError}>
                <Ionicons name="lock-closed-outline" size={34} color={colors.primary} />
                <Text style={styles.cameraErrorTitle}>Camera access unavailable</Text>
                <Text style={styles.cameraErrorText}>Live viewing is available only during an active stay with permission for this booking.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadContext}><Text style={styles.retryText}>Check access again</Text></TouchableOpacity>
              </View>
            ) : viewerState === 'error' ? (
              <View style={styles.cameraError}>
                <Ionicons name="videocam-off-outline" size={34} color={colors.primary} />
                <Text style={styles.cameraErrorTitle}>Camera unavailable</Text>
                <Text style={styles.cameraErrorText}>{viewerError || 'Unable to open the authorized camera stream.'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={reloadCamera}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
              </View>
            ) : Platform.OS === 'web' ? (
              <View style={styles.webCameraWrapper}>
                {webFrame ? <Image source={{ uri: webFrame }} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <View style={styles.cameraLoader}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.cameraLoadingText}>{viewerState === 'waiting' ? 'Waiting for camera frames…' : 'Connecting securely…'}</Text></View>}
              </View>
            ) : (
              <WebView key={`${bookingId}-${reloadKey}`} ref={webViewRef}
                source={{ html, baseUrl: WEBVIEW_BASE_URL }}
                style={styles.cameraWebView} originWhitelist={['https://*']}
                javaScriptEnabled domStorageEnabled mixedContentMode="never"
                onMessage={onWebViewMessage}
                onError={() => { setViewerState('error'); setViewerError('Unable to load the camera viewer.'); }} />
            )}
          </View>
          <View style={styles.cameraActions}>
            <TouchableOpacity style={styles.captureButton} onPress={captureSnapshot} disabled={!isLive}>
              <Ionicons name="camera" size={19} color="#FFF" />
              <Text style={styles.captureButtonText}>Capture Snapshot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={reloadCamera}>
              <Ionicons name="refresh-outline" size={18} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.snapshotHeader}>
          <View><Text style={styles.sectionTitle}>Captured Snapshots</Text><Text style={styles.sectionSubtitle}>Photos captured during this app session.</Text></View>
          <View style={styles.snapshotCountBadge}><Text style={styles.snapshotCount}>{snapshots.length}</Text></View>
        </View>
        {latestSnapshot ? <>
          <View style={styles.latestSnapshotCard}>
            <Image source={{ uri: latestSnapshot.uri }} style={styles.latestSnapshotImage} resizeMode="cover" />
            <View style={styles.snapshotMetaBar}>
              <View><Text style={styles.snapshotMetaTitle}>Latest capture</Text><Text style={styles.snapshotMetaText}>{formatSnapshotTime(latestSnapshot.capturedAt)}</Text></View>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            </View>
          </View>
          {snapshots.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.snapshotStrip}>
            {snapshots.slice(1).map(s => <View key={s.id} style={styles.snapshotThumbCard}><Image source={{ uri: s.uri }} style={styles.snapshotThumb} resizeMode="cover" /><Text style={styles.snapshotThumbTime}>{formatTimeOnly(s.capturedAt)}</Text></View>)}
          </ScrollView> : null}
        </> : <View style={styles.emptySnapshots}>
          <View style={styles.emptySnapshotIcon}><Ionicons name="images-outline" size={26} color={colors.primary} /></View>
          <Text style={styles.emptySnapshotTitle}>No snapshots yet</Text>
          <Text style={styles.emptySnapshotText}>Use “Capture Snapshot” above to save a still image for this session.</Text>
        </View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatSnapshotTime(date: Date) {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}
function formatTimeOnly(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
