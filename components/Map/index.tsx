import React, { useEffect, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
} from 'react-native-maps';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
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

  const [radius, setRadius] = useState<number>(1000);
  const [mechanics, setMechanics] = useState<
    Array<{ latitude: number; longitude: number; id: number }>
  >([]);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      generateMechanics();
    }
  }, [location, radius]);

  const generateMechanics = () => {
    if (!location) return;

    const mechanicsList = [];
    for (let i = 0; i < 4; i++) {
      const randomOffset = () => (Math.random() - 0.5) * (radius / 100000); // Random offset based on radius
      mechanicsList.push({
        id: i,
        latitude: location.coords.latitude + randomOffset(),
        longitude: location.coords.longitude + randomOffset(),
      });
    }
    setMechanics(mechanicsList);
  };

  // const radiusChangeHandler = (rad: number) => {
  //   setRadius(rad);
  // };

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
            {mechanics.map((mechanic) => (
              <Marker
                key={mechanic.id}
                coordinate={{
                  latitude: mechanic.latitude,
                  longitude: mechanic.longitude,
                }}
                title={`Mechanic ${mechanic.id + 1}`}
                description="Nearby Mechanic"
                pinColor="red"
              />
            ))}
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
});
