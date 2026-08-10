import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallPhone = width < 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  header: {
    height: isSmallPhone ? 78 : 85,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  backButton: {
    width: 35,
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginRight: 35,
  },

  title: {
    fontSize: isSmallPhone ? 24 : 27,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#111',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },

  info: {
    fontSize: isSmallPhone ? 13 : 15,
    color: '#666',
    marginHorizontal: 7,
  },

  bold: {
    fontWeight: '700',
    color: '#111',
  },

  camera: {
    width: '100%',
    height: Math.min(height * 0.27, 240),
  },

  fullscreen: {
    alignSelf: 'center',
    marginTop: 3,
    backgroundColor: '#A5A5A5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  fullText: {
    color: '#FFF',
    fontSize: 12,
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
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 3,
    color: '#111',
  },

  count: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    color: '#111',
  },

  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 2,
  },

  snapshot: {
    width: '76%',
    height: 255,
    borderRadius: 15,
  },

  photos: {
    alignSelf: 'center',
    marginTop: 4,
    backgroundColor: '#E5F5F4',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 15,
  },

  photosText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#222',
  },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 8,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  detailText: {
    fontSize: isSmallPhone ? 12 : 14,
    color: '#666',
  },

  controls: {
    height: 52,
    width: '80%',
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: '#275861',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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