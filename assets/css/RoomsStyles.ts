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
  },

  header: {
    minHeight: 115,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 10,
    top: 28,
  },

  titleContainer: {
    alignItems: 'center',
  },

  title: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: isSmallPhone ? 36 : 42,
    lineHeight: isSmallPhone ? 40 : 46,
    color: '#14646B',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 2,
  },

  dateBold: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111',
    marginRight: 4,
  },

  dateNormal: {
    fontSize: 11,
    color: '#666',
    marginRight: 3,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 7,
    paddingHorizontal: 6,
  },

  dayItem: {
    alignItems: 'center',
  },

  dayText: {
    fontSize: 10,
    color: '#111',
    marginBottom: 3,
  },

  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayCircleActive: {
    backgroundColor: '#D7D7D7',
  },

  dayNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111',
  },

  roomArea: {
    flex: 1,
    marginTop: 18,
    position: 'relative',
  },

  topRoomRow: {
    height: 78,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#111',
  },

  bottomRoomRow: {
    height: 78,
    flexDirection: 'row',
    marginTop: 76,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#111',
  },

  roomBox: {
    flex: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  roomTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 13,
    color: '#111',
  },

  roomNumber: {
    fontSize: 18,
    color: '#111',
  },

  occupiedIcon: {
    position: 'absolute',
    bottom: 4,
  },

  playArea: {
    position: 'absolute',
    top: 88,
    alignSelf: 'center',
    width: 95,
    height: 55,
    backgroundColor: '#B9A578',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playText: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 16,
    color: '#FFF',
  },

  rightArrow: {
    position: 'absolute',
    right: 2,
    top: 102,
  },

  leftArrow: {
    position: 'absolute',
    left: 2,
    top: 83,
  },

  houseTopRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  houseBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },

  houseRoom: {
    width: '32%',
    height: 105,
    backgroundColor: '#E9B2E5',
    borderWidth: 2,
    borderColor: '#111',
    position: 'relative',
    alignItems: 'center',
  },

  houseTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 14,
    marginTop: 7,
    color: '#111',
  },

  houseDoor: {
    position: 'absolute',
    right: 7,
    bottom: 8,
    width: 20,
    height: 28,
    borderWidth: 2,
    borderColor: '#111',
  },

  houseBed: {
    position: 'absolute',
    left: 0,
    bottom: 7,
    width: 28,
    height: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#111',
  },

  houseOccupied: {
    position: 'absolute',
    left: 8,
    bottom: 19,
  },

  legend: {
    alignSelf: 'flex-end',
    marginRight: 18,
    marginBottom: 12,
  },

  legendTitle: {
    fontSize: 10,
    color: '#111',
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  legendText: {
    fontSize: 10,
    color: '#444',
    marginLeft: 3,
  },

  bottomNav: {
    height: 58,
    backgroundColor: '#53B5C2',
    flexDirection: 'row',
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