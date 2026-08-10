import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const isSmallPhone = width < 360;
const isLargePhone = width > 430;

const titleSize = isSmallPhone
  ? 23
  : isLargePhone
  ? 29
  : 27;

const infoSize = isSmallPhone
  ? 12
  : isLargePhone
  ? 15
  : 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  // PHOTO - 50%
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },

  petImage: {
    width: '100%',
    height: '100%',
  },

  back: {
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 5,
  },

  more: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 5,
  },

  slider: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },

  sliderActive: {
    width: 40,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#5EC8C6',
    marginRight: 5,
  },

  sliderDot: {
    width: 7,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginRight: 5,
  },

  // CARD - 50%
  card: {
    flex: 1,
    width: '100%',
    position: 'relative',
    marginTop: -25,
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    zIndex: 2,
  },

  // DOG WATERMARK
  watermark: {
    position: 'absolute',
    width: width * 0.72,
    height: width * 0.72,
    maxWidth: 350,
    maxHeight: 350,
    minWidth: 250,
    minHeight: 250,
    right: -25,
    bottom: -15,
    opacity: 0.18,
    zIndex: 0,
  },

  // CENTER MAX + INFORMATION
  innerContent: {
    flex: 1,
    width: '88%',
    maxWidth: 430,
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallPhone ? 10 : 14,
  },

  petName: {
    fontSize: titleSize,
    lineHeight: titleSize + 3,
    fontWeight: '700',
    color: '#16444A',
    marginRight: 6,
    flexShrink: 1,
  },

  infoContainer: {
    width: '100%',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: isSmallPhone ? 25 : 29,
  },

  label: {
    width: '38%',
    fontSize: infoSize,
    color: '#777',
  },

  value: {
    flex: 1,
    fontSize: infoSize,
    fontWeight: '700',
    color: '#222',
    flexShrink: 1,
  },

  link: {
    fontSize: infoSize,
    fontWeight: '600',
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
});

export default styles;