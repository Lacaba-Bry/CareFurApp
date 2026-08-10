import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import styles from '../assets/css/CameraScreenStyles';

const CAMERA_URL =
  'https://ground-uselessly-rosy.ngrok-free.dev/stream';

export default function CameraScreen({ navigation }: any) {
  const webViewRef = useRef<WebView>(null);

  const [cameraLoading, setCameraLoading] =
    useState(true);

  const [cameraError, setCameraError] =
    useState(false);

  const [webReloadKey, setWebReloadKey] =
    useState(0);

  // MJPEG streams never technically "finish" loading.
  // Hide the loader after the stream has had time to start.
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    setCameraLoading(true);

    const timer = setTimeout(() => {
      setCameraLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [webReloadKey]);

  const reloadCamera = () => {
    setCameraError(false);
    setCameraLoading(true);

    if (Platform.OS === 'web') {
      setWebReloadKey((current) => current + 1);
    } else {
      webViewRef.current?.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Live Camera
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.info}>
              🐶 Pet:{' '}
              <Text style={styles.bold}>
                Sachi
              </Text>
            </Text>

            <Text style={styles.info}>
              🏠 Room:{' '}
              <Text style={styles.bold}>
                A-10
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* LIVE CAMERA */}
      <View style={styles.cameraContainer}>
        {cameraError ? (
          <View style={styles.cameraError}>
            <Ionicons
              name="videocam-off-outline"
              size={42}
              color="#777"
            />

            <Text style={styles.cameraErrorTitle}>
              Camera unavailable
            </Text>

            <Text style={styles.cameraErrorText}>
              Make sure the ESP32-CAM and ngrok
              tunnel are running.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              activeOpacity={0.8}
              onPress={reloadCamera}
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#FFF"
              />

              <Text style={styles.retryText}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : Platform.OS === 'web' ? (
          <View style={styles.webCameraWrapper}>
            {React.createElement('iframe', {
              key: webReloadKey,

              src: CAMERA_URL,

              style: {
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                backgroundColor: '#111111',
              },

              allow: 'fullscreen',

              onError: () => {
                setCameraLoading(false);
                setCameraError(true);
              },
            })}

            {cameraLoading && (
              <View style={styles.cameraLoader}>
                <ActivityIndicator
                  size="large"
                  color="#14646B"
                />

                <Text style={styles.cameraLoadingText}>
                  Connecting to camera...
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{
                uri: CAMERA_URL,

                headers: {
                  'ngrok-skip-browser-warning': 'true',
                },
              }}
              style={styles.cameraWebView}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mixedContentMode="always"
              allowsFullscreenVideo={true}
              startInLoadingState={false}
              onLoadStart={() => {
                setCameraLoading(true);
                setCameraError(false);
              }}
              onLoadEnd={() => {
                setCameraLoading(false);
              }}
              onError={(event) => {
                console.log(
                  'Camera WebView Error:',
                  event.nativeEvent
                );

                setCameraLoading(false);
                setCameraError(true);
              }}
              onHttpError={(event) => {
                console.log(
                  'Camera HTTP Error:',
                  event.nativeEvent.statusCode
                );

                setCameraLoading(false);
                setCameraError(true);
              }}
            />

            {cameraLoading && (
              <View style={styles.cameraLoader}>
                <ActivityIndicator
                  size="large"
                  color="#14646B"
                />

                <Text style={styles.cameraLoadingText}>
                  Connecting to camera...
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* FULL SCREEN */}
      <TouchableOpacity
        style={styles.fullscreen}
        activeOpacity={0.8}
      >
        <Ionicons
          name="scan-outline"
          size={15}
          color="#FFF"
        />

        <Text style={styles.fullText}>
          Full screen
        </Text>
      </TouchableOpacity>

      {/* CAPTURED SNAPSHOTS */}
      <View style={styles.captureSection}>
        <View style={styles.line} />

        <Text style={styles.captureTitle}>
          Captured Snapshots:
        </Text>

        <View style={styles.line} />

        <Text style={styles.count}>
          5/15
        </Text>
      </View>

      {/* SNAPSHOT */}
      <View style={styles.snapshotRow}>
        <TouchableOpacity>
          <Ionicons
            name="caret-back"
            size={29}
            color="#D06435"
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/Login/CamSamp1.png')}
          style={styles.snapshot}
          resizeMode="cover"
        />

        <TouchableOpacity>
          <Ionicons
            name="caret-forward"
            size={29}
            color="#D06435"
          />
        </TouchableOpacity>
      </View>

      {/* VIEW PHOTOS */}
      <TouchableOpacity
        style={styles.photos}
        activeOpacity={0.8}
      >
        <Text style={styles.photosText}>
          View All Photos →
        </Text>
      </TouchableOpacity>

      {/* DATE + TIME */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#111"
          />

          <Text style={styles.detailText}>
            Date:{' '}
            <Text style={styles.bold}>
              99/99/99
            </Text>
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="time-outline"
            size={19}
            color="#111"
          />

          <Text style={styles.detailText}>
            Time:{' '}
            <Text style={styles.bold}>
              03:00 PM
            </Text>
          </Text>
        </View>
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons
            name="volume-high"
            size={29}
            color="#FFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="videocam"
            size={31}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}