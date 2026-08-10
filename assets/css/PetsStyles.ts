import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const isSmallPhone = width < 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  content: {
    flex: 1,
    paddingHorizontal: isSmallPhone ? 14 : 18,
  },

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  title: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: isSmallPhone ? 31 : 35,
    color: '#14646B',
  },

  headerSpacer: {
    width: 36,
  },

  petCard: {
    width: '100%',
    minHeight: isSmallPhone ? 118 : 124,

    backgroundColor: '#E1F3F2',

    borderRadius: 24,

    marginBottom: 24,

    paddingHorizontal: 10,
    paddingVertical: 10,

    flexDirection: 'row',
    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3,

    elevation: 3,
  },

  petImage: {
    width: isSmallPhone ? 76 : 82,
    height: isSmallPhone ? 76 : 82,

    borderRadius: 22,

    marginRight: 12,
  },

  petDetails: {
    flex: 1,
  },

  petName: {
    fontSize: isSmallPhone ? 22 : 25,
    lineHeight: isSmallPhone ? 24 : 27,

    fontWeight: '700',

    color: '#16444A',
  },

  petInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 5,
  },

  weight: {
    fontSize: isSmallPhone ? 18 : 21,

    fontWeight: '700',

    color: '#111',

    marginLeft: 14,
  },

  checkedIn: {
    marginTop: 20,

    fontSize: isSmallPhone ? 12 : 13,

    fontWeight: '700',

    color: '#4AC65A',
  },

  lastCheckedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    marginTop: 20,
  },

  lastCheckedLabel: {
    fontSize: isSmallPhone ? 11 : 12,

    fontWeight: '700',

    color: '#FF3030',

    marginRight: 10,
  },

  lastCheckedDate: {
    fontSize: isSmallPhone ? 11 : 12,

    fontWeight: '700',

    color: '#111',
  },
});

export default styles;