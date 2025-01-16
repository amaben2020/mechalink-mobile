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
  Alert,
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
import clsx from 'clsx';

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
  const [jobRequestLocation, setJobRequestLocation] = useState<any>({});

  const [nearbyMechanics, setNearbyMechanics] = useState<
    Array<{ lng: string; lat: string; id: string }>
  >([]);
  const { user } = useUserStore();

  const updateUserLocation = async (latitude: number, longitude: number) => {
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

  const acceptOrDecline = async (status: string) => {
    try {
      setIsLoading(true);
      const userId = user?.id;
      if (!userId) throw new Error('User ID is missing.');

      const response = await fetchAPI(`jobRequests/mechanic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ON_THE_WAY',
          jobRequestId: String(jobRequestLocation?.id),
          mechanicId: 17,
        }),
      });

      console.log('resp', response);

      if (response.jobRequest[0].status === 'ON_THE_WAY') {
        Alert.alert('Job Accepted');
      }

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

  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (jobRequestLocation?.location && location) {
      const userCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const mechanicCoordinates = {
        latitude: parseFloat(jobRequestLocation.location.latitude),
        longitude: parseFloat(jobRequestLocation.location.longitude),
      };

      const calculatedDistance = getDistance(
        userCoordinates,
        mechanicCoordinates
      );
      setDistance(calculatedDistance / 1000);
    }
  }, [jobRequestLocation, location]);

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (mapRef.current && jobRequestLocation?.location && location) {
      const userCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const jobRequestCoordinate = {
        latitude: parseFloat(jobRequestLocation.location.latitude),
        longitude: parseFloat(jobRequestLocation.location.longitude),
      };

      mapRef.current.fitToCoordinates([userCoordinates, jobRequestCoordinate], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [nearbyMechanics, jobRequestLocation, location]);

  console.log('jobRequestLocation', jobRequestLocation);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.changeRadiusButton}
        onPress={() => setRadius(radius === 2000 ? 5000 : 2000)}
      >
        <Text style={styles.buttonText}>Change Radius</Text>
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        region={region}
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        showsUserLocation
        mapType={Platform.OS === 'android' ? 'standard' : 'mutedStandard'}
        showsPointsOfInterest={false}
        showsMyLocationButton
        userInterfaceStyle="dark"
        zoomEnabled
      >
        {jobRequestLocation.status === 'NOTIFYING' ? (
          <View
            className={clsx(
              jobRequestLocation.status === 'ON_THE_WAY' ? 'hidden' : ''
            )}
            style={{
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
              display:
                jobRequestLocation.status === 'ON_THE_WAY' ? 'none' : 'flex',
            }}
          >
            <Text>Job is {distance} km away</Text>
            <Text>Do you want to accept the job?</Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptOrDecline('ON_THE_WAY')}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {jobRequestLocation.status === 'ON_THE_WAY' && (
          <View
            style={{
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
            }}
          >
            <Text>Hooray, you;re on your way to work </Text>
            <Text>Start job once you arrive destination</Text>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptOrDecline('ON_THE_WAY')}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
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
            <Marker
              coordinate={{
                latitude: jobRequestLocation?.location?.latitude,
                longitude: jobRequestLocation?.location?.longitude,
              }}
              title="Job"
              description="Nearby User"
              pinColor="black"
            >
              <Callout>
                <View>
                  <Text>User</Text>
                </View>
              </Callout>
            </Marker>
          </>
        )}
        {jobRequestLocation?.location && (
          <Circle
            center={{
              latitude: parseFloat(jobRequestLocation.location.latitude),
              longitude: parseFloat(jobRequestLocation.location.longitude),
            }}
            radius={10}
            strokeWidth={20}
            strokeColor="orange"
            fillColor="rgba(255, 165, 0, 0.2)"
          />
        )}
        {location && jobRequestLocation?.location && (
          <Polyline
            coordinates={[
              {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
              {
                longitude: parseFloat(jobRequestLocation.location.longitude),
                latitude: parseFloat(jobRequestLocation.location.latitude),
              },
            ]}
            strokeColor="#FF0000"
            strokeWidth={10}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  changeRadiusButton: {
    position: 'absolute',
    top: '30%',
    left: 10,
    zIndex: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
