import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

const { width } = Dimensions.get('window');
const small = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: small ? 20 : 22, fontWeight: '800', color: colors.text },
  headerSpacer: { width: 42 },
  content: { paddingHorizontal: small ? 16 : 20, paddingBottom: 50 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stateText: { marginTop: 10, color: colors.textSecondary, fontSize: 13 },
  profileHero: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatarWrap: { width: 82, height: 82, borderRadius: 24, overflow: 'visible', backgroundColor: colors.primarySoft, marginRight: 14 },
  profileImage: { width: '100%', height: '100%', borderRadius: 24 },
  heroText: { flex: 1 },
  heroName: { fontSize: small ? 20 : 22, fontWeight: '800', color: colors.text },
  heroEmail: { marginTop: 3, fontSize: 12, color: colors.textSecondary },
  ownerBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 9, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14, backgroundColor: colors.primarySoft },
  ownerBadgeText: { marginLeft: 5, fontSize: 10, fontWeight: '800', color: colors.primary },
  errorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: 14, padding: 12, marginBottom: 16 },
  errorText: { flex: 1, marginLeft: 8, color: colors.danger, fontSize: 12, lineHeight: 17 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  sectionSubtitle: { marginTop: 3, marginBottom: 12, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  formCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 15 },
  fieldGroup: { marginBottom: 15 },
  label: { marginBottom: 7, fontSize: 11, fontWeight: '800', color: '#53686A' },
  inputWrap: { minHeight: 50, borderWidth: 1, borderColor: '#D7E3E2', borderRadius: 14, backgroundColor: '#FCFEFD', paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, marginLeft: 9, paddingVertical: 11, fontSize: 14, color: colors.text },
  multilineWrap: { minHeight: 96, alignItems: 'flex-start' },
  multilineIcon: { marginTop: 14 },
  multilineInput: { minHeight: 86, textAlignVertical: 'top', paddingTop: 13 },
  readOnlyWrap: { backgroundColor: '#F1F4F3' },
  readOnlyInput: { color: colors.textSecondary },
  infoNotice: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 13, backgroundColor: colors.primarySoft, borderRadius: 14, padding: 12 },
  infoNoticeText: { flex: 1, marginLeft: 8, fontSize: 11, lineHeight: 16, color: colors.primaryDark },
  saveButton: { height: 52, marginTop: 22, borderRadius: 15, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { marginLeft: 7, color: '#FFF', fontSize: 14, fontWeight: '800' },
  disabledButton: { opacity: 0.65 },
  cancelButton: { height: 46, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },

  cameraBadge: { position: 'absolute', right: -4, bottom: -4, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  changePhotoButton: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.primarySoft },
  changePhotoText: { fontSize: 10, fontWeight: '800', color: colors.primary },
});

export default styles;
