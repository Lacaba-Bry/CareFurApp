import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

const { width, height } = Dimensions.get('window');
const cameraHeight = Math.min(Math.max(height * 0.31, 215), 305);
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: small ? 15 : 18, paddingTop: 18, paddingBottom: 96 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  headerText: { flex: 1, paddingRight: 12 },
  pageTitle: { fontSize: 25, fontWeight: '900', letterSpacing: -0.4, color: colors.text },
  pageSubtitle: { marginTop: 3, fontSize: 11, lineHeight: 16, color: colors.textSecondary },
  refreshButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },

  petCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 19, padding: 12, marginBottom: 12 },
  petImage: { width: 52, height: 52, borderRadius: 16, marginRight: 10 },
  petInfo: { flex: 1 },
  petName: { fontSize: 17, fontWeight: '900', color: colors.text },
  petMeta: { marginTop: 3, fontSize: 10, color: colors.textSecondary },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 13, backgroundColor: colors.successSoft, paddingHorizontal: 9, paddingVertical: 6 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5, backgroundColor: colors.success },
  onlineText: { fontSize: 9.5, fontWeight: '800', color: colors.success },
  offlineBadge: { backgroundColor: colors.dangerSoft },
  offlineDot: { backgroundColor: colors.danger },
  offlineText: { color: colors.danger },
  notice: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 11, marginBottom: 12, backgroundColor: colors.warningSoft },
  noticeText: { flex: 1, marginLeft: 7, fontSize: 10.5, color: colors.warning },

  cameraCard: { overflow: 'hidden', borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cameraHeader: { height: 58, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cameraTitle: { fontSize: 13.5, fontWeight: '900', color: colors.text },
  cameraSubtitle: { marginTop: 2, fontSize: 9, color: colors.textMuted },
  cameraContainer: { height: cameraHeight, backgroundColor: '#101515', position: 'relative' },
  cameraWebView: { flex: 1, backgroundColor: '#101515' },
  webCameraWrapper: { flex: 1, position: 'relative', backgroundColor: '#101515' },
  cameraLoader: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F8F7' },
  cameraLoadingText: { marginTop: 10, fontSize: 11, fontWeight: '700', color: colors.primary },
  cameraError: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, backgroundColor: '#F3F8F7' },
  cameraErrorIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cameraErrorTitle: { marginTop: 10, fontSize: 16, fontWeight: '900', color: colors.text },
  cameraErrorText: { marginTop: 5, textAlign: 'center', fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  retryButton: { marginTop: 13, minHeight: 40, borderRadius: 13, paddingHorizontal: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  retryText: { marginLeft: 6, fontSize: 11, fontWeight: '800', color: '#FFF' },

  cameraActions: { flexDirection: 'row', gap: 8, padding: 11 },
  captureButton: { flex: 1, minHeight: 44, borderRadius: 13, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  captureButtonText: { marginLeft: 7, fontSize: 11, fontWeight: '900', color: '#FFF' },
  secondaryAction: { minWidth: 104, minHeight: 44, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { marginLeft: 5, fontSize: 10.5, fontWeight: '800', color: colors.primary },

  snapshotHeader: { marginTop: 22, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  sectionSubtitle: { marginTop: 2, fontSize: 10, color: colors.textSecondary },
  snapshotCountBadge: { minWidth: 32, height: 32, paddingHorizontal: 8, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  snapshotCount: { fontSize: 12, fontWeight: '900', color: colors.primary },
  latestSnapshotCard: { borderRadius: 19, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  latestSnapshotImage: { width: '100%', height: 188, backgroundColor: '#EEF3F2' },
  snapshotMetaBar: { minHeight: 58, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  snapshotMetaTitle: { fontSize: 11, fontWeight: '800', color: colors.text },
  snapshotMetaText: { marginTop: 2, fontSize: 9.5, color: colors.textSecondary },
  snapshotStrip: { gap: 9, paddingTop: 10, paddingBottom: 4 },
  snapshotThumbCard: { width: 104, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  snapshotThumb: { width: '100%', height: 72, backgroundColor: '#EEF3F2' },
  snapshotThumbTime: { paddingVertical: 7, textAlign: 'center', fontSize: 8.5, fontWeight: '700', color: colors.textSecondary },
  emptySnapshots: { minHeight: 150, borderRadius: 19, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 22 },
  emptySnapshotIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptySnapshotTitle: { marginTop: 9, fontSize: 14, fontWeight: '900', color: colors.text },
  emptySnapshotText: { marginTop: 4, maxWidth: 280, textAlign: 'center', fontSize: 9.5, lineHeight: 14, color: colors.textSecondary },
});

export default styles;
