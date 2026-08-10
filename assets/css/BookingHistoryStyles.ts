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

  header: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: isSmallPhone ? 30 : 34,
    lineHeight: isSmallPhone ? 32 : 36,
    color: '#14646B',
    textAlign: 'center',
  },

  headerSpacer: {
    width: 36,
  },

  scrollContent: {
    paddingHorizontal: isSmallPhone ? 16 : 24,
    paddingTop: 4,
    paddingBottom: 28,
  },

  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#DDE2D1',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 4,

    elevation: 3,
  },

  cardHeader: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  petName: {
    fontSize: isSmallPhone ? 21 : 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cardBody: {
    backgroundColor: '#DDE2D1',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 29,
  },

  label: {
    width: isSmallPhone ? '46%' : '44%',
    fontSize: isSmallPhone ? 11 : 12,
    color: '#6F7776',
  },

  value: {
    flex: 1,
    fontSize: isSmallPhone ? 11 : 12,
    fontWeight: '700',
    color: '#222222',
  },
});

export default styles;