import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallPhone = width < 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  profileImage: {
    width: isSmallPhone ? 82 : 92,
    height: isSmallPhone ? 82 : 92,
    borderRadius: isSmallPhone ? 41 : 46,
    marginRight: 14,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: isSmallPhone ? 28 : 32,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#14646B',
    marginBottom: 6,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailBlock: {
    marginRight: 10,
  },

  detailValue: {
    fontSize: isSmallPhone ? 11 : 12,
    color: '#222',
  },

  detailLabel: {
    fontSize: isSmallPhone ? 10 : 11,
    color: '#777',
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: isSmallPhone ? 20 : 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  menuCard: {
    backgroundColor: '#E2F3F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  menuRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    fontSize: isSmallPhone ? 14 : 15,
    fontWeight: '600',
    color: '#16444A',
    marginLeft: 10,
  },

  notificationRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  notificationText: {
    fontSize: isSmallPhone ? 14 : 15,
    fontWeight: '600',
    color: '#16444A',
  },
});

export default styles;