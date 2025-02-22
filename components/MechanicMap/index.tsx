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
import Countdown from '../Countdown';

import { getDistance } from 'geolib'; // Import geolib for distance calculation
import clsx from 'clsx';
import {
  useGetMechanicByUserId,
  useJobRequestByMechanicId,
} from '@/hooks/services/mechanics/useGetMechanicByUserId';
import GlobeLoader from '../GlobeLoader';
import { useCompleteJob } from '@/hooks/services/mechanics/useCompleteJob';
import { useGetJobById } from '@/hooks/services/jobs/useGetJob';
import { ADO_REGION } from '@/constants/consts';

export default function MechanicMapComponent() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState(ADO_REGION);

  const { setLocation: setMechanicLocation } = useUserLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [radius, setRadius] = useState<number>(2000);
  const [distance, setDistance] = useState<number | null>(null);
  const { user } = useUserStore();

  const { data } = useGetMechanicByUserId(Number(user.id));
  console.log(data);
  const {
    data: jobRequestLocation,
    isLoading: isJobRequestForMechanicLoading,
  } = useJobRequestByMechanicId(Number(data?.mechanicId));

  const updateMechanicLocation = async () => {
    try {
      setIsLoading(true);
      const userId = user?.id;
      if (!userId) throw new Error('User ID is missing.');

      await fetchAPI(`users/user-location?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        }),
      });
    } catch (error) {
      console.error(
        'Error updating user location or fetching mechanics:',
        error,
      );
      setErrorMsg('Unable to update location or fetch nearby mechanics.');
    } finally {
      setIsLoading(false);
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
          status: status,
          jobRequestId: String(jobRequestLocation?.id),
          mechanicId: 17,
        }),
      });

      console.log('resp===>', response);

      if (response.jobRequest[0].status === 'ON_THE_WAY') {
        Alert.alert('Job Accepted');
      }
      if (response.jobRequest[0].status === 'ACCEPTED') {
        Alert.alert('Job Accepted');
      }

      // setJobRequestLocation(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(
        'Error updating user location or fetching mechanics:',
        error,
      );
      setErrorMsg('Unable to update location or fetch nearby mechanics.');
    } finally {
      setIsLoading(false);
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
      await updateMechanicLocation();
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (jobRequestLocation?.location && location) {
      const userCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const mechanicCoordinates = {
        latitude: Number(jobRequestLocation?.location.latitude),
        longitude: Number(jobRequestLocation?.location.longitude),
      };

      const calculatedDistance = getDistance(
        userCoordinates,
        mechanicCoordinates,
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
        latitude: Number(jobRequestLocation?.location.latitude),
        longitude: Number(jobRequestLocation?.location.longitude),
      };

      mapRef.current.fitToCoordinates([userCoordinates, jobRequestCoordinate], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [jobRequestLocation, location]);

  console.log('jobRequestLocation', jobRequestLocation);
  const handleCountdownEnd = () => {
    console.log('Countdown ended, triggering reassignment logic....');
  };

  const handleStop = () => {
    console.log('Timer stopped, triggering reassignment logic...');
  };

  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    if (jobRequestLocation?.status === 'ON_THE_WAY') {
      setStartCounter(true);
    } else {
      setStartCounter(false);
    }
  }, [jobRequestLocation?.status]);

  const { mutate } = useCompleteJob();
  const { data: jobById, isLoading: isJobLoading } = useGetJobById(8);

  if (isJobRequestForMechanicLoading || isJobLoading) {
    return <GlobeLoader />;
  }

  console.log('jobRequestLocation?.status===>', jobRequestLocation?.status);
  console.log('jobById ==', jobById);

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
        {jobRequestLocation?.status === 'NOTIFYING' ? (
          <View
            className={clsx(
              jobRequestLocation?.status === 'ON_THE_WAY' ? 'hidden' : '',
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
                jobRequestLocation?.status === 'ON_THE_WAY' ? 'none' : 'flex',
            }}
          >
            <Text>Job is {distance} km away</Text>
            <Text>Do you want to accept the job?</Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                acceptOrDecline(
                  jobRequestLocation?.status === 'ON_THE_WAY'
                    ? 'ACCEPTED'
                    : 'ON_THE_WAY',
                )
              }
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {jobRequestLocation?.status === 'ON_THE_WAY' && (
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
            <Text>Hooray, you're on your way to work </Text>
            <Text>Start job once you arrive destination</Text>
            <Countdown
              minutes={10} // Start with 10 minutes
              onCountdownEnd={handleCountdownEnd}
              onStop={handleStop}
              startCounter={startCounter}
            />
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                acceptOrDecline(
                  jobRequestLocation?.status === 'ON_THE_WAY'
                    ? 'ACCEPTED'
                    : 'ON_THE_WAY',
                )
              }
            >
              <Text style={styles.buttonText}>Arrived Destination</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.buttonText}>Declined</Text>
            </TouchableOpacity>
          </View>
        )}

        {jobById?.job.status !== 'COMPLETED' &&
          jobRequestLocation?.status === 'ACCEPTED' && (
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
              <Text>IN PROGRESS.... cos the job is now started </Text>

              {!jobById?.job.isApproved && (
                <>
                  <Countdown
                    minutes={10} // Start with 10 minutes
                    onCountdownEnd={handleCountdownEnd}
                    onStop={handleStop}
                    startCounter={startCounter}
                  />
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptOrDecline('ON_THE_WAY')}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </>
              )}

              {jobById?.job.isApproved && (
                <TouchableOpacity
                  onPress={() => mutate(8)}
                  className="p-4 bg-primary-500 "
                >
                  <Text className="text-white font-JakartaExtraBold">
                    {' '}
                    Complete Job
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title={'Your Location (mechanic)'}
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
                latitude: Number(jobRequestLocation?.location?.latitude),
                longitude: Number(jobRequestLocation?.location?.longitude),
              }}
              title="Job Location"
              description="Client location"
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
              latitude: Number(jobRequestLocation?.location.latitude),
              longitude: Number(jobRequestLocation?.location.longitude),
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
                longitude: Number(jobRequestLocation?.location?.longitude),
                latitude: Number(jobRequestLocation?.location?.latitude),
              },
            ]}
            strokeColor="green"
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
