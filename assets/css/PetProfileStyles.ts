import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } =
  Dimensions.get('window');

const small =
  width < 360;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#FFFDF8',
    },

    // HEADER

    header: {
      height: 64,
      paddingHorizontal: 18,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    headerButton: {
      width: 44,
      height: 44,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    title: {
      fontFamily:
        'DancingScript_700Bold',

      fontSize:
        small ? 29 : 34,

      color:
        '#14646B',
    },

    editButton: {
      minWidth: 70,
      height: 38,

      paddingHorizontal: 12,

      borderRadius: 19,

      backgroundColor:
        '#E7F4F4',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    editButtonText: {
      color:
        '#14646B',

      fontWeight:
        '700',

      fontSize: 13,

      marginLeft: 5,
    },

    content: {
      paddingHorizontal: 20,
      paddingBottom: 60,
    },

    // PROFILE TOP

    profileHeader: {
      alignItems:
        'center',

      marginTop: 10,

      marginBottom: 28,
    },

    imageContainer: {
      position:
        'relative',
    },

    petImage: {
      width: 120,
      height: 120,

      borderRadius: 32,

      borderWidth: 4,

      borderColor:
        '#FFFFFF',
    },

    pawBadge: {
      position:
        'absolute',

      right: -5,
      bottom: -5,

      width: 38,
      height: 38,

      borderRadius: 19,

      backgroundColor:
        '#14646B',

      justifyContent:
        'center',

      alignItems:
        'center',

      borderWidth: 3,

      borderColor:
        '#FFFDF8',
    },

    petName: {
      marginTop: 14,

      fontSize: 25,

      fontWeight:
        '800',

      color:
        '#173F43',
    },

    petSubtitle: {
      marginTop: 3,

      fontSize: 14,

      color:
        '#718587',
    },

    // SECTIONS

    sectionTitle: {
      fontSize: 17,

      fontWeight:
        '800',

      color:
        '#173F43',

      marginTop: 8,

      marginBottom: 12,
    },

    // VIEW MODE

    infoCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 20,

      paddingHorizontal: 16,

      paddingVertical: 5,

      marginBottom: 24,

      borderWidth: 1,

      borderColor:
        '#E3ECEC',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.05,

      shadowRadius: 8,

      elevation: 2,
    },

    profileRow: {
      minHeight: 66,

      flexDirection:
        'row',

      alignItems:
        'center',
    },

    profileRowVertical: {
      minHeight: 78,
      alignItems:
        'flex-start',

      paddingVertical: 14,
    },

    profileIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        '#E7F4F4',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 12,
    },

    profileTextContainer: {
      flex: 1,
    },

    profileLabel: {
      fontSize: 11,

      color:
        '#839294',

      marginBottom: 3,
    },

    profileValue: {
      fontSize: 14,

      lineHeight: 20,

      fontWeight:
        '600',

      color:
        '#344F52',

      textTransform:
        'none',
    },

    divider: {
      height: 1,

      backgroundColor:
        '#EDF1F1',

      marginLeft: 50,
    },

    // FORM

    inputGroup: {
      marginBottom: 16,
    },

    inputLabel: {
      fontSize: 12,

      fontWeight:
        '700',

      color:
        '#53686A',

      marginBottom: 7,
    },

    inputContainer: {
      minHeight: 52,

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        '#DCE6E6',

      backgroundColor:
        '#FFFFFF',

      paddingHorizontal: 14,

      flexDirection:
        'row',

      alignItems:
        'center',
    },

    input: {
      flex: 1,

      fontSize: 14,

      color:
        '#193E42',

      marginLeft: 10,

      paddingVertical: 12,
    },

    multilineContainer: {
      minHeight: 100,

      alignItems:
        'flex-start',
    },

    multilineInput: {
      minHeight: 90,

      textAlignVertical:
        'top',

      paddingTop: 14,
    },

    multilineIcon: {
      marginTop: 15,
    },

    inputSuffix: {
      color:
        '#718587',

      fontSize: 13,

      fontWeight:
        '600',
    },

    // SEX BUTTONS

    genderRow: {
      flexDirection:
        'row',

      marginBottom: 18,

      gap: 8,
    },

    genderButton: {
      flex: 1,

      minHeight: 44,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        '#CDE0E0',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFFFFF',
    },

    genderButtonActive: {
      backgroundColor:
        '#14646B',

      borderColor:
        '#14646B',
    },

    genderButtonText: {
      marginLeft: 5,

      color:
        '#14646B',

      fontWeight:
        '700',

      fontSize:
        small ? 11 : 12,
    },

    genderButtonTextActive: {
      color:
        '#FFFFFF',
    },

    // BUTTONS

    saveButton: {
      height: 52,

      borderRadius: 14,

      backgroundColor:
        '#14646B',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 12,
    },

    saveButtonText: {
      marginLeft: 7,

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '800',
    },

    cancelButton: {
      height: 48,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 8,
    },

    cancelButtonText: {
      color:
        '#758789',

      fontSize: 13,

      fontWeight:
        '700',
    },
  });

export default styles;