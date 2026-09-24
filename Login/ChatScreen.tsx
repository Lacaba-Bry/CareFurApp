import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';
const ATTACHMENT_PREFIX = '[[CAREFUR_ATTACHMENT]]';
const ATTACHMENT_SUFFIX = '[[/CAREFUR_ATTACHMENT]]';

type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_user_id?: string | null;
  sender_type: 'customer' | 'guest' | 'staff' | 'system';
  sender_name?: string | null;
  message: string;
  read_at?: string | null;
  created_at: string;
};

type PendingAttachment = {
  uri: string;
  name: string;
  mimeType: string;
  kind: 'image' | 'file';
};

type SavedAttachment = {
  url: string;
  name: string;
  mimeType: string;
  kind: 'image' | 'file';
};

export default function ChatScreen({ navigation, route }: any) {
  const routeParams = route?.params ?? {};
  const [bookingId, setBookingId] = useState<string | null>(routeParams.bookingId ?? routeParams.booking?.id ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [petName, setPetName] = useState(routeParams.pet?.name ?? 'Your Pet');
  const [roomNumber, setRoomNumber] = useState(routeParams.room?.room_number ?? '');
  const [accessType, setAccessType] = useState<'guest' | 'account'>('guest');
  const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const resolveBookingId = useCallback(async () => {
    if (bookingId) return bookingId;

    const code = await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
    if (!code) throw new Error('No active boarding access code was found.');

    const { data, error: functionError } = await supabase.functions.invoke('verify-booking-code', { body: { code } });
    if (functionError) throw new Error(await getFunctionErrorMessage(functionError));
    if (data?.error) throw new Error(data.error);
    if (!data?.booking?.id) throw new Error('The boarding booking could not be found.');

    setBookingId(data.booking.id);
    if (data.pet?.name) setPetName(data.pet.name);
    if (data.room?.room_number) setRoomNumber(data.room.room_number);
    return data.booking.id;
  }, [bookingId]);

  const loadChat = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const currentBookingId = await resolveBookingId();
      const accessCode = await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);

      const { data, error: functionError } = await supabase.functions.invoke('get-booking-chat', {
        body: { bookingId: currentBookingId, accessCode: accessCode ?? undefined },
      });

      if (functionError) throw new Error(await getFunctionErrorMessage(functionError));
      if (data?.error) throw new Error(data.error);

      setMessages(data?.messages ?? []);
      setAccessType(data?.accessType === 'account' ? 'account' : 'guest');
      if (data?.pet?.name) setPetName(data.pet.name);
      if (data?.room?.room_number) setRoomNumber(data.room.room_number);
      setError(null);

      setTimeout(() => listRef.current?.scrollToEnd({ animated: !silent }), 100);
    } catch (err: any) {
      console.error('Chat load error:', err);
      setError(normalizeChatError(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [resolveBookingId]);

  useEffect(() => {
    loadChat();
    const timer = setInterval(() => loadChat(true), 8000);
    return () => clearInterval(timer);
  }, [loadChat]);

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showMessage('Photo permission', 'Allow photo access to attach an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setAttachment({
      uri: asset.uri,
      name: asset.fileName || `carefur-photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      kind: 'image',
    });
  };

  const chooseFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
    if (result.canceled || !result.assets?.[0]) return;
    const file = result.assets[0];
    setAttachment({
      uri: file.uri,
      name: file.name || `carefur-file-${Date.now()}`,
      mimeType: file.mimeType || 'application/octet-stream',
      kind: file.mimeType?.startsWith('image/') ? 'image' : 'file',
    });
  };

  const openAttachmentMenu = () => {
    if (Platform.OS === 'web') {
      chooseFile();
      return;
    }

    Alert.alert('Add attachment', 'Choose what you want to send.', [
      { text: 'Photo', onPress: choosePhoto },
      { text: 'File', onPress: chooseFile },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const uploadAttachment = async (currentBookingId: string, item: PendingAttachment): Promise<SavedAttachment> => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) throw new Error('Please sign in to upload an attachment.');

    const response = await fetch(item.uri);
    const bytes = await response.arrayBuffer();
    const safeName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectPath = `${user.id}/${currentBookingId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(objectPath, bytes, { contentType: item.mimeType, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('chat-attachments').getPublicUrl(objectPath);
    if (!data.publicUrl) throw new Error('The attachment URL could not be created.');

    return { url: data.publicUrl, name: item.name, mimeType: item.mimeType, kind: item.kind };
  };

  const sendMessage = async () => {
    const cleanMessage = text.trim();
    if ((!cleanMessage && !attachment) || sending) return;

    try {
      setSending(true);
      const currentBookingId = await resolveBookingId();
      const accessCode = await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
      let messageToSend = cleanMessage;

      if (attachment) {
        const uploaded = await uploadAttachment(currentBookingId, attachment);
        messageToSend = serializeAttachment(uploaded, cleanMessage);
      }

      const { data, error: functionError } = await supabase.functions.invoke('send-booking-message', {
        body: {
          bookingId: currentBookingId,
          accessCode: accessCode ?? undefined,
          message: messageToSend,
        },
      });

      if (functionError) throw new Error(await getFunctionErrorMessage(functionError));
      if (data?.error) throw new Error(data.error);

      setText('');
      setAttachment(null);
      await loadChat(true);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      console.error('Send message error:', err);
      showMessage('Message Error', normalizeChatError(err));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={27} color={colors.primaryDark} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Message Stay</Text>
            <Text style={styles.subtitle}>{petName}{roomNumber ? ` • Room ${roomNumber}` : ''}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={accessType === 'guest' ? styles.guestNotice : styles.accountNotice}>
          <Ionicons name={accessType === 'guest' ? 'time-outline' : 'shield-checkmark-outline'} size={17} color={accessType === 'guest' ? colors.textSecondary : colors.primary} />
          <Text style={accessType === 'guest' ? styles.guestNoticeText : styles.accountNoticeText}>
            {accessType === 'guest'
              ? 'Messaging is available while your boarding access is active.'
              : 'This conversation is linked to your active boarding stay.'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={17} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.errorTitle}>Messages are temporarily unavailable</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity onPress={() => loadChat()}><Ionicons name="refresh" size={19} color={colors.primary} /></TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={32} color={colors.primary} /></View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyText}>Send CareFur staff a message, photo, or document about {petName}&apos;s stay.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const fromStaff = item.sender_type === 'staff';
            const systemMessage = item.sender_type === 'system';
            const previous = index > 0 ? messages[index - 1] : null;
            const showDayBreak = !previous || !isSameMessageDay(previous.created_at, item.created_at);
            const parsed = parseMessage(item.message);

            return (
              <>
                {showDayBreak ? (
                  <View style={styles.daySeparator}>
                    <View style={styles.daySeparatorLine} />
                    <View style={styles.daySeparatorCenter}>
                      {index > 0 ? <Text style={styles.newDayText}>NEW DAY</Text> : null}
                      <Text style={styles.daySeparatorText}>{formatMessageDate(item.created_at)}</Text>
                    </View>
                    <View style={styles.daySeparatorLine} />
                  </View>
                ) : null}

                {systemMessage ? (
                  <View style={styles.systemRow}><Text style={styles.systemText}>{parsed.caption || item.message}</Text></View>
                ) : (
                  <View style={[styles.messageRow, fromStaff ? styles.staffRow : styles.ownerRow]}>
                    <View style={[styles.bubble, fromStaff ? styles.staffBubble : styles.ownerBubble]}>
                      <Text style={[styles.senderName, fromStaff ? styles.staffSender : styles.ownerSender]}>{fromStaff ? item.sender_name || 'CareFur Staff' : 'You'}</Text>
                      {parsed.attachment ? <AttachmentCard attachment={parsed.attachment} fromStaff={fromStaff} /> : null}
                      {parsed.caption ? <Text style={[styles.messageText, !fromStaff && styles.ownerMessageText]}>{parsed.caption}</Text> : null}
                      <Text style={[styles.messageTime, !fromStaff && styles.ownerTime]}>{formatMessageTime(item.created_at)}</Text>
                    </View>
                  </View>
                )}
              </>
            );
          }}
        />

        {attachment ? (
          <View style={styles.pendingAttachment}>
            <View style={styles.pendingIcon}><Ionicons name={attachment.kind === 'image' ? 'image-outline' : 'document-outline'} size={18} color={colors.primary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.pendingName} numberOfLines={1}>{attachment.name}</Text><Text style={styles.pendingType}>{attachment.kind === 'image' ? 'Photo ready to send' : 'File ready to send'}</Text></View>
            <TouchableOpacity style={styles.removeAttachment} onPress={() => setAttachment(null)}><Ionicons name="close" size={18} color={colors.danger} /></TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={openAttachmentMenu} disabled={sending}>
            <Ionicons name="add" size={25} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={attachment ? 'Add a message (optional)' : 'Type a message...'}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[styles.sendButton, ((!text.trim() && !attachment) || sending) && styles.sendButtonDisabled]}
            disabled={(!text.trim() && !attachment) || sending}
            onPress={sendMessage}
          >
            {sending ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="send" size={20} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AttachmentCard({ attachment, fromStaff }: { attachment: SavedAttachment; fromStaff: boolean }) {
  if (attachment.kind === 'image') {
    return (
      <TouchableOpacity style={styles.imageAttachmentWrap} onPress={() => Linking.openURL(attachment.url)} activeOpacity={0.9}>
        <Image source={{ uri: attachment.url }} style={styles.imageAttachment} resizeMode="cover" />
        <View style={styles.attachmentOverlay}><Ionicons name="expand-outline" size={16} color="#FFF" /><Text style={styles.attachmentOverlayText}>Open photo</Text></View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.fileAttachment, !fromStaff && styles.fileAttachmentOwner]} onPress={() => Linking.openURL(attachment.url)}>
      <View style={styles.fileIcon}><Ionicons name="document-text-outline" size={21} color={colors.primary} /></View>
      <View style={{ flex: 1 }}><Text style={[styles.fileName, !fromStaff && { color: '#FFF' }]} numberOfLines={1}>{attachment.name}</Text><Text style={[styles.fileType, !fromStaff && { color: '#D6EEEE' }]}>Tap to open</Text></View>
      <Ionicons name="open-outline" size={17} color={fromStaff ? colors.textMuted : '#FFF'} />
    </TouchableOpacity>
  );
}

function serializeAttachment(attachment: SavedAttachment, caption: string) {
  return `${ATTACHMENT_PREFIX}${JSON.stringify(attachment)}${ATTACHMENT_SUFFIX}${caption ? `\n${caption}` : ''}`;
}

function parseMessage(message: string): { attachment: SavedAttachment | null; caption: string } {
  if (!message.startsWith(ATTACHMENT_PREFIX)) return { attachment: null, caption: message };
  const end = message.indexOf(ATTACHMENT_SUFFIX);
  if (end < 0) return { attachment: null, caption: message };
  try {
    const raw = message.slice(ATTACHMENT_PREFIX.length, end);
    const attachment = JSON.parse(raw) as SavedAttachment;
    const caption = message.slice(end + ATTACHMENT_SUFFIX.length).trim();
    return { attachment, caption };
  } catch {
    return { attachment: null, caption: message };
  }
}

async function getFunctionErrorMessage(error: any) {
  let message = error?.message || 'Request failed.';
  try {
    const response = error?.context;
    if (response && typeof response.json === 'function') {
      const body = await response.json();
      if (body?.error) message = body.error;
    }
  } catch {}
  return message;
}

function normalizeChatError(error: any) {
  const raw = String(error?.message || error || 'Unable to load messages.');
  if (raw.includes('row-level security') || raw.includes('42501') || raw.includes('403')) {
    return 'The messaging backend is blocking this request. Deploy the included CareFur chat Edge Functions and storage policy.';
  }
  if (raw.includes('500') || raw.toLowerCase().includes('conversation')) {
    return 'The CareFur chat service could not open this stay conversation. Deploy the included chat backend update.';
  }
  return raw;
}

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}
function isSameMessageDay(a: string, b: string) {
  const da = new Date(a); const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}
function formatMessageDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  if (isSameMessageDay(value, today.toISOString())) return 'Today';
  if (isSameMessageDay(value, yesterday.toISOString())) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: colors.primaryDark, fontSize: 13 },
  header: { height: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.background },
  backButton: { width: 42, alignItems: 'flex-start', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 42 },
  title: { color: colors.text, fontSize: 20, fontWeight: '900' },
  subtitle: { marginTop: 3, color: colors.textSecondary, fontSize: 11 },
  guestNotice: { marginHorizontal: 15, marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#F2F5F3' },
  guestNoticeText: { flex: 1, color: colors.textSecondary, fontSize: 10, lineHeight: 15 },
  accountNotice: { marginHorizontal: 15, marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.primarySoft },
  accountNoticeText: { flex: 1, color: colors.primary, fontSize: 10, lineHeight: 15 },
  errorBox: { marginHorizontal: 15, marginTop: 10, padding: 11, borderRadius: 12, backgroundColor: colors.accentSoft, flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorTitle: { color: colors.text, fontSize: 10.5, fontWeight: '800' },
  errorText: { color: colors.accent, fontSize: 9.5, lineHeight: 14, marginTop: 2 },
  daySeparator: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, paddingHorizontal: 8 },
  daySeparatorLine: { flex: 1, height: 1, backgroundColor: colors.border },
  daySeparatorCenter: { alignItems: 'center', paddingHorizontal: 10 },
  newDayText: { fontSize: 7.5, fontWeight: '900', letterSpacing: 1.2, color: colors.primary },
  daySeparatorText: { marginTop: 1, fontSize: 9.5, fontWeight: '700', color: colors.textMuted },
  messageList: { flexGrow: 1, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 20 },
  emptyContainer: { flex: 1, minHeight: 360, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35 },
  emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 12, color: colors.text, fontSize: 17, fontWeight: '800' },
  emptyText: { marginTop: 5, maxWidth: 280, color: colors.textSecondary, fontSize: 11.5, textAlign: 'center', lineHeight: 18 },
  messageRow: { width: '100%', marginBottom: 8 },
  staffRow: { alignItems: 'flex-start' }, ownerRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 },
  staffBubble: { backgroundColor: '#EEF4F3', borderTopLeftRadius: 6 },
  ownerBubble: { backgroundColor: colors.primary, borderTopRightRadius: 6 },
  senderName: { fontSize: 9, fontWeight: '800', marginBottom: 4 },
  staffSender: { color: colors.primary }, ownerSender: { color: '#D8F1F0' },
  messageText: { fontSize: 12, lineHeight: 18, color: colors.text }, ownerMessageText: { color: '#FFF' },
  messageTime: { marginTop: 5, fontSize: 8.5, color: colors.textMuted, alignSelf: 'flex-end' }, ownerTime: { color: '#CDE4E3' },
  systemRow: { alignItems: 'center', marginVertical: 8 }, systemText: { fontSize: 9.5, color: colors.textMuted, backgroundColor: '#F0F3F2', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  imageAttachmentWrap: { width: 210, height: 145, borderRadius: 13, overflow: 'hidden', marginBottom: 7, backgroundColor: '#D9E5E4' },
  imageAttachment: { width: '100%', height: '100%' },
  attachmentOverlay: { position: 'absolute', bottom: 7, right: 7, flexDirection: 'row', alignItems: 'center', borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4 },
  attachmentOverlayText: { color: '#FFF', fontSize: 8.5, marginLeft: 4, fontWeight: '700' },
  fileAttachment: { minWidth: 210, flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: '#FFF', padding: 9, borderWidth: 1, borderColor: colors.border, marginBottom: 7 },
  fileAttachmentOwner: { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)' },
  fileIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileName: { color: colors.text, fontSize: 10.5, fontWeight: '800' }, fileType: { marginTop: 2, color: colors.textMuted, fontSize: 8.5 },
  pendingAttachment: { marginHorizontal: 14, marginBottom: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 9, flexDirection: 'row', alignItems: 'center' },
  pendingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  pendingName: { color: colors.text, fontSize: 10.5, fontWeight: '800' }, pendingType: { marginTop: 2, fontSize: 8.5, color: colors.textMuted },
  removeAttachment: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  inputContainer: { minHeight: 70, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  attachButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, maxHeight: 100, minHeight: 42, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FBFCFB', paddingHorizontal: 14, paddingTop: 11, paddingBottom: 10, fontSize: 12, color: colors.text },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendButtonDisabled: { opacity: 0.4 },
});
