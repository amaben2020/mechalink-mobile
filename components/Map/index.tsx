import React, { useEffect, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00FF00" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity className="text-red-800 absolute top-[30%] left-2 z-10 bg-green-600 h-10">
        {' '}
        Change Radius
      </TouchableOpacity>
      <MapView
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
              nearbyMechanics?.map((mechanic) => {
                return (
                  <>
                    <Marker
                      key={Number(mechanic.id)}
                      coordinate={{
                        latitude: parseFloat(mechanic.lat),
                        longitude: parseFloat(mechanic.lng),
                      }}
                      title={`Mechanic ${mechanic?.id + 1}`}
                      description="Nearby Mechanic"
                      pinColor="green"
                    />
                    {/* <Callout>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>
                          Mechanic {mechanic?.id + 1}
                        </Text>
                        <Text style={styles.calloutDescription}>
                          Nearby Mechanic
                        </Text>
                      </View>
                    </Callout> */}
                  </>
                );
              })
            ) : (
              <Text>Loading...</Text>
            )}
          </>
        )}
      </MapView>
      {/* TODO: readd radius picker later */}
      {/* <View style={styles.radiusPickerContainer}>
        <Text style={styles.radiusLabel}>Change Search Radius:</Text>
        <Picker
          selectedValue={radius}
          style={styles.picker}
          onValueChange={(itemValue) => radiusChangeHandler(Number(itemValue))}
        >
          <Picker.Item label="500m" value="500" />
          <Picker.Item label="1Km" value="1000" />
          <Picker.Item label="2Km" value="2000" />
          <Picker.Item label="5Km" value="5000" />
        </Picker>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  radiusPickerContainer: {
    position: 'absolute',
    bottom: 320,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  calloutContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
  },
});
