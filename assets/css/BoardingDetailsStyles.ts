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
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 0,
    top: 25,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: isSmallPhone ? 31 : 35,
    lineHeight: isSmallPhone ? 34 : 38,
    color: '#14646B',
    textAlign: 'center',
  },

  petCard: {
    width: '100%',
    height: 90,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  petImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 20,
  },

  petInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  petName: {
    fontSize:30,
    lineHeight: 19,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  petDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },

  petDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: isSmallPhone ? 7 : 12,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#19767B',
    marginRight: 4,
  },

  petText: {
    fontSize: isSmallPhone ? 20 : 20,
    color: '#555',
  },

  topCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  smallCard: {
    width: '49%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2F3F2',
  },

  orangeHeader: {
    backgroundColor: '#F49B7D',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 5,
    color: '#111',
  },

  smallCardBody: {
    height: 82,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigValue: {
    fontSize: 23,
    fontWeight: '600',
    color: '#111',
  },

  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  feedingCard: {
    width: '49%',
    backgroundColor: '#E2F3F2',
    borderRadius: 12,
    overflow: 'hidden',
  },

  rightColumn: {
    width: '49%',
  },

  specialCard: {
    backgroundColor: '#E2F3F2',
    borderRadius: 12,
    height: 100,
    overflow: 'hidden',
    marginBottom: 6,
  },

  staffCard: {
    backgroundColor: '#E2F3F2',
    borderRadius: 12,
     height: 100,
    overflow: 'hidden',
    marginBottom: 6,
  },

  daysCard: {
    backgroundColor: '#E2F3F2',
    borderRadius: 12,
    overflow: 'hidden',
  },

  blueHeader: {
    backgroundColor: '#42B4C1',
    textAlign: 'center',
    fontSize: isSmallPhone ? 11 : 12,
    fontWeight: '700',
    paddingVertical: 5,
    color: '#111',
  },

  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222',
    marginTop: 5,
  },

  description: {
    fontSize: 10,
    lineHeight: 14,
    color: '#222',
  },

  daysBody: {
    height: 118,
    justifyContent: 'center',
    alignItems: 'center',
  },

  daysText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },

  dateCard: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2F3F2',
  },

  dateHeader: {
    height: 30,
    paddingHorizontal: 30,
    backgroundColor: '#9FAEEB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  dateBody: {
    height: 80,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: isSmallPhone ? 11 : 13,
    color: '#111',
  },

  bottomNav: {
    height: 58,
    backgroundColor: '#53B5C2',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;