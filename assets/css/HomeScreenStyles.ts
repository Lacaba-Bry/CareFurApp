import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 60,
  },

  header: {
    marginTop: 10,
  },

  greeting: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#173F43',
  },

  greetingName: {
    fontWeight: '900',
    color: '#14646B',
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    color: '#6F8284',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 26,
  },

  card: {
    width: '48.5%',
    height: 130,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },

  cardText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    color: '#FFF',
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 4,
  },

  smallTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },

  mealsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  percentBadge: {
    marginLeft: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: '#67C6C3',
    borderRadius: 6,
  },

  percentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },

  updateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  updateBox: {
    width: '67%',
    height: 120,
    backgroundColor: '#E4F3F2',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  time: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
    color: '#222',
  },

  food: {
    fontSize: 13,
    marginTop: 2,
    color: '#222',
  },

  view: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    color: '#0B6E71',
  },

  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#D06435',
    justifyContent: 'center',
    alignItems: 'center',
  },

  percent: {
    fontSize: 25,
    lineHeight: 27,
    fontWeight: '800',
    color: '#222',
  },

  done: {
    fontSize: 10,
    fontWeight: '700',
    color: '#555',
  },

  bottomSection: {
    marginTop: 8,
  },

  bottomTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 4,
  },

  bottomCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  foodCard: {
    width: '48.5%',
    height: 140,
    backgroundColor: '#C9B47C',
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  foodTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 1,
    color: '#222',
  },

  foodDetail: {
    fontSize: 11,
    marginLeft: 5,
    marginBottom: 4,
    color: '#222',
  },

  feedCard: {
    width: '48.5%',
    height: 140,
    backgroundColor: '#A8B4E8',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dinnerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  timeBig: {
    fontSize: 38,
    lineHeight: 40,
    fontWeight: '800',
    color: '#111',
  },

  pmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
});

export default styles;