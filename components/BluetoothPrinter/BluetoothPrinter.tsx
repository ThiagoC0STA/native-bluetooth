/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {PERMISSION_TYPE, Permission} from '../../AppPermission';

const BluetoothPrinter = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState([]);
  const [selectedImage, setSelectedImage] = useState({uri: ''});

  const startScan = useCallback(() => {
    const enableBluetoothAndScan = async () => {
      await BluetoothManager.enableBluetooth();
      setIsScanning(true);

      BluetoothManager.onDeviceFound = (device: any) => {
        setPeripherals((currentPeripherals: any) => {
          if (
            currentPeripherals.every(
              (peripheral: {address: any}) =>
                peripheral.address !== device.address,
            )
          ) {
            return [...currentPeripherals, device];
          }
          return currentPeripherals;
        });
      };

      BluetoothManager.scanDevices().then(
        () => {
          setIsScanning(false);
        },
        () => {
          Alert.alert('Error', 'Please enable Bluetooth');
          setIsScanning(false);
        },
      );
    };
    if (!isScanning) {
      enableBluetoothAndScan();
    }
    if (!isScanning) {
      enableBluetoothAndScan();
    }
  }, [isScanning]);

  const selectImage = useCallback(() => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const source: any = {uri: response.assets[0].uri};
        setSelectedImage(source);
      }
    });
  }, []);

  const printImage = async (peripheral: any) => {
    if (selectedImage?.uri) {
      try {
        const imageBase64 = await RNFS.readFile(selectedImage?.uri, 'base64');
        await BluetoothManager.connect(peripheral.address);
        // 58mm = 384
        // 80mm = 600

        const options = {
          width: 384,
          left: 0,
        };
        await BluetoothEscposPrinter.printPic(imageBase64, options);

        Alert.alert('Success', 'Image sent to printer');
      } catch (error: any) {
        console.error('Failed to print image:', error);
        Alert.alert('Error', `Failed to print image: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'No image selected');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View style={{margin: 10}}>
        <Button title="Select Image" onPress={selectImage} />
        {selectedImage.uri ? (
          <Image
            source={{uri: selectedImage.uri}}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
              marginTop: 20,
            }}
          />
        ) : null}
        <Button
          title={isScanning ? 'Scanning...' : 'Scan for Printers'}
          onPress={startScan}
        />
        <FlatList
          data={peripherals.filter((item: any) => item.name)}
          keyExtractor={(item: any) => item.address}
          renderItem={({item}) => (
            <View style={{margin: 10}}>
              <Button
                title={`Print on ${item.name}`}
                onPress={() => printImage(item)}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default BluetoothPrinter;
