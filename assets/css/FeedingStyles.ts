import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';
const { width } = Dimensions.get('window');
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: small ? 15 : 18, paddingTop: 18, paddingBottom: 96 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  pageTitle: { fontSize: 25, fontWeight: '900', letterSpacing: -0.4, color: colors.text },
  pageSubtitle: { marginTop: 3, maxWidth: 300, fontSize: 10.8, lineHeight: 16, color: colors.textSecondary },
  headerIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },

  petCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 13, flexDirection: 'row', alignItems: 'center' },
  petImage: { width: 56, height: 56, borderRadius: 17, marginRight: 11 },
  petInfo: { flex: 1 },
  petName: { fontSize: 18, fontWeight: '900', color: colors.text },
  petMeta: { marginTop: 3, fontSize: 10, color: colors.textSecondary },
  progressPill: { minWidth: 62, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 8 },
  progressValue: { fontSize: 16, fontWeight: '900', color: colors.primary },
  progressLabel: { marginTop: 1, fontSize: 8.5, color: colors.primary },

  summaryStrip: { flexDirection: 'row', alignItems: 'center', marginTop: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 11 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 34, backgroundColor: colors.border },
  summaryValue: { marginTop: 3, fontSize: 17, fontWeight: '900', color: colors.text },
  summaryLabel: { fontSize: 8.5, color: colors.textSecondary },

  notice: { marginTop: 11, borderRadius: 14, padding: 11, flexDirection: 'row', alignItems: 'center' },
  noticeError: { backgroundColor: colors.dangerSoft },
  noticeInfo: { backgroundColor: colors.primarySoft },
  noticeText: { flex: 1, marginLeft: 7, fontSize: 10, lineHeight: 15 },

  filterRow: { flexDirection: 'row', marginTop: 15, marginBottom: 17, backgroundColor: '#EEF3F2', padding: 4, borderRadius: 15 },
  filterButton: { flex: 1, minHeight: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  filterText: { fontSize: 10.5, fontWeight: '700', color: colors.textSecondary },
  filterTextActive: { color: colors.primary },

  centerState: { minHeight: 230, alignItems: 'center', justifyContent: 'center' },
  stateText: { marginTop: 9, fontSize: 11, color: colors.textSecondary },
  emptyCard: { minHeight: 190, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 9, fontSize: 15, fontWeight: '900', color: colors.text },
  emptyText: { marginTop: 4, textAlign: 'center', fontSize: 10.5, color: colors.textSecondary },

  daySection: { marginBottom: 14 },
  dayHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dayHeading: { fontSize: 14, fontWeight: '900', color: colors.text },
  dayCount: { fontSize: 9, color: colors.textMuted },

  logCard: { flexDirection: 'row', marginBottom: 9 },
  timelineRail: { width: 22, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 18, zIndex: 2 },
  timelineLine: { position: 'absolute', top: 28, bottom: -10, width: 2, backgroundColor: colors.border },
  logContent: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 13 },
  logTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { fontSize: 17, fontWeight: '900', color: colors.text },
  methodLine: { marginTop: 2, fontSize: 9.5, color: colors.textSecondary },
  resultBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 6 },
  resultDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  resultText: { fontSize: 9, fontWeight: '800' },

  mealFacts: { flexDirection: 'row', marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: '#EDF2F1' },
  factItem: { flex: 1, alignItems: 'center', paddingHorizontal: 3 },
  factLabel: { marginTop: 4, fontSize: 8.5, color: colors.textMuted },
  factValue: { marginTop: 2, fontSize: 10.5, fontWeight: '800', color: colors.text },

  verificationBar: { marginTop: 12, borderRadius: 13, backgroundColor: colors.primarySoft, padding: 10, flexDirection: 'row', alignItems: 'flex-start' },
  verificationTextWrap: { flex: 1, marginLeft: 8 },
  verificationTitle: { fontSize: 10.5, fontWeight: '900', color: colors.text },
  verificationBody: { marginTop: 2, fontSize: 9, lineHeight: 14, color: colors.textSecondary },
  pendingBar: { marginTop: 12, borderRadius: 13, backgroundColor: colors.warningSoft, padding: 10, flexDirection: 'row', alignItems: 'center' },
  pendingText: { flex: 1, marginLeft: 7, fontSize: 9, lineHeight: 14, color: colors.warning },
  notesRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  notesText: { flex: 1, marginLeft: 6, fontSize: 9.5, lineHeight: 14, color: colors.textSecondary },
});

export default styles;
