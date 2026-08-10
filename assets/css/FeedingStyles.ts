import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallPhone = width < 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 8,
  },

  title: {
    fontSize: isSmallPhone ? 20 : 23,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#111',
  },

  petCard: {
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFDF8',
  },

  petTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },

  petInfo: {
    flex: 1,
  },

  petName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 1,
  },

  info: {
    fontSize: 10,
    color: '#555',
  },

  infoDot: {
    fontSize: 7,
    marginHorizontal: 4,
    color: '#1A6D72',
  },

  mealsInsideCard: {
    marginTop: 7,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },

  mealsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#222',
  },

  mealStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  completed: {
    fontSize: 10,
    color: '#2BA84A',
  },

  pending: {
    fontSize: 10,
    color: '#8A6A1D',
  },

  dateRow: {
    marginHorizontal: 14,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  filter: {
    marginHorizontal: 14,
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 2,
    marginTop: 4,
  },

  filterItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },

  filterActive: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D6D6D6',
    borderRadius: 10,
    paddingVertical: 4,
  },

  filterText: {
    fontSize: 10,
    color: '#444',
  },

  filterActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111',
  },

  log: {
    marginHorizontal: 14,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 7,
  },

  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  time: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  status: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16444A',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  bullet: {
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#555',
    marginLeft: -18,
    marginRight: 8,
  },

  item: {
    fontSize: 11,
    color: '#222',
    flexShrink: 1,
  },

  photoBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#16444A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 5,
  },

  photoText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default styles;