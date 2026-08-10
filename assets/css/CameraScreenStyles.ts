import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallPhone = width < 360;
const isLargePhone = width > 430;

const cameraHeight = Math.min(
  Math.max(height * 0.27, 180),
  240
);

const snapshotHeight = Math.min(
  Math.max(height * 0.25, 180),
  255
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  header: {
    height: isSmallPhone ? 75 : 85,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  backButton: {
    width: 35,
    height: 45,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginRight: 35,
  },

  title: {
    fontSize: isSmallPhone
      ? 23
      : isLargePhone
      ? 28
      : 26,

    fontStyle: 'italic',
    fontWeight: '700',
    color: '#111',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },

  info: {
    fontSize: isSmallPhone ? 11 : 13,
    color: '#666',
    marginHorizontal: 6,
  },

  bold: {
    fontWeight: '700',
    color: '#111',
  },

  cameraContainer: {
    width: '100%',
    height: cameraHeight,
    position: 'relative',
    backgroundColor: '#111',
    overflow: 'hidden',
  },

  cameraWebView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#111',
  },

  webCameraWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#111',
  },

  cameraLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFDF8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  cameraLoadingText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#14646B',
  },

  cameraError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#E5F5F4',
  },

  cameraErrorTitle: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: '700',
    color: '#16444A',
  },

  cameraErrorText: {
    marginTop: 5,
    maxWidth: 280,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    color: '#666',
  },

  retryButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#14646B',
    gap: 5,
  },

  retryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },

  fullscreen: {
    alignSelf: 'center',
    marginTop: 3,
    paddingHorizontal: 14,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#A5A5A5',
    gap: 5,
  },

  fullText: {
    fontSize: 11,
    color: '#FFF',
  },

  captureSection: {
    marginTop: 5,
    paddingHorizontal: 10,
  },

  line: {
    height: 1,
    backgroundColor: '#D7D7D7',
  },

  captureTitle: {
    marginVertical: 3,
    textAlign: 'center',
    fontSize: isSmallPhone ? 13 : 14,
    fontWeight: '700',
    color: '#111',
  },

  count: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: isSmallPhone ? 13 : 14,
    fontWeight: '700',
    color: '#111',
  },

  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 3,
  },

  snapshot: {
    width: '76%',
    height: snapshotHeight,
    borderRadius: 15,
    backgroundColor: '#111',
  },

  photos: {
    alignSelf: 'center',
    marginTop: 5,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#E5F5F4',
  },

  photosText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16444A',
  },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 9,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  detailText: {
    fontSize: isSmallPhone ? 11 : 12,
    color: '#666',
  },

  controls: {
    width: '80%',
    height: 52,
    alignSelf: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#275861',
  },

  captureButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DCE9EB',
  },
});

export default styles;