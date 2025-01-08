import React, { useEffect, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import { Platform, StyleSheet, View } from 'react-native';

import * as Location from 'expo-location';

export default function MapComponent() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 9.0563,
    longitude: 7.4985,
    latitudeDelta: 0.02,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Update map region to focus on user's location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05, // Smaller delta for a closer zoom
        longitudeDelta: 0.05,
      });
      // Start watching for location changes
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 10000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    }
    getCurrentLocation();

    // Cleanup subscription on component unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        style={{ width: 600, height: 700 }}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        tintColor="black"
        mapType={Platform.OS === 'android' ? 'standard' : 'mutedStandard'}
        showsPointsOfInterest={false}
        showsUserLocation
        showsMyLocationButton
        userInterfaceStyle="dark"
        zoomEnabled
      >
        {location && (
          <>
            <Marker
              pinColor="green"
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              description="You are here"
            />
            <Marker
              pinColor="green"
              coordinate={{
                latitude: 8.98,
                longitude: 7.6792,
              }}
              title="Your Location"
              description="You are here"
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
