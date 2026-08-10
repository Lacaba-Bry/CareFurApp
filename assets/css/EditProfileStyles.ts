import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const isSmallPhone = width < 360;

const horizontalPadding = isSmallPhone ? 16 : 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    paddingHorizontal: horizontalPadding,
  },

  /* HEADER */

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: isSmallPhone ? 19 : 21,
    fontWeight: '700',
    color: '#16444A',
  },

  headerSpacer: {
    width: 38,
  },

  /* PROFILE PHOTO */

  photoSection: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 14,
  },

  imageWrapper: {
    position: 'relative',
  },

  profileImage: {
    width: isSmallPhone ? 82 : 92,
    height: isSmallPhone ? 82 : 92,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  cameraButton: {
    position: 'absolute',
    right: -2,
    bottom: 2,

    width: 30,
    height: 30,
    borderRadius: 15,

    backgroundColor: '#14646B',

    borderWidth: 2,
    borderColor: '#FFFDF8',

    justifyContent: 'center',
    alignItems: 'center',
  },

  changeText: {
    marginTop: 6,

    fontSize: 12,
    fontWeight: '600',

    color: '#14646B',
  },

  /* FORM */

  form: {
    width: '90%',

    backgroundColor: '#D6C292',

    borderRadius: 24,

    paddingHorizontal: isSmallPhone ? 15 : 18,
    paddingTop: 20,
    paddingBottom: 8,
    marginLeft: 20,
  },

  inputRow: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    width: isSmallPhone ? 82 : 100,

    fontSize: isSmallPhone ? 12 : 13,
    fontWeight: '600',

    color: '#3D4545',
  },

  input: {
    flex: 1,

    height: 34,

    paddingHorizontal: 12,
    paddingVertical: 0,

    backgroundColor: '#FFFDF8',

    borderWidth: 1,
    borderColor: '#8D8170',

    borderRadius: 17,

    fontSize: isSmallPhone ? 12 : 13,

    color: '#222222',
  },

  /* SEX SELECT */

  selectWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 20,
  },

  select: {
    height: 34,

    paddingHorizontal: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#FFFDF8',

    borderWidth: 1,
    borderColor: '#8D8170',

    borderRadius: 17,
  },

  selectText: {
    fontSize: isSmallPhone ? 12 : 13,
    color: '#222222',
  },

  dropdown: {
    position: 'absolute',

    top: 38,
    left: 0,
    right: 0,

    backgroundColor: '#FFFDF8',

    borderWidth: 1,
    borderColor: '#C4B38B',

    borderRadius: 12,

    overflow: 'hidden',

    zIndex: 50,

    elevation: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  dropdownItem: {
    height: 38,

    justifyContent: 'center',

    paddingHorizontal: 13,
  },

  dropdownText: {
    fontSize: 13,
    color: '#16444A',
  },

  dropdownDivider: {
    height: 1,
    backgroundColor: '#E8E2D6',
  },

  /* BUTTONS */

  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,

    gap: 10,
  },

  cancel: {
    minWidth: 85,
    height: 38,

    paddingHorizontal: 18,

    backgroundColor: '#A9ADAC',

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  apply: {
    minWidth: 85,
    height: 38,

    paddingHorizontal: 18,

    backgroundColor: '#14646B',

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 12,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  applyText: {
    fontSize: 12,
    fontWeight: '700',

    color: '#FFFFFF',
  },
});

export default styles;