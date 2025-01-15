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
import * as Location from 'expo-location';
import { useUserLocationStore } from '../../store/location/location';
import { fetchAPI } from '@/lib/fetch';
import { useUserStore } from '@/store/auth/get-user';
import Ionicons from '@expo/vector-icons/Ionicons';
import Countdown from '../Countdown';

import { getDistance } from 'geolib'; // Import geolib for distance calculation

export default function MechanicMapComponent() {
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

  const { setLocation: setMechanicLocation } = useUserLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [radius, setRadius] = useState<number>(2000);
  const [jobRequestLocation, setJobRequestLocation] = useState({});

  const [nearbyMechanics, setNearbyMechanics] = useState<
    Array<{ lng: string; lat: string; id: string }>
  >([]);
  const { user } = useUserStore();

  const updateUserLocation = async (lat: number, long: number) => {
    try {
      setIsLoading(true);
      const userId = user?.id;
      if (!userId) throw new Error('User ID is missing.');

      const response = await fetchAPI(`jobRequests/17`, {
        headers: { 'Content-Type': 'application/json' },
      });

      setJobRequestLocation(response);

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
      setMechanicLocation({
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

  const [distance, setDistance] = useState<number | null>(null); // State for distance

  useEffect(() => {
    if (jobRequestLocation && location) {
      if (jobRequestLocation?.location?.latitude) {
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(jobRequestLocation?.location?.latitude),
          longitude: parseFloat(jobRequestLocation?.location?.latitude),
        };

        // Calculate the distance using geolib
        const calculatedDistance = getDistance(
          userCoordinates,
          mechanicCoordinates
        ); // Returns distance in meters
        setDistance(calculatedDistance / 1000); // Convert to kilometers
      }
    }
  }, [jobRequestLocation, location, nearbyMechanics]);

  useEffect(() => {
    if (jobRequestLocation && location) {
      if (jobRequestLocation?.location?.latitude) {
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const mechanicCoordinates = {
          latitude: parseFloat(jobRequestLocation?.location?.latitude),
          longitude: parseFloat(jobRequestLocation?.location?.latitude),
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

  //TODO: Timer is not controlled by user cos that stops when the mech approves or rejects a job
  // TODO: When the timer stops, ensure the job request pane is opened and a message is displayed "Select another mechanic, we should have cancel later"

  const mapRef = useRef<any>(undefined);

  useEffect(() => {
    if (mapRef.current && jobRequestLocation) {
      if (location) {
        // Coordinates for both user and mechanic
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const jobRequestCoordinate = {
          latitude: parseFloat(jobRequestLocation?.location?.latitude),
          longitude: parseFloat(jobRequestLocation?.location?.longitude),
        };

        // Fit the map to both the user and mechanic locations
        mapRef.current.fitToCoordinates(
          [userCoordinates, jobRequestCoordinate],
          {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          }
        );
      }
    }
  }, [nearbyMechanics, jobRequestLocation, location]);

  console.log('location', location);

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
        {jobRequestLocation && (
          <View style={styles.cunt}>
            <Text>
              Waiting for Mechanic name to accept job from {distance} km away
            </Text>
            <View className="flex flex-row items-center">
              <Text>Do you want to accept the job?</Text>

              <TouchableOpacity className="bg-green-600 p-4 ">
                <Text className="text-white font-JakartaBold p-4">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-600 text-white font-JakartaBold p-4">
                <Text className="bg-red-600 text-white font-JakartaBold p-4">
                  No
                </Text>
              </TouchableOpacity>
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
              title="Your Location (mechanic)"
              description="You are here"
              pinColor="green"
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

            {true ? (
              <Marker
                // identifier={jobRequestLocation}
                // key={mechanic.id}
                coordinate={{
                  latitude: jobRequestLocation?.location?.latitude,
                  longitude: jobRequestLocation?.location?.longitude,
                }}
                title={`Job`}
                description="Nearby User"
                pinColor={'black'}
              >
                <Callout>
                  <View>
                    <Text>User </Text>
                    <Text>User</Text>
                  </View>
                </Callout>
              </Marker>
            ) : (
              <Text>Loading...</Text>
            )}
          </>
        )}
        {/* Glowing Circle for Mechanic */}
        <Circle
          key={`mechanic`}
          center={{
            latitude: jobRequestLocation.location.latitude,
            longitude: jobRequestLocation.location.longitude,
          }}
          radius={10}
          strokeWidth={20}
          strokeColor="orange"
          fillColor="rgba(255, 165, 0, 0.2)" // Glowing effect
        />

        {/* Draw Line between User and Mechanic */}
        {location && jobRequestLocation && (
          <Polyline
            key="line"
            coordinates={[
              {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
              jobRequestLocation.location,
            ]}
            strokeColor="#FF0000"
            strokeWidth={10}
          >
            <View>
              <Text>{distance} meters</Text>
            </View>
          </Polyline>
        )}
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
