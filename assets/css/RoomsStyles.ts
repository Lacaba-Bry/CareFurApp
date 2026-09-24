import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

const { width } = Dimensions.get('window');
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 72, paddingHorizontal: small ? 14 : 18, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.background },
  headerButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: small ? 21 : 23, fontWeight: '900', color: colors.text, letterSpacing: -0.3 },
  headerSubtitle: { marginTop: 2, fontSize: 9.5, color: colors.textSecondary },
  content: { paddingHorizontal: small ? 14 : 18, paddingTop: 16, paddingBottom: 96 },

  dateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 11 },
  dateArrow: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  dateArrowDisabled: { backgroundColor: '#F1F4F3' },
  dateCenter: { flex: 1, alignItems: 'center' },
  datePrimary: { fontSize: 14, fontWeight: '900', color: colors.text },
  dateSecondary: { marginTop: 2, fontSize: 9.5, color: colors.textSecondary },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 12 },
  dayPill: { width: '13.2%', minHeight: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  dayPillActive: { backgroundColor: colors.primary },
  dayPillDisabled: { opacity: 0.35 },
  dayName: { fontSize: 9, fontWeight: '700', color: colors.textSecondary },
  dayNameActive: { color: '#DFF4F3' },
  dayNumber: { marginTop: 4, fontSize: 13, fontWeight: '900', color: colors.text },
  dayNumberActive: { color: '#FFF' },

  summaryStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 12, marginBottom: 18 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { marginTop: 3, fontSize: 18, fontWeight: '900', color: colors.text },
  summaryLabel: { marginTop: 1, fontSize: 8.5, color: colors.textSecondary },
  summaryDivider: { width: 1, height: 34, backgroundColor: colors.border },

  mapHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.text },
  sectionSubtitle: { marginTop: 3, maxWidth: 330, fontSize: 10.5, lineHeight: 15, color: colors.textSecondary },
  legendInline: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  legendDot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  legendText: { marginRight: 12, fontSize: 9, color: colors.textSecondary },

  floorPlan: { borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FBFCFA', padding: 11, overflow: 'hidden' },
  wingSwitcher: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  wingSwitchButton: { flex: 1, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingVertical: 10, alignItems: 'center' },
  wingSwitchButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  wingSwitchText: { fontSize: 12, fontWeight: '900', color: colors.text },
  wingSwitchCount: { marginTop: 2, fontSize: 8.5, color: colors.textSecondary },
  wingSwitchTextActive: { color: '#FFFFFF' },
  floorTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  floorSideTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  floorStatusPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, backgroundColor: colors.primarySoft, paddingHorizontal: 9, paddingVertical: 5 },
  floorStatusText: { marginLeft: 5, fontSize: 8.5, fontWeight: '700', color: colors.primary },
  centerAisleSubtext: { marginTop: 1, fontSize: 8, color: colors.textSecondary },
  floorLegendRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  floorLegendText: { marginLeft: 5, fontSize: 8.5, color: colors.textSecondary },
  wingColumn: { width: '100%' },
  wingLabelRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 7 },
  wingLine: { flex: 1, height: 1, backgroundColor: colors.border },
  wingLabel: { marginHorizontal: 8, fontSize: 8.5, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  wingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  centerAisle: { marginVertical: 12, minHeight: 52, borderRadius: 15, backgroundColor: colors.sandSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8DCC7' },
  centerAisleIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  centerAisleText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1, color: colors.text },

  roomTile: { width: '48.7%', minHeight: 132, borderWidth: 1.5, borderRadius: 17, overflow: 'hidden', backgroundColor: colors.surface },
  roomTileStatus: { minHeight: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 8.5, fontWeight: '800' },
  roomTileBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 9 },
  roomIconWrap: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  roomNumber: { fontSize: 18, fontWeight: '900', color: colors.text },
  roomName: { marginTop: 2, fontSize: 9, color: colors.textSecondary, maxWidth: '100%' },
  capacityText: { marginTop: 4, fontSize: 8.5, color: colors.textMuted },
  emptyWing: { width: '100%', minHeight: 70, alignItems: 'center', justifyContent: 'center' },
  emptyWingText: { fontSize: 9.5, color: colors.textMuted },

  noticeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warningSoft, borderRadius: 14, padding: 11, marginBottom: 10 },
  noticeText: { flex: 1, marginLeft: 7, fontSize: 10, color: colors.warning },
  centerState: { minHeight: 220, alignItems: 'center', justifyContent: 'center' },
  stateText: { marginTop: 9, fontSize: 11, color: colors.textSecondary },
  emptyCard: { minHeight: 190, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { marginTop: 8, fontSize: 15, fontWeight: '800', color: colors.text },
  emptyText: { marginTop: 4, textAlign: 'center', fontSize: 10.5, color: colors.textSecondary },

  bottomNav: { height: 66, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 12 },
  navButton: { width: 48, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});

export default styles;
