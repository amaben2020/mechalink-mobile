import { Image, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import ClientLayout from '@/components/layout/ClientLayout';
import { TMechanics, useMechanicsStore } from '@/store/mechanics/mechanics';
import PressableButton from '@/components/Buttons/PressableButton';
import clsx from 'clsx';
import { useState } from 'react';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { mechanics, setMechanic } = useMechanicsStore();
  const [selectedMechanic, setSelectedMechanic] = useState<TMechanics | null>(
    null,
  );

  return (
    <ClientLayout>
      <Text className="font-JakartaBold text-center text-xl">
        Mechanics Near you
      </Text>

      {/* TODO: refactor with react hook form and react query */}
      {/* when you click the mechanics card, there is a select button,which takes you to a route for you to make a request */}

      {/* todo: add loading state */}
      <View className="flex flex-col gap-y-3 mt-5">
        {mechanics?.map((mech) => (
          <PressableButton
            onPress={() => setSelectedMechanic(mech)}
            selected={selectedMechanic?.id === mech.id}
            className={clsx(
              selectedMechanic?.id === mech.id &&
                'bg-primary-500 text-white font-JakartaBold',
              'border-gray-200 border flex flex-row justify-between rounded-xl',
            )}
          >
            {({ pressed }) => {
              return (
                <TouchableOpacity>
                  <View className="gap-y-3 flex flex-col">
                    <Text
                      className={clsx(
                        pressed && 'text-white',
                        selectedMechanic?.id === mech.id &&
                          'bg-primary-500 text-white font-JakartaBold',
                        'font-JakartaBold text-base',
                      )}
                    >
                      Username: {mech?.username ?? mech?.id} {}
                    </Text>
                    <Text
                      className={clsx(
                        pressed && 'text-white',
                        selectedMechanic?.id === mech.id &&
                          'bg-primary-500 text-white font-JakartaBold',
                        'font-JakartaBold text-base',
                      )}
                    >
                      Jobs Done: {mech?.jobCount}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text
                        className={clsx(
                          pressed && 'text-white',
                          selectedMechanic?.id === mech.id &&
                            'bg-primary-500 text-white font-JakartaBold',
                          'font-JakartaBold text-base',
                        )}
                      >
                        Arrival Time:
                      </Text>
                      <StarRatingDisplay
                        starSize={20}
                        rating={mech?.arrivalRate}
                      />
                    </View>
                  </View>

                  {/* <Image
                    source={{
                      uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=500&center=lonlat:${mech?.lng},${mech?.lat}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                    }}
                    className="h-[90px] w-[80px] rounded-[10px]"
                  /> */}
                </TouchableOpacity>
              );
            }}
          </PressableButton>
        ))}

        <TouchableOpacity
          disabled={!selectedMechanic}
          className="bg-primary-500 rounded-full p-5 mt-6 disabled:bg-primary-300"
          onPress={() => {
            setMechanic(selectedMechanic!);
            router.push('/(root)/(client-tabs)/requests');
          }}
        >
          <Text className="text-white font-JakartaBold text-center">
            Select Mechanic
          </Text>
        </TouchableOpacity>
      </View>
    </ClientLayout>
  );
}
