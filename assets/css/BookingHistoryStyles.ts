import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

const { width } = Dimensions.get('window');
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: small ? 21 : 23, fontWeight: '900', color: colors.text },
  headerSpacer: { width: 42 },
  scrollContent: { paddingHorizontal: small ? 16 : 20, paddingTop: 8, paddingBottom: 50 },
  pageHeading: { fontSize: 22, fontWeight: '800', color: colors.text },
  pageSubheading: { marginTop: 3, marginBottom: 20, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  centerState: { minHeight: 220, alignItems: 'center', justifyContent: 'center' },
  stateText: { marginTop: 10, fontSize: 13, color: colors.textSecondary },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  petIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  cardTitleWrap: { flex: 1 },
  petName: { fontSize: 17, fontWeight: '800', color: colors.text },
  bookingCode: { marginTop: 2, fontSize: 10.5, color: colors.textSecondary },
  statusBadge: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 9.5, fontWeight: '800' },
  cardDivider: { height: 1, backgroundColor: '#EDF2F1', marginVertical: 12 },
  row: { minHeight: 31, flexDirection: 'row', alignItems: 'center' },
  label: { width: 76, marginLeft: 7, fontSize: 11, color: colors.textMuted },
  value: { flex: 1, fontSize: 11.5, fontWeight: '600', color: '#465F61', textAlign: 'right' },
  emptyCard: { alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 28 },
  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: '800', color: colors.text },
  emptyText: { marginTop: 5, fontSize: 12, lineHeight: 17, color: colors.textSecondary, textAlign: 'center' },
  retryButton: { marginTop: 14, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  retryText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
});

export default styles;
