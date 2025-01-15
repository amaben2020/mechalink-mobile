import React, { useEffect, useRef, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
  Callout,
  Polyline,
} from 'react-native-maps';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useUserLocationStore } from '../../store/location/location';
import { fetchAPI } from '@/lib/fetch';
import { useUserStore } from '@/store/auth/get-user';
import { useMechanicsStore } from '@/store/mechanics/mechanics';
import Ionicons from '@expo/vector-icons/Ionicons';
import Countdown from '../Countdown';
import { useJobRequestStore } from '@/store/jobRequests/jobRequest';
import { getDistance } from 'geolib'; // Import geolib for distance calculation

// todo: ensure the selected mech is animated with the others removed
// lets have the polygon glowing
// put a start/stop timer
// ensure the mech details can be viewed (Callout (use placeholders for Chat and Video call))

// export default function MapComponent() {
//   const [location, setLocation] = useState<Location.LocationObject | null>(
//     null
//   );
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [region, setRegion] = useState({
//     latitude: 9.0563,
//     longitude: 7.4985,
//     latitudeDelta: 0.9,
//     longitudeDelta: 0.8,
//   });

//   const { setLocation: setUserLocation } = useUserLocationStore();

//   const [isLoading, setIsLoading] = useState(false);

//   const [radius, setRadius] = useState<number>(2000);

//   const { setMechanics } = useMechanicsStore();

//   const [nearbyMechanics, setNearbyMechanics] = useState<
//     Array<{ lng: string; lat: string; id: string }>
//   >([]);

//   const { user } = useUserStore();

//   const { jobRequest } = useJobRequestStore();

//   console.log('job request', jobRequest);

//   const updateUserLocation = async (lat: number, long: number) => {
//     try {
//       setIsLoading(true);
//       const userId = user?.id;
//       if (!userId) throw new Error('User ID is missing.');

//       await fetchAPI(`users/user-location?userId=${userId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ latitude: lat, longitude: long }),
//       });

//       const mechanicsResponse = await fetchAPI(
//         `nearby-mechanics?radius=${radius}&userId=${userId}`
//       );

//       setNearbyMechanics(mechanicsResponse?.nearbyMechs || []);
//       setMechanics(mechanicsResponse?.nearbyMechs || []);
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//       console.error(
//         'Error updating user location or fetching mechanics:',
//         error
//       );
//       setErrorMsg('Unable to update location or fetch nearby mechanics.');
//     }
//   };

//   useEffect(() => {
//     async function getCurrentLocation() {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let loc = await Location.getCurrentPositionAsync({});

//       setLocation(loc);
//       setUserLocation({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });
//       setRegion({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         latitudeDelta: 0.02,
//         longitudeDelta: 0.02,
//       });
//       await updateUserLocation(loc.coords.latitude, loc.coords.longitude);
//     }

//     getCurrentLocation();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#00FF00" />
//         <Text>Loading map...</Text>
//       </View>
//     );
//   }

//   const handleCountdownEnd = () => {
//     console.log('Countdown ended, triggering reassignment logic...');
//     // Trigger the reassignment logic here
//   };

//   const handleStop = () => {
//     console.log('Timer stopped, triggering reassignment logic...');
//     // Trigger the reassignment logic here
//   };

//   const testReq = [
//     {
//       created_at: '2025-01-15T11:08:32.302Z',
//       created_by: '15',
//       distance: '7.8888,8.99999',
//       duration: '2 hours',
//       id: 37,
//       jobId: 8,
//       mechanicId: 17,
//       status: 'NOTIFYING',
//       updated_at: null,
//       updated_by: null,
//       userId: 15,
//     },
//   ];
//   const mapRef = useRef<any>(undefined);

//   const [startCounter, setStartCounter] = useState(false);

//   useEffect(() => {
//     if (testReq[0].id !== undefined) {
//       setStartCounter(true);
//     } else {
//       setStartCounter(false);
//     }
//   }, [testReq[0].id]);

//   // Call fitToSuppliedMarkers() method on the MapView after markers get updated
//   useEffect(() => {
//     if (mapRef.current) {
//       // list of _id's must same that has been provided to the identifier props of the Marker
//       mapRef.current.fitToSuppliedMarkers(
//         nearbyMechanics?.map(
//           (elem) => elem.mechanicId === testReq[0].mechanicId
//         )
//       );
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity className="text-red-800 absolute top-[30%] left-2 z-10 bg-green-600 h-10">
//         {' '}
//         Change Radius
//       </TouchableOpacity>
//       <MapView
//         ref={mapRef}
//         region={region}
//         style={styles.map}
//         provider={
//           Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
//         }
//         showsUserLocation
//         tintColor="black"
//         mapType={Platform.OS === 'android' ? 'standard' : 'mutedStandard'}
//         showsPointsOfInterest={false}
//         showsMyLocationButton
//         userInterfaceStyle="dark"
//         zoomEnabled
//       >
//         {testReq[0]?.id && (
//           <View style={styles.cunt}>
//             <Text>Waiting for Mechanic name to accept job</Text>
//             <View className="flex flex-row items-center border">
//               <Ionicons name="time-sharp" size={40} color="white" />
//               <Countdown
//                 minutes={10} // Start with 10 minutes
//                 onCountdownEnd={handleCountdownEnd}
//                 onStop={handleStop}
//                 startCounter={startCounter}
//               />
//             </View>
//           </View>
//         )}
//         {location && (
//           <>
//             <Marker
//               coordinate={{
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//               }}
//               title="Your Location"
//               description="You are here"
//               pinColor="blue"
//             />
//             <Circle
//               center={{
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//               }}
//               radius={radius}
//               strokeWidth={2}
//               strokeColor="#00FF00"
//               fillColor="rgba(201, 242, 155, 0.2)"
//             />

//             {!isLoading ? (
//               nearbyMechanics?.map((mechanic) => {
//                 console.log('MECH===>', mechanic);
//                 return (
//                   <>
//                     <Marker
//                       identifier={testReq[0].mechanicId}
//                       opacity={undefined}
//                       key={Number(mechanic.id)}
//                       coordinate={{
//                         latitude: parseFloat(mechanic.lat),
//                         longitude: parseFloat(mechanic.lng),
//                       }}
//                       title={`Mechanic ${mechanic?.id + 1}`}
//                       description="Nearby Mechanic"
//                       pinColor={
//                         mechanic.mechanicId === testReq[0].mechanicId
//                           ? 'orange'
//                           : 'black'
//                       }
//                     >
//                       <Callout className="p-10 z-10">
//                         <View className="p-10">
//                           <Text style={styles.calloutTitle}>
//                             Mechanic {mechanic?.id + 1}
//                           </Text>
//                           <Text style={styles.calloutDescription}>
//                             {mechanic?.mechanicId === testReq[0].mechanicId
//                               ? 'Selected'
//                               : 'Nearby'}{' '}
//                             Mechanic
//                           </Text>
//                         </View>
//                       </Callout>
//                     </Marker>
//                   </>
//                 );
//               })
//             ) : (
//               <Text>Loading...</Text>
//             )}
//           </>
//         )}
//       </MapView>
//       {/* TODO: readd radius picker later */}
//       {/* <View style={styles.radiusPickerContainer}>
//         <Text style={styles.radiusLabel}>Change Search Radius:</Text>
//         <Picker
//           selectedValue={radius}
//           style={styles.picker}
//           onValueChange={(itemValue) => radiusChangeHandler(Number(itemValue))}
//         >
//           <Picker.Item label="500m" value="500" />
//           <Picker.Item label="1Km" value="1000" />
//           <Picker.Item label="2Km" value="2000" />
//           <Picker.Item label="5Km" value="5000" />
//         </Picker>
//       </View> */}
//     </View>
//   );
// }

export default function MapComponent() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 9.0563,
    longitude: 7.4985,
    latitudeDelta: 0.9,
    longitudeDelta: 0.8,
  });

  const { setLocation: setUserLocation } = useUserLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [radius, setRadius] = useState<number>(2000);
  const { setMechanics } = useMechanicsStore();
  const [nearbyMechanics, setNearbyMechanics] = useState<
    Array<{ lng: string; lat: string; id: string }>
  >([]);
  const { user } = useUserStore();
  const { jobRequest } = useJobRequestStore();

  const updateUserLocation = async (lat: number, long: number) => {
    try {
      setIsLoading(true);
      const userId = user?.id;
      if (!userId) throw new Error('User ID is missing.');

      await fetchAPI(`users/user-location?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: long }),
      });

      const mechanicsResponse = await fetchAPI(
        `nearby-mechanics?radius=${radius}&userId=${userId}`
      );

      setNearbyMechanics(mechanicsResponse?.nearbyMechs || []);
      setMechanics(mechanicsResponse?.nearbyMechs || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(
        'Error updating user location or fetching mechanics:',
        error
      );
      setErrorMsg('Unable to update location or fetch nearby mechanics.');
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});

      setLocation(loc);
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      await updateUserLocation(loc.coords.latitude, loc.coords.longitude);
    }

    getCurrentLocation();
  }, []);
  const testReq = [
    {
      created_at: '2025-01-15T11:08:32.302Z',
      created_by: '15',
      distance: '7.8888,8.99999',
      duration: '2 hours',
      id: 37,
      jobId: 8,
      mechanicId: 17,
      status: 'NOTIFYING',
      updated_at: null,
      updated_by: null,
      userId: 15,
    },
  ];
  const [distance, setDistance] = useState<number | null>(null); // State for distance

  useEffect(() => {
    if (testReq[0]?.mechanicId && location) {
      const selectedMechanic = nearbyMechanics.find(
        (mechanic) => mechanic.mechanicId === testReq[0]?.mechanicId
      );

      if (selectedMechanic) {
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(selectedMechanic.lat),
          longitude: parseFloat(selectedMechanic.lng),
        };

        // Calculate the distance using geolib
        const calculatedDistance = getDistance(
          userCoordinates,
          mechanicCoordinates
        ); // Returns distance in meters
        setDistance(calculatedDistance / 1000); // Convert to kilometers
      }
    }
  }, [testReq[0]?.mechanicId, location, nearbyMechanics]);

  useEffect(() => {
    if (testReq[0]?.mechanicId && location) {
      const selectedMechanic = nearbyMechanics.find(
        (mechanic) => mechanic.mechanicId === testReq[0]?.mechanicId
      );

      if (selectedMechanic) {
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(selectedMechanic.lat),
          longitude: parseFloat(selectedMechanic.lng),
        };

        // Zoom to both user and mechanic
        mapRef.current.fitToCoordinates(
          [userCoordinates, mechanicCoordinates],
          {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          }
        );
      }
    }
  }, [nearbyMechanics, location]);

  const handleCountdownEnd = () => {
    console.log('Countdown ended, triggering reassignment logic...');
  };

  const handleStop = () => {
    console.log('Timer stopped, triggering reassignment logic...');
  };

  const [startCounter, setStartCounter] = useState(false);

  console.log(distance);

  useEffect(() => {
    if (testReq[0]?.id) {
      setStartCounter(true);
    } else {
      setStartCounter(false);
    }
  }, [testReq[0]?.id]);

  const mapRef = useRef<any>(undefined);

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.fitToSuppliedMarkers(
  //       nearbyMechanics.map(
  //         (elem) => elem.mechanicId === testReq[0]?.mechanicId
  //       )
  //     );
  //   }
  // }, [nearbyMechanics]);

  // useEffect(() => {
  //   if (mapRef.current && testReq[0]?.mechanicId) {
  //     const selectedMechanic = nearbyMechanics.find(
  //       (mechanic) => mechanic.mechanicId === testReq[0]?.mechanicId
  //     );

  //     if (selectedMechanic) {
  //       const coordinates = {
  //         latitude: parseFloat(selectedMechanic.lat),
  //         longitude: parseFloat(selectedMechanic.lng),
  //       };

  //       mapRef.current.fitToCoordinates([coordinates], {
  //         edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
  //         animated: true,
  //       });
  //     }
  //   }
  // }, [nearbyMechanics, testReq[0]?.mechanicId]);

  useEffect(() => {
    if (mapRef.current && testReq[0]?.mechanicId) {
      const selectedMechanic = nearbyMechanics.find(
        (mechanic) => mechanic.mechanicId === testReq[0]?.mechanicId
      );

      if (selectedMechanic && location) {
        // Coordinates for both user and mechanic
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(selectedMechanic.lat),
          longitude: parseFloat(selectedMechanic.lng),
        };

        // Fit the map to both the user and mechanic locations
        mapRef.current.fitToCoordinates(
          [userCoordinates, mechanicCoordinates],
          {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          }
        );
      }
    }
  }, [nearbyMechanics, testReq[0]?.mechanicId, location]);

  return (
    <View style={styles.container}>
      <TouchableOpacity className="text-red-800 absolute top-[30%] left-2 z-10 bg-green-600 h-10">
        Change Radius
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        region={region}
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        showsUserLocation
        tintColor="black"
        mapType={Platform.OS === 'android' ? 'standard' : 'mutedStandard'}
        showsPointsOfInterest={false}
        showsMyLocationButton
        userInterfaceStyle="dark"
        zoomEnabled
      >
        {testReq[0]?.id && (
          <View style={styles.cunt}>
            <Text>Waiting for Mechanic name to accept job</Text>
            <View className="flex flex-row items-center border">
              <Ionicons name="time-sharp" size={40} color="white" />
              <Countdown
                minutes={10} // Start with 10 minutes
                onCountdownEnd={handleCountdownEnd}
                onStop={handleStop}
                startCounter={startCounter}
              />
            </View>
          </View>
        )}
        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              description="You are here"
              pinColor="blue"
            />
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={radius}
              strokeWidth={2}
              strokeColor="#00FF00"
              fillColor="rgba(201, 242, 155, 0.2)"
            />

            {!isLoading ? (
              nearbyMechanics.map((mechanic) => {
                return (
                  <Marker
                    identifier={testReq[0]?.mechanicId}
                    key={mechanic.id}
                    coordinate={{
                      latitude: parseFloat(mechanic.lat),
                      longitude: parseFloat(mechanic.lng),
                    }}
                    title={`Mechanic ${mechanic?.id + 1}`}
                    description="Nearby Mechanic"
                    pinColor={
                      mechanic.mechanicId === testReq[0]?.mechanicId
                        ? 'orange'
                        : 'black'
                    }
                  >
                    <Callout>
                      <View>
                        <Text>Mechanic {mechanic?.id + 1}</Text>
                        <Text>
                          {mechanic?.mechanicId === testReq[0]?.mechanicId
                            ? 'Selected'
                            : 'Nearby'}{' '}
                          Mechanic
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                );
              })
            ) : (
              <Text>Loading...</Text>
            )}
          </>
        )}
        {/* Glowing Circle for Mechanic */}
        {testReq[0]?.mechanicId &&
          nearbyMechanics.map((mechanic) => {
            if (mechanic.mechanicId === testReq[0]?.mechanicId) {
              return (
                <Circle
                  key={`mechanic-${mechanic.id}`}
                  center={{
                    latitude: parseFloat(mechanic.lat),
                    longitude: parseFloat(mechanic.lng),
                  }}
                  radius={radius}
                  strokeWidth={2}
                  strokeColor="orange"
                  fillColor="rgba(255, 165, 0, 0.2)" // Glowing effect
                />
              );
            }
            return null;
          })}

        {/* Draw Line between User and Mechanic */}
        {location &&
          testReq[0]?.mechanicId &&
          nearbyMechanics.map((mechanic) => {
            if (mechanic.mechanicId === testReq[0]?.mechanicId) {
              const mechanicCoords = {
                latitude: parseFloat(mechanic.lat),
                longitude: parseFloat(mechanic.lng),
              };

              const userCoords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };

              return (
                <Polyline
                  key="line"
                  coordinates={[userCoords, mechanicCoords]}
                  strokeColor="#00FF00"
                  strokeWidth={3}
                >
                  <View>
                    <Text>{distance} meters</Text>
                  </View>
                </Polyline>
              );
            }
            return null;
          })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  cunt: {
    backgroundColor: '#FFA500',
    position: 'absolute',
    top: 50,
    left: '20%',
    transform: [{ translateX: -0.5 * (80 / 100) * 100 }],
    width: '60%',
    padding: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
