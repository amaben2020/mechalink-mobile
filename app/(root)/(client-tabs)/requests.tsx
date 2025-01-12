import ClientLayout from '@/components/layout/ClientLayout';
import { useMechanicsStore } from '@/store/mechanics/mechanics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function RequestsScreen() {
  const { mechanic, setMechanic } = useMechanicsStore();

  // ensure the mech is the only one in he map

  // reduce the height of the drawer

  // todo: backend add mechanic and user image
  // update bvn and nimc

  return (
    <ClientLayout>
      {/* <Text>Job Request and History {mechanic.username}</Text> */}
      {/* <Text>{JSON.stringify(mechanic)}</Text> */}

      <View className="gap-4">
        <Text className="font-JakartaExtraBold text-center text-2xl">
          Mechanic Information
        </Text>

        <View className="mx-auto">
          <View className="flex flex-row">
            <Text className="text-center text-primary-500 font-JakartaSemiBold">
              {mechanic.username ?? mechanic.id}
            </Text>
            <StarRatingDisplay maxStars={1} starSize={20} rating={5} />
          </View>
        </View>

        <View className="bg-[#E6F3FF] rounded-lg border border-gray-200 p-4">
          <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3">
            <View className="flex flex-row items-center gap-3">
              <Text className="text-primary-500 text-lg">Time Away</Text>
              <Ionicons
                name="time-outline"
                size={20}
                className="text-primary-500"
                color="#1E3A8A"
              />
            </View>

            <Text className="text-primary-500 text-lg font-JakartaBold">
              {mechanic.distanceAway} mins
            </Text>
          </View>
          <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3">
            <View className="flex flex-row items-center gap-3">
              <Text className="text-primary-500 text-lg">Repair Type</Text>
              <Ionicons
                name="settings-sharp"
                size={20}
                className="text-primary-500"
                color="#1E3A8A"
              />
            </View>
            {/* TODO: based on the repair selected in create job dropdown */}
            <Text className="text-primary-500 text-lg font-JakartaBold">
              ₦10,000
            </Text>
          </View>

          <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3">
            <View className="flex flex-row items-center gap-3">
              <Text className="text-primary-500 text-lg">Call Mechanic</Text>
              <Ionicons
                name="phone-portrait"
                size={20}
                className="text-primary-500"
                color="#1E3A8A"
              />
            </View>
            {/* TODO: based on the repair selected in create job dropdown */}
            <Text className="text-primary-500 text-lg font-JakartaBold">
              {mechanic?.phone}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="p-5 rounded-full bg-primary-500 mt-5">
        <Text className="text-white font-JakartaBold text-center">
          Create Job Request
        </Text>
      </TouchableOpacity>
    </ClientLayout>
  );
}
