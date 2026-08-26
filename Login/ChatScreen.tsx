import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
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

import { supabase } from '../lib/supabase';

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

type ChatMessage = {
  id: string;

  conversation_id: string;

  sender_user_id?:
    | string
    | null;

  sender_type:
    | 'customer'
    | 'guest'
    | 'staff'
    | 'system';

  sender_name?:
    | string
    | null;

  message: string;

  read_at?:
    | string
    | null;

  created_at: string;
};

export default function ChatScreen({
  navigation,
  route,
}: any) {
  const routeParams =
    route?.params ?? {};

  const [
    bookingId,
    setBookingId,
  ] = useState<string | null>(
    routeParams.bookingId ??
      routeParams.booking?.id ??
      null
  );

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>(
    []
  );

  const [
    text,
    setText,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    petName,
    setPetName,
  ] = useState(
    routeParams.pet?.name ??
      'Your Pet'
  );

  const [
    roomNumber,
    setRoomNumber,
  ] = useState(
    routeParams.room
      ?.room_number ??
      ''
  );

  const [
    accessType,
    setAccessType,
  ] = useState<
    'guest' | 'account'
  >('guest');

  const listRef =
    useRef<
      FlatList<ChatMessage>
    >(null);

  // ============================================================
  // GET BOOKING ID IF ROUTE DOES NOT HAVE IT
  // ============================================================

  const resolveBookingId =
    useCallback(
      async () => {
        if (bookingId) {
          return bookingId;
        }

        const code =
          await AsyncStorage.getItem(
            BOARDING_CODE_STORAGE_KEY
          );

        if (!code) {
          throw new Error(
            'No active boarding access code was found.'
          );
        }

        const {
          data,
          error:
            functionError,
        } =
          await supabase.functions.invoke(
            'verify-booking-code',
            {
              body: {
                code,
              },
            }
          );

        if (
          functionError
        ) {
          throw new Error(
            await getFunctionErrorMessage(
              functionError
            )
          );
        }

        if (
          data?.error
        ) {
          throw new Error(
            data.error
          );
        }

        if (
          !data?.booking?.id
        ) {
          throw new Error(
            'The boarding booking could not be found.'
          );
        }

        setBookingId(
          data.booking.id
        );

        if (
          data.pet?.name
        ) {
          setPetName(
            data.pet.name
          );
        }

        if (
          data.room
            ?.room_number
        ) {
          setRoomNumber(
            data.room
              .room_number
          );
        }

        return data.booking.id;
      },
      [bookingId]
    );

  // ============================================================
  // LOAD CHAT
  // ============================================================

  const loadChat =
    useCallback(
      async (
        silent = false
      ) => {
        try {
          if (!silent) {
            setLoading(true);
          }

          const currentBookingId =
            await resolveBookingId();

          const accessCode =
            await AsyncStorage.getItem(
              BOARDING_CODE_STORAGE_KEY
            );

          const {
            data,
            error:
              functionError,
          } =
            await supabase.functions.invoke(
              'get-booking-chat',
              {
                body: {
                  bookingId:
                    currentBookingId,

                  accessCode:
                    accessCode ??
                    undefined,
                },
              }
            );

          if (
            functionError
          ) {
            throw new Error(
              await getFunctionErrorMessage(
                functionError
              )
            );
          }

          if (
            data?.error
          ) {
            throw new Error(
              data.error
            );
          }

          setMessages(
            data?.messages ??
              []
          );

          setAccessType(
            data?.accessType ===
              'account'
              ? 'account'
              : 'guest'
          );

          if (
            data?.pet?.name
          ) {
            setPetName(
              data.pet.name
            );
          }

          if (
            data?.room
              ?.room_number
          ) {
            setRoomNumber(
              data.room
                .room_number
            );
          }

          setError(null);

          setTimeout(
            () => {
              listRef.current
                ?.scrollToEnd({
                  animated:
                    !silent,
                });
            },
            100
          );
        } catch (
          err: any
        ) {
          console.error(
            'Chat load error:',
            err
          );

          setError(
            err?.message ||
              'Unable to load messages.'
          );
        } finally {
          if (!silent) {
            setLoading(
              false
            );
          }
        }
      },
      [
        resolveBookingId,
      ]
    );

  // ============================================================
  // INITIAL LOAD + REFRESH CHAT
  // ============================================================

  useEffect(() => {
    loadChat();

    /*
      Guest users cannot safely subscribe directly
      to messages because they use boarding-code
      authorization through the Edge Function.

      Refresh every 3 seconds instead.
    */

    const timer =
      setInterval(
        () => {
          loadChat(true);
        },
        3000
      );

    return () => {
      clearInterval(
        timer
      );
    };
  }, [
    loadChat,
  ]);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage =
    async () => {
      const cleanMessage =
        text.trim();

      if (
        !cleanMessage ||
        sending
      ) {
        return;
      }

      try {
        setSending(true);

        const currentBookingId =
          await resolveBookingId();

        const accessCode =
          await AsyncStorage.getItem(
            BOARDING_CODE_STORAGE_KEY
          );

        const {
          data,
          error:
            functionError,
        } =
          await supabase.functions.invoke(
            'send-booking-message',
            {
              body: {
                bookingId:
                  currentBookingId,

                accessCode:
                  accessCode ??
                  undefined,

                message:
                  cleanMessage,
              },
            }
          );

        if (
          functionError
        ) {
          throw new Error(
            await getFunctionErrorMessage(
              functionError
            )
          );
        }

        if (
          data?.error
        ) {
          throw new Error(
            data.error
          );
        }

        setText('');

        await loadChat(
          true
        );

        setTimeout(
          () => {
            listRef.current
              ?.scrollToEnd({
                animated: true,
              });
          },
          100
        );
      } catch (
        err: any
      ) {
        console.error(
          'Send message error:',
          err
        );

        showMessage(
          'Message Error',
          err?.message ||
            'Unable to send message.'
        );
      } finally {
        setSending(false);
      }
    };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#16444A"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading messages...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* HEADER */}

        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            activeOpacity={
              0.7
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color="#16444A"
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.title
              }
            >
              Message Stay
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              {petName}

              {roomNumber
                ? ` • Room ${roomNumber}`
                : ''}
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* GUEST INFORMATION */}

        {accessType ===
        'guest' ? (
          <View
            style={
              styles.guestNotice
            }
          >
            <Ionicons
              name="time-outline"
              size={17}
              color="#687879"
            />

            <Text
              style={
                styles.guestNoticeText
              }
            >
              Guest messaging is available while your boarding access code is active.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.accountNotice
            }
          >
            <Ionicons
              name="person-circle-outline"
              size={17}
              color="#14646B"
            />

            <Text
              style={
                styles.accountNoticeText
              }
            >
              Messages are connected to your owner account.
            </Text>
          </View>
        )}

        {/* ERROR */}

        {error ? (
          <View
            style={
              styles.errorBox
            }
          >
            <Text
              style={
                styles.errorText
              }
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* CHAT */}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(
            item
          ) => item.id}
          contentContainerStyle={
            styles.messageList
          }
          showsVerticalScrollIndicator={
            false
          }
          onContentSizeChange={() =>
            listRef.current
              ?.scrollToEnd({
                animated:
                  false,
              })
          }
          ListEmptyComponent={
            <View
              style={
                styles.emptyContainer
              }
            >
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color="#A1ACAD"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No messages yet
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Send a message to CareFur staff about {petName}&apos;s stay.
              </Text>
            </View>
          }
          renderItem={({
            item,
          }) => {
            const fromStaff =
              item.sender_type ===
              'staff';

            const systemMessage =
              item.sender_type ===
              'system';

            if (
              systemMessage
            ) {
              return (
                <View
                  style={
                    styles.systemRow
                  }
                >
                  <Text
                    style={
                      styles.systemText
                    }
                  >
                    {item.message}
                  </Text>
                </View>
              );
            }

            return (
              <View
                style={[
                  styles.messageRow,

                  fromStaff
                    ? styles.staffRow
                    : styles.ownerRow,
                ]}
              >
                <View
                  style={[
                    styles.bubble,

                    fromStaff
                      ? styles.staffBubble
                      : styles.ownerBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.senderName,

                      fromStaff
                        ? styles.staffSender
                        : styles.ownerSender,
                    ]}
                  >
                    {fromStaff
                      ? item.sender_name ||
                        'CareFur Staff'
                      : 'You'}
                  </Text>

                  <Text
                    style={[
                      styles.messageText,

                      !fromStaff &&
                        styles.ownerMessageText,
                    ]}
                  >
                    {item.message}
                  </Text>

                  <Text
                    style={[
                      styles.messageTime,

                      !fromStaff &&
                        styles.ownerTime,
                    ]}
                  >
                    {formatMessageTime(
                      item.created_at
                    )}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* MESSAGE INPUT */}

        <View
          style={
            styles.inputContainer
          }
        >
          <TextInput
            style={
              styles.input
            }
            value={text}
            onChangeText={
              setText
            }
            placeholder="Type a message..."
            placeholderTextColor="#8D9899"
            multiline
            maxLength={2000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,

              (!text.trim() ||
                sending) &&
                styles.sendButtonDisabled,
            ]}
            activeOpacity={
              0.8
            }
            disabled={
              !text.trim() ||
              sending
            }
            onPress={
              sendMessage
            }
          >
            {sending ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Ionicons
                name="send"
                size={21}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// FUNCTION ERROR
// ============================================================

async function getFunctionErrorMessage(
  error: any
) {
  let message =
    error?.message ||
    'Request failed.';

  try {
    const response =
      error?.context;

    if (
      response &&
      typeof response.json ===
        'function'
    ) {
      const body =
        await response.json();

      if (
        body?.error
      ) {
        message =
          body.error;
      }
    }
  } catch {
    // Keep normal error
  }

  return message;
}

// ============================================================
// ALERT
// ============================================================

function showMessage(
  title: string,
  message: string
) {
  if (
    Platform.OS ===
    'web'
  ) {
    window.alert(
      `${title}\n\n${message}`
    );

    return;
  }

  Alert.alert(
    title,
    message
  );
}

// ============================================================
// FORMAT TIME
// ============================================================

function formatMessageTime(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '';
  }

  return date.toLocaleTimeString(
    [],
    {
      hour:
        '2-digit',

      minute:
        '2-digit',

      hour12:
        true,
    }
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        '#FFFDF8',
    },

    loadingContainer: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    loadingText: {
      marginTop:
        10,

      color:
        '#16444A',

      fontSize:
        13,
    },

    header: {
      height:
        72,

      paddingHorizontal:
        16,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderBottomWidth:
        1,

      borderBottomColor:
        '#E5EAE9',
    },

    backButton: {
      width:
        42,

      alignItems:
        'flex-start',

      justifyContent:
        'center',
    },

    headerCenter: {
      flex: 1,

      alignItems:
        'center',
    },

    headerSpacer: {
      width:
        42,
    },

    title: {
      color:
        '#16444A',

      fontSize:
        20,

      fontWeight:
        '700',
    },

    subtitle: {
      marginTop:
        3,

      color:
        '#687879',

      fontSize:
        11,
    },

    guestNotice: {
      marginHorizontal:
        15,

      marginTop:
        10,

      paddingHorizontal:
        12,

      paddingVertical:
        10,

      borderRadius:
        10,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap:
        7,

      backgroundColor:
        '#F2F5F3',
    },

    guestNoticeText: {
      flex: 1,

      color:
        '#687879',

      fontSize:
        10,

      lineHeight:
        15,
    },

    accountNotice: {
      marginHorizontal:
        15,

      marginTop:
        10,

      paddingHorizontal:
        12,

      paddingVertical:
        10,

      borderRadius:
        10,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap:
        7,

      backgroundColor:
        '#E8F5F5',
    },

    accountNoticeText: {
      flex: 1,

      color:
        '#14646B',

      fontSize:
        10,

      lineHeight:
        15,
    },

    errorBox: {
      marginHorizontal:
        15,

      marginTop:
        10,

      padding:
        10,

      borderRadius:
        9,

      backgroundColor:
        '#FFF0EB',
    },

    errorText: {
      color:
        '#D06435',

      fontSize:
        11,
    },

    messageList: {
      flexGrow: 1,

      paddingHorizontal:
        15,

      paddingTop:
        15,

      paddingBottom:
        20,
    },

    emptyContainer: {
      flex: 1,

      minHeight:
        380,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        35,
    },

    emptyTitle: {
      marginTop:
        12,

      color:
        '#16444A',

      fontSize:
        17,

      fontWeight:
        '700',
    },

    emptyText: {
      marginTop:
        5,

      maxWidth:
        280,

      color:
        '#7B8889',

      fontSize:
        12,

      textAlign:
        'center',

      lineHeight:
        18,
    },

    messageRow: {
      width:
        '100%',

      marginVertical:
        5,
    },

    staffRow: {
      alignItems:
        'flex-start',
    },

    ownerRow: {
      alignItems:
        'flex-end',
    },

    bubble: {
      maxWidth:
        '80%',

      paddingHorizontal:
        14,

      paddingVertical:
        10,

      borderRadius:
        16,
    },

    staffBubble: {
      backgroundColor:
        '#DFF0F0',

      borderBottomLeftRadius:
        4,
    },

    ownerBubble: {
      backgroundColor:
        '#16444A',

      borderBottomRightRadius:
        4,
    },

    senderName: {
      marginBottom:
        4,

      fontSize:
        10,

      fontWeight:
        '700',
    },

    staffSender: {
      color:
        '#D06435',
    },

    ownerSender: {
      color:
        '#F5B69D',
    },

    messageText: {
      color:
        '#253738',

      fontSize:
        14,

      lineHeight:
        19,
    },

    ownerMessageText: {
      color:
        '#FFFFFF',
    },

    messageTime: {
      marginTop:
        5,

      alignSelf:
        'flex-end',

      color:
        '#849091',

      fontSize:
        9,
    },

    ownerTime: {
      color:
        '#C7DBDC',
    },

    systemRow: {
      alignItems:
        'center',

      marginVertical:
        10,
    },

    systemText: {
      paddingHorizontal:
        12,

      paddingVertical:
        5,

      borderRadius:
        12,

      backgroundColor:
        '#F2F4F2',

      color:
        '#899394',

      fontSize:
        9,
    },

    inputContainer: {
      paddingHorizontal:
        12,

      paddingVertical:
        10,

      flexDirection:
        'row',

      alignItems:
        'flex-end',

      borderTopWidth:
        1,

      borderTopColor:
        '#E5EAE9',

      backgroundColor:
        '#FFFFFF',
    },

    input: {
      flex: 1,

      minHeight:
        46,

      maxHeight:
        110,

      paddingHorizontal:
        16,

      paddingVertical:
        12,

      borderRadius:
        23,

      borderWidth:
        1,

      borderColor:
        '#C9D8D8',

      color:
        '#222',

      fontSize:
        14,
    },

    sendButton: {
      width:
        46,

      height:
        46,

      marginLeft:
        8,

      borderRadius:
        23,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#16444A',
    },

    sendButtonDisabled: {
      opacity:
        0.4,
    },
  });