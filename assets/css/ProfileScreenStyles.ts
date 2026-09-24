import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

const { width } = Dimensions.get('window');
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: small ? 16 : 20, paddingTop: 20, paddingBottom: 100 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stateText: { marginTop: 10, color: colors.textSecondary, fontSize: 13 },
  header: { marginBottom: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: colors.text },
  pageSubtitle: { marginTop: 3, fontSize: 13, color: colors.textSecondary },
  profileCard: { backgroundColor: colors.surface, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileImage: { width: small ? 78 : 86, height: small ? 78 : 86, borderRadius: 24, marginRight: 14 },
  profileInfo: { flex: 1 },
  name: { fontSize: small ? 21 : 23, fontWeight: '800', color: colors.text },
  email: { marginTop: 3, fontSize: 12, color: colors.textSecondary },
  phoneRow: { marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  phoneText: { marginLeft: 5, fontSize: 11, color: colors.textSecondary },
  accountBadge: { alignSelf: 'flex-start', marginTop: 9, backgroundColor: colors.primarySoft, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5 },
  accountBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '800' },
  guestBadge: { backgroundColor: colors.accentSoft },
  guestBadgeText: { color: colors.accent },
  errorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: 14, padding: 12, marginBottom: 16 },
  errorText: { flex: 1, marginLeft: 8, color: colors.danger, fontSize: 12, lineHeight: 17 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 9, marginTop: 2 },
  menuCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 20 },
  menuRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center' },
  notificationRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center' },
  menuIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  menuTextWrap: { flex: 1 },
  menuText: { fontSize: 14, fontWeight: '700', color: colors.text },
  menuSubtitle: { marginTop: 2, fontSize: 10.5, lineHeight: 15, color: colors.textSecondary },
  menuDivider: { height: 1, backgroundColor: '#EDF2F1', marginLeft: 49 },
  logoutButton: { height: 50, borderRadius: 15, backgroundColor: colors.dangerSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  logoutText: { marginLeft: 7, fontSize: 13, fontWeight: '800', color: colors.danger },
});

export default styles;
