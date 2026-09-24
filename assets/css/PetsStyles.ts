import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } =
  Dimensions.get(
    'window'
  );

const isSmallPhone =
  width < 360;

const styles =
  StyleSheet.create({
    // ============================================================
    // SCREEN
    // ============================================================

    container: {
      flex: 1,
      backgroundColor:
        '#FFFDF8',
    },

    scrollView: {
      flex: 1,
    },

    content: {
      paddingHorizontal:
        isSmallPhone
          ? 16
          : 20,

      paddingTop: 8,

      // Space above bottom tab
      paddingBottom: 100,
    },

    // ============================================================
    // HEADER
    // ============================================================

    header: {
      height: 64,

      paddingHorizontal:
        isSmallPhone
          ? 16
          : 20,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      backgroundColor:
        '#FFFDF8',
    },

    backButton: {
      width: 40,
      height: 40,

      borderRadius: 20,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    title: {
      fontFamily:
        'DancingScript_700Bold',

      fontSize:
        isSmallPhone
          ? 31
          : 35,

      color:
        '#14646B',
    },

    headerSpacer: {
      width: 40,
    },

    // ============================================================
    // SECTION TITLE
    // ============================================================

    sectionTitle: {
      fontSize:
        isSmallPhone
          ? 22
          : 24,

      fontWeight:
        '700',

      color:
        '#173F43',

      marginBottom: 4,
    },

    sectionSubtitle: {
      fontSize:
        isSmallPhone
          ? 13
          : 14,

      lineHeight: 20,

      color:
        '#748789',

      marginBottom: 22,
    },

    // ============================================================
    // PET CARD
    // ============================================================

    petCard: {
      width: '100%',

      backgroundColor:
        '#FFFFFF',

      borderRadius: 22,

      padding:
        isSmallPhone
          ? 12
          : 14,

      flexDirection:
        'row',

      alignItems:
        'flex-start',

      borderWidth: 1,

      borderColor:
        '#E1EBEB',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.07,

      shadowRadius: 9,

      elevation: 3,
    },

    petImage: {
      width:
        isSmallPhone
          ? 88
          : 96,

      height:
        isSmallPhone
          ? 88
          : 96,

      borderRadius: 20,

      marginRight: 14,
    },

    petDetails: {
      flex: 1,
      minWidth: 0,
    },

    petTopRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    petName: {
      flexShrink: 1,

      fontSize:
        isSmallPhone
          ? 22
          : 24,

      fontWeight:
        '700',

      color:
        '#163F43',
    },

    // ============================================================
    // BASIC PET INFO
    // ============================================================

    petInfoRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      flexWrap:
        'wrap',

      marginTop: 8,
    },

    infoItem: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    infoText: {
      marginLeft: 5,

      fontSize:
        isSmallPhone
          ? 12
          : 13,

      fontWeight:
        '600',

      color:
        '#586B6D',
    },

    infoDivider: {
      width: 1,
      height: 15,

      backgroundColor:
        '#D9E3E3',

      marginHorizontal: 10,
    },

    // ============================================================
    // BREED
    // ============================================================

    breedRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 9,
    },

    breedText: {
      flex: 1,

      marginLeft: 5,

      fontSize:
        isSmallPhone
          ? 11
          : 12,

      color:
        '#7D8D8F',
    },

    // ============================================================
    // STATUS
    // ============================================================

    statusBadge: {
      alignSelf:
        'flex-start',

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 20,

      marginTop: 12,
    },

    statusDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      marginRight: 6,
    },

    statusText: {
      fontSize:
        isSmallPhone
          ? 10
          : 11,

      fontWeight:
        '700',
    },

    // ============================================================
    // DATES
    // ============================================================

    dateRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      flexWrap:
        'wrap',

      marginTop: 9,
    },

    dateLabel: {
      marginLeft: 5,

      marginRight: 5,

      fontSize:
        isSmallPhone
          ? 10
          : 11,

      color:
        '#819294',
    },

    dateValue: {
      fontSize:
        isSmallPhone
          ? 10
          : 11,

      fontWeight:
        '700',

      color:
        '#53686A',
    },

    // ============================================================
    // LOADING
    // ============================================================

    loadingContainer: {
      minHeight: 200,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    loadingText: {
      marginTop: 12,

      fontSize: 13,

      color:
        '#748789',
    },

    // ============================================================
    // EMPTY / ERROR
    // ============================================================

    emptyCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        '#E1EBEB',

      paddingHorizontal: 24,

      paddingVertical: 34,

      alignItems:
        'center',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.05,

      shadowRadius: 8,

      elevation: 2,
    },

    emptyIcon: {
      width: 64,
      height: 64,

      borderRadius: 32,

      backgroundColor:
        '#E7F4F4',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 14,
    },

    emptyTitle: {
      fontSize: 18,

      fontWeight:
        '700',

      color:
        '#163F43',

      marginBottom: 6,
    },

    emptyDescription: {
      textAlign:
        'center',

      fontSize: 13,

      lineHeight: 19,

      color:
        '#748789',

      marginBottom: 18,
    },

    retryButton: {
      minHeight: 42,

      paddingHorizontal: 18,

      borderRadius: 12,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#14646B',
    },

    retryText: {
      marginLeft: 7,

      fontSize: 13,

      fontWeight:
        '700',

      color:
        '#FFFFFF',
    },
    
  });

export default styles;