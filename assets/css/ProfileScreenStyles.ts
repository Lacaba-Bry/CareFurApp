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
    paddingHorizontal: isSmallPhone ? 16 : 22,
    paddingTop: 16,
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
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
    fontSize: isSmallPhone ? 27 : 31,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#14646B',
    marginBottom: 7,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailBlock: {
    marginRight: 8,
  },

  detailValue: {
    fontSize: isSmallPhone ? 11 : 12,
    fontWeight: '500',
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
    marginBottom: 8,
  },

  menuCard: {
    width: '100%',
    backgroundColor: '#E2F3F2',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },

  menuRow: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    marginLeft: 11,
    fontSize: isSmallPhone ? 14 : 15,
    fontWeight: '600',
    color: '#16444A',
  },

  notificationRow: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  notificationText: {
    marginLeft: 11,
    fontSize: isSmallPhone ? 14 : 15,
    fontWeight: '600',
    color: '#16444A',
  },

  logoutRow: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderTopWidth: 1,
    borderTopColor: 'rgba(22, 68, 74, 0.12)',
  },

  logoutText: {
    marginLeft: 11,
    fontSize: isSmallPhone ? 14 : 15,
    fontWeight: '700',
    color: '#D06435',
  },
});

export default styles;