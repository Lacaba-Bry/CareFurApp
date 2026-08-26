import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';

import styles from '../assets/css/RoomsStyles';

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

type RoomData = {
  id: string;

  room_number?: string | null;

  room_name?: string | null;

  capacity?: number | null;

  status?: string | null;

  occupied?: boolean;

  available?: boolean;
};

export default function Rooms({
  navigation,
}: any) {
  const [
    fontsLoaded,
  ] =
    useFonts({
      DancingScript_700Bold,
    });

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      startOfDay(
        new Date()
      )
    );

  const [
    rooms,
    setRooms,
  ] =
    useState<
      RoomData[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  // ============================================================
  // LOAD ROOM AVAILABILITY
  // ============================================================

  const loadRooms =
    useCallback(
      async () => {
        try {
          setError(
            null
          );

          const savedCode =
            await AsyncStorage.getItem(
              BOARDING_CODE_STORAGE_KEY
            );

          if (
            !savedCode
          ) {
            throw new Error(
              'No active boarding access code was found.'
            );
          }

          const dateKey =
            getDateKey(
              selectedDate
            );

          console.log(
            'Checking rooms for:',
            dateKey
          );

          const {
            data,
            error:
              functionError,
          } =
            await supabase.functions.invoke(
              'get-room-availability',
              {
                body: {
                  code:
                    savedCode,

                  date:
                    dateKey,
                },
              }
            );

          if (
            functionError
          ) {
            console.error(
              'Room availability function error:',
              functionError
            );

            throw new Error(
              functionError.message ||
                'Unable to load room availability.'
            );
          }

          if (
            !data
          ) {
            throw new Error(
              'No response was received from Supabase.'
            );
          }

          if (
            data.error
          ) {
            throw new Error(
              data.error
            );
          }

          setRooms(
            data.rooms ??
              []
          );

          console.log(
            'ROOM AVAILABILITY LOADED'
          );

          console.log(
            'Date:',
            data.date
          );

          console.log(
            'Occupied IDs:',
            data.occupiedRoomIds
          );

          console.log(
            'Rooms:',
            data.rooms
          );
        } catch (
          err: any
        ) {
          console.error(
            'Rooms load error:',
            err
          );

          setError(
            err?.message ||
              'Unable to load rooms.'
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      [
        selectedDate,
      ]
    );

  // ============================================================
  // INITIAL LOAD / DATE CHANGE
  // ============================================================

  useEffect(() => {
    setLoading(
      true
    );

    loadRooms();
  }, [
    loadRooms,
  ]);

  // ============================================================
  // REFRESH
  // ============================================================

  const onRefresh =
    () => {
      setRefreshing(
        true
      );

      loadRooms();
    };

  // ============================================================
  // ROOM PAGES
  // ============================================================

  const pageOneRooms =
    useMemo(
      () =>
        rooms.slice(
          0,
          10
        ),
      [
        rooms,
      ]
    );

  const pageTwoRooms =
    useMemo(
      () =>
        rooms.slice(
          10,
          15
        ),
      [
        rooms,
      ]
    );

  const goLeft =
    () => {
      setPage(
        1
      );
    };

  const goRight =
    () => {
      if (
        pageTwoRooms.length >
        0
      ) {
        setPage(
          2
        );
      }
    };

  // ============================================================
  // DATE NAVIGATION
  // ============================================================

  const goToPreviousDay =
    () => {
      const previous =
        new Date(
          selectedDate
        );

      previous.setDate(
        previous.getDate() -
          1
      );

      if (
        isPastDate(
          previous
        )
      ) {
        return;
      }

      setSelectedDate(
        startOfDay(
          previous
        )
      );

      setPage(
        1
      );
    };

  const goToNextDay =
    () => {
      const next =
        new Date(
          selectedDate
        );

      next.setDate(
        next.getDate() +
          1
      );

      setSelectedDate(
        startOfDay(
          next
        )
      );

      setPage(
        1
      );
    };

  const selectDate =
    (
      date:
        Date
    ) => {
      if (
        isPastDate(
          date
        )
      ) {
        return;
      }

      setSelectedDate(
        startOfDay(
          date
        )
      );

      setPage(
        1
      );
    };

  const canGoPrevious =
    !isToday(
      selectedDate
    );

  // ============================================================
  // FONT
  // ============================================================

  if (
    !fontsLoaded
  ) {
    return null;
  }

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
          />
        }
      >
        <View
          style={
            styles.content
          }
        >
          {/* HEADER */}

          <View
            style={
              styles.header
            }
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={() =>
                navigation.goBack()
              }
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color="#111"
              />
            </TouchableOpacity>

            <View
              style={
                styles.titleContainer
              }
            >
              <Text
                style={
                  styles.title
                }
              >
                Slot
              </Text>

              <Text
                style={
                  styles.title
                }
              >
                Availability
              </Text>
            </View>
          </View>

          {/* DATE */}

          <View
            style={
              styles.dateRow
            }
          >
            <TouchableOpacity
              disabled={
                !canGoPrevious
              }
              onPress={
                goToPreviousDay
              }
              style={{
                opacity:
                  canGoPrevious
                    ? 1
                    : 0.25,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color="#111"
              />
            </TouchableOpacity>

            <View>
              <Text
                style={
                  styles.dateBold
                }
              >
                {formatShortDate(
                  selectedDate
                )}
              </Text>

              <Text
                style={
                  styles.dateNormal
                }
              >
                {formatWeekDay(
                  selectedDate
                )}
              </Text>
            </View>

            <TouchableOpacity
              onPress={
                goToNextDay
              }
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#111"
              />
            </TouchableOpacity>
          </View>

          {/* WEEK */}

          <View
            style={
              styles.weekRow
            }
          >
            {getWeek(
              selectedDate
            ).map(
              (
                date
              ) => {
                const disabled =
                  isPastDate(
                    date
                  );

                return (
                  <Day
                    key={
                      date.toISOString()
                    }
                    day={
                      getDayLetter(
                        date
                      )
                    }
                    number={
                      String(
                        date.getDate()
                      )
                    }
                    active={
                      isSameDay(
                        date,
                        selectedDate
                      )
                    }
                    disabled={
                      disabled
                    }
                    onPress={() =>
                      selectDate(
                        date
                      )
                    }
                  />
                );
              }
            )}
          </View>

          {/* ERROR */}

          {error ? (
            <Text
              style={{
                color:
                  '#D06435',

                fontSize:
                  12,

                marginTop:
                  8,
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* ROOM AREA */}

          {loading ? (
            <View
              style={{
                paddingVertical:
                  50,

                alignItems:
                  'center',
              }}
            >
              <ActivityIndicator
                size="large"
                color="#14646B"
              />

              <Text
                style={{
                  marginTop:
                    10,

                  color:
                    '#14646B',
                }}
              >
                Loading rooms...
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.roomArea
              }
            >
              {page ===
              1 ? (
                <>
                  {/* TOP 5 ROOMS */}

                  <View
                    style={
                      styles.topRoomRow
                    }
                  >
                    {Array.from({
                      length:
                        5,
                    }).map(
                      (
                        _,
                        index
                      ) => {
                        const room =
                          pageOneRooms[
                            index
                          ];

                        return (
                          <RoomBox
                            key={
                              room?.id ??
                              `top-${index}`
                            }
                            title="Room"
                            number={
                              room?.room_number ??
                              '—'
                            }
                            color={
                              getRoomColor(
                                index
                              )
                            }
                            occupied={
                              Boolean(
                                room?.occupied
                              )
                            }
                          />
                        );
                      }
                    )}
                  </View>

                  {/* PLAYING AREA */}

                  <View
                    style={
                      styles.playArea
                    }
                  >
                    <Text
                      style={
                        styles.playText
                      }
                    >
                      Playing
                    </Text>

                    <Text
                      style={
                        styles.playText
                      }
                    >
                      Area
                    </Text>
                  </View>

                  {/* BOTTOM 5 */}

                  <View
                    style={
                      styles.bottomRoomRow
                    }
                  >
                    {Array.from({
                      length:
                        5,
                    }).map(
                      (
                        _,
                        index
                      ) => {
                        const room =
                          pageOneRooms[
                            index +
                              5
                          ];

                        return (
                          <RoomBox
                            key={
                              room?.id ??
                              `bottom-${index}`
                            }
                            title="Room"
                            number={
                              room?.room_number ??
                              '—'
                            }
                            color={
                              getRoomColor(
                                index +
                                  5
                              )
                            }
                            occupied={
                              Boolean(
                                room?.occupied
                              )
                            }
                          />
                        );
                      }
                    )}
                  </View>

                  {pageTwoRooms.length >
                  0 ? (
                    <TouchableOpacity
                      style={
                        styles.rightArrow
                      }
                      onPress={
                        goRight
                      }
                    >
                      <Ionicons
                        name="caret-forward"
                        size={34}
                        color="#D06435"
                      />
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : (
                <>
                  <View
                    style={
                      styles.houseTopRow
                    }
                  >
                    {pageTwoRooms
                      .slice(
                        0,
                        2
                      )
                      .map(
                        (
                          room
                        ) => (
                          <HouseRoom
                            key={
                              room.id
                            }
                            title={`Room ${
                              room.room_number ??
                              '—'
                            }`}
                            occupied={
                              Boolean(
                                room.occupied
                              )
                            }
                          />
                        )
                      )}
                  </View>

                  <View
                    style={
                      styles.houseBottomRow
                    }
                  >
                    {pageTwoRooms
                      .slice(
                        2,
                        5
                      )
                      .map(
                        (
                          room
                        ) => (
                          <HouseRoom
                            key={
                              room.id
                            }
                            title={`Room ${
                              room.room_number ??
                              '—'
                            }`}
                            occupied={
                              Boolean(
                                room.occupied
                              )
                            }
                          />
                        )
                      )}
                  </View>

                  <TouchableOpacity
                    style={
                      styles.leftArrow
                    }
                    onPress={
                      goLeft
                    }
                  >
                    <Ionicons
                      name="caret-back"
                      size={34}
                      color="#D06435"
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* LEGEND */}

          <View
            style={
              styles.legend
            }
          >
            <Text
              style={
                styles.legendTitle
              }
            >
              LEGEND:
            </Text>

            <View
              style={
                styles.legendRow
              }
            >
              <Ionicons
                name="paw"
                size={20}
                color="#111"
              />

              <Text
                style={
                  styles.legendText
                }
              >
                - Occupied
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}

      <View
        style={
          styles.bottomNav
        }
      >
        <NavButton
          icon="home"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Home',
              }
            )
          }
        />

        <NavButton
          icon="paw"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Pets',
              }
            )
          }
        />

        <NavButton
          icon="camera"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Camera',
              }
            )
          }
        />

        <NavButton
          icon="nutrition"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Care',
              }
            )
          }
        />

        <NavButton
          icon="person"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Profile',
              }
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

function Day({
  day,
  number,
  active =
    false,
  disabled =
    false,
  onPress,
}: {
  day:
    string;

  number:
    string;

  active?:
    boolean;

  disabled?:
    boolean;

  onPress?:
    () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.dayItem,

        disabled && {
          opacity:
            0.25,
        },
      ]}
      onPress={
        onPress
      }
      disabled={
        disabled
      }
      activeOpacity={
        disabled
          ? 1
          : 0.7
      }
    >
      <Text
        style={
          styles.dayText
        }
      >
        {day}
      </Text>

      <View
        style={[
          styles.dayCircle,

          active &&
            styles.dayCircleActive,
        ]}
      >
        <Text
          style={
            styles.dayNumber
          }
        >
          {number}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function RoomBox({
  title,
  number,
  color,
  occupied =
    false,
}: {
  title:
    string;

  number:
    string;

  color:
    string;

  occupied?:
    boolean;
}) {
  return (
    <View
      style={[
        styles.roomBox,

        {
          backgroundColor:
            color,
        },
      ]}
    >
      <Text
        style={
          styles.roomTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.roomNumber
        }
      >
        {number}
      </Text>

      {occupied && (
        <Ionicons
          name="paw"
          size={28}
          color="#111"
          style={
            styles.occupiedIcon
          }
        />
      )}
    </View>
  );
}

function HouseRoom({
  title,
  occupied =
    false,
}: {
  title:
    string;

  occupied?:
    boolean;
}) {
  return (
    <View
      style={
        styles.houseRoom
      }
    >
      <Text
        style={
          styles.houseTitle
        }
      >
        {title}
      </Text>

      <View
        style={
          styles.houseDoor
        }
      />

      <View
        style={
          styles.houseBed
        }
      />

      {occupied && (
        <Ionicons
          name="paw"
          size={28}
          color="#111"
          style={
            styles.houseOccupied
          }
        />
      )}
    </View>
  );
}

function NavButton({
  icon,
  onPress,
}: {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >['name'];

  onPress:
    () => void;
}) {
  return (
    <TouchableOpacity
      style={
        styles.navButton
      }
      onPress={
        onPress
      }
    >
      <Ionicons
        name={icon}
        size={23}
        color="#FFF"
      />
    </TouchableOpacity>
  );
}

// ============================================================
// DATE HELPERS
// ============================================================

function startOfDay(
  date:
    Date
) {
  const value =
    new Date(
      date
    );

  value.setHours(
    0,
    0,
    0,
    0
  );

  return value;
}

function isPastDate(
  date:
    Date
) {
  const today =
    startOfDay(
      new Date()
    );

  const target =
    startOfDay(
      date
    );

  return (
    target.getTime() <
    today.getTime()
  );
}

function isToday(
  date:
    Date
) {
  return isSameDay(
    date,
    new Date()
  );
}

function getDateKey(
  date:
    Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}-${day}`;
}

// ============================================================
// ROOM COLORS
// ============================================================

function getRoomColor(
  index:
    number
) {
  const colors = [
    '#F5E96B',
    '#9BD4E1',
    '#9BD4E1',
    '#FFF99B',
    '#FFF45A',
    '#FFFFFF',
    '#F26352',
    '#9DD7E2',
    '#E8825C',
    '#FFFFFF',
  ];

  return (
    colors[
      index %
        colors.length
    ] ||
    '#FFFFFF'
  );
}

// ============================================================
// WEEK
// ============================================================

function getWeek(
  selected:
    Date
) {
  const date =
    new Date(
      selected
    );

  const currentDay =
    date.getDay();

  const sunday =
    new Date(
      date
    );

  sunday.setDate(
    date.getDate() -
      currentDay
  );

  return Array.from({
    length:
      7,
  }).map(
    (
      _,
      index
    ) => {
      const day =
        new Date(
          sunday
        );

      day.setDate(
        sunday.getDate() +
          index
      );

      return day;
    }
  );
}

function getDayLetter(
  date:
    Date
) {
  const names = [
    'S',
    'M',
    'T',
    'W',
    'TH',
    'F',
    'S',
  ];

  return (
    names[
      date.getDay()
    ] ||
    ''
  );
}

function isSameDay(
  a:
    Date,

  b:
    Date
) {
  return (
    a.getFullYear() ===
      b.getFullYear() &&
    a.getMonth() ===
      b.getMonth() &&
    a.getDate() ===
      b.getDate()
  );
}

// ============================================================
// FORMAT DATE
// ============================================================

function formatShortDate(
  date:
    Date
) {
  return date.toLocaleDateString(
    'en-GB',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        '2-digit',
    }
  );
}

function formatWeekDay(
  date:
    Date
) {
  return date.toLocaleDateString(
    'en-US',
    {
      weekday:
        'long',
    }
  );
}