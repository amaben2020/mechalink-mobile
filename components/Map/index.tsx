import React, { useEffect, useRef, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
  Polyline,
} from 'react-native-maps';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { useUserLocationStore } from '../../store/location/location';
import { fetchAPI } from '@/lib/fetch';
import { useUserStore } from '@/store/auth/get-user';
import { useMechanicsStore } from '@/store/mechanics/mechanics';
import Ionicons from '@expo/vector-icons/Ionicons';
import Countdown from '../Countdown';
import { useJobRequestStore } from '@/store/jobRequests/jobRequest';
import { getDistance } from 'geolib';
import LottieView from 'lottie-react-native';
import { useGetNearbyMechanics } from '@/hooks/services/mechanics/useGetNearbyMechanics';
import { images } from '@/constants/Icons';

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

  const { user } = useUserStore();
  const userId = user?.id;
  const [isLoading, setIsLoading] = useState(true); // Initially loading
  const [radius, setRadius] = useState<number>(2000);
  const { setLocation: setUserLocation } = useUserLocationStore();
  const { setMechanics } = useMechanicsStore();
  const [distance, setDistance] = useState<number | null>(null);

  const {
    data,
    isLoading: isNearbyMechanicLoading,
    isError,
  } = useGetNearbyMechanics({
    radius,
    userId: String(userId),
  });

  const handleCountdownEnd = () => {
    console.log('Countdown ended, triggering reassignment logic...');
  };

  const handleStop = () => {
    console.log('Timer stopped, triggering reassignment logic...');
  };

  const [startCounter, setStartCounter] = useState(false);

  const { jobRequest } = useJobRequestStore();

  console.log('userId', userId);
  console.log(jobRequest);

  const userRequest = jobRequest.find(
    (request) => request.userId === Number(userId)
  );

  const updateUserLocation = async (lat: number, long: number) => {
    try {
      setIsLoading(true);
      if (!userId) throw new Error('User ID is missing.');

      await fetchAPI(`users/user-location?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: long }),
      });
    } catch (error) {
      console.error('Error updating user location:', error);
      setErrorMsg('Unable to update location or fetch nearby mechanics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
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
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Unable to fetch location.');
      }
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userRequest?.mechanicId && location) {
      const selectedMechanic = data?.nearbyMechs.find(
        (mechanic) => mechanic.mechanicId == String(userRequest?.mechanicId)
      );

      console.log('selectedMechanic', selectedMechanic);

      if (selectedMechanic) {
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(selectedMechanic.lat),
          longitude: parseFloat(selectedMechanic.lng),
        };

        //Calculate the distance using geolib
        const calculatedDistance = getDistance(
          userCoordinates,
          mechanicCoordinates
        ); // Returns distance in meters
        setDistance(calculatedDistance); //Convert to kilometers
      }
    }
  }, [userRequest?.mechanicId, location, data?.nearbyMechs]);

  useEffect(() => {
    if (data?.nearbyMechs.length! > 0 && !isLoading) {
      setMechanics(data?.nearbyMechs!);
    }
  }, [data?.nearbyMechs.length]);

  useEffect(() => {
    if (userRequest?.id) {
      setStartCounter(true);
    } else {
      setStartCounter(false);
    }
  }, [userRequest?.id]);

  const mapRef = useRef<any>(undefined);

  useEffect(() => {
    if (mapRef.current && userRequest?.mechanicId) {
      const selectedMechanic = data?.nearbyMechs.find(
        (mechanic) => mechanic.mechanicId == String(userRequest?.mechanicId)
      );

      console.log('selectedMechanic', selectedMechanic);

      if (selectedMechanic?.id && location) {
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
  }, [data?.nearbyMechs, userRequest?.mechanicId, location]);

  if (isLoading || isNearbyMechanicLoading) {
    return (
      <View style={styles.loadingContainer}>
        //TODO: move to component
        <LottieView
          source={require('./../../assets/globe.json')}
          autoPlay
          loop
          style={{
            height: 250,
            width: 500,
          }}
        />
        <Text className="text-white font-JakartaBold text-lg flex items-center">
          Loading map data... <ActivityIndicator size="large" color="#fff" />
        </Text>
      </View>
    );
  }

  console.log('userRequest', userRequest);

  if (errorMsg || isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        region={region}
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        showsUserLocation
        showsPointsOfInterest={false}
        zoomEnabled
      >
        {userRequest?.id && userRequest?.status === 'ON_THE_WAY' && (
          <View className="text-white">
            <Text>Mechanic {distance} meters away</Text>
            <View className="flex flex-row items-center border">
              <Ionicons name="time-sharp" size={40} color="white" />
              <Countdown
                minutes={10}
                onCountdownEnd={handleCountdownEnd}
                onStop={handleStop}
                startCounter={startCounter}
              />
            </View>
          </View>
        )}

        {userRequest?.status === 'NOTIFYING' && (
          <View className="flex flex-col gap-2 mb-20">
            <LottieView
              source={require('./../../assets/l-r.json')}
              autoPlay
              loop
              style={{
                height: 250,
                width: 500,
              }}
            />

            <Text className="font-JakartaBold text-white text-center">
              Waiting for request to be accepted by mechanic...
            </Text>
          </View>
        )}

        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              pinColor="green"
              title="Your Location"
              description="You are here"
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
            {data?.nearbyMechs.map((mechanic) => (
              <Marker
                tracksViewChanges
                // image={
                //   Number(mechanic.mechanicId) === userRequest?.mechanicId!
                //     ? images.mechanicAvatar
                //     : ''
                // }
                key={mechanic.id}
                coordinate={{
                  latitude: parseFloat(mechanic.lat),
                  longitude: parseFloat(mechanic.lng),
                }}
                title={`Mechanic ${mechanic.id}`}
                description="Nearby Mechanic"
                pinColor={
                  Number(mechanic.mechanicId) === userRequest?.mechanicId!
                    ? 'yellow'
                    : 'blue'
                }
              />

              //    <Image
              //     source={
              //       Number(mechanic.mechanicId) === userRequest?.mechanicId!
              //         ? images.mechanicAvatar
              //         : ''
              //     }
              //     style={{ width: 48, height: 48, resizeMode: 'contain' }}
              //     className="w-20 h-20"
              //   />
              // </Marker>
            ))}
          </>
        )}

        {/* Draw Line between User and Mechanic */}
        {userRequest?.mechanicId &&
          data?.nearbyMechs.map((mechanic) => {
            if (mechanic?.mechanicId === userRequest?.mechanicId) {
              const mechanicCoords = {
                latitude: parseFloat(mechanic.lat),
                longitude: parseFloat(mechanic.lng),
              };

              const userCoords = {
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
              };

              if (!mechanicCoords.latitude) return null;

              return (
                <Polyline
                  key="line"
                  coordinates={[userCoords, mechanicCoords]}
                  strokeColor="#00FF00"
                  strokeWidth={10}
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
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
});
