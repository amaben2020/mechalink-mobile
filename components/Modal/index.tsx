import { images } from '@/constants/Icons';
import { Link, RelativePathString } from 'expo-router';
import React, { useState } from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

function ModalComponent({
  url,
  linkText,
}: {
  url?: RelativePathString | any;
  linkText?: string;
}) {
  const [isModalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="">
      <Modal
        isVisible={isModalVisible}
        className="bg-white max-h-[500px] flex justify-center mt-40 relative rounded-2xl"
      >
        <TouchableOpacity className="static top-[-30%] right-[-85%] w-12 h-12">
          <Button title="X" onPress={toggleModal} />
        </TouchableOpacity>
        <View className="flex justify-center items-center ">
          <Image source={images.check} className="max-w-[60px] h-[60px]" />
          <Text className="p-3 font-JakartaBold text-2xl">Success</Text>

          <Link
            href={url ? url : '/(root)/(auth)/signin'}
            className="font-JakartaBold text-xl bg-primary-500 text-white text-center rounded-full p-3 w-6/12 cursor-pointer"
            onPress={toggleModal}
          >
            {linkText ? linkText : 'Log in'}
          </Link>
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;
