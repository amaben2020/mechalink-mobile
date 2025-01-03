import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import Modal from 'react-native-modal';

function ModalComponent() {
  const [isModalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="" onPress={toggleModal} />

      <Modal
        isVisible={isModalVisible}
        className="bg-white max-h-[300px] flex justify-center mt-40 rounded-2xl"
      >
        <View style={{ flex: 1 }}>
          <Text className="p-3">Success</Text>

          <Button title="X" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;
