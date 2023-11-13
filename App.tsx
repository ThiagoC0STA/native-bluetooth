/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect} from 'react';
import BluetoothPrinter from './components/BluetoothPrinter/BluetoothPrinter';
import {PERMISSION_TYPE, Permission} from './AppPermission';
import {Alert} from 'react-native';

const App = () => {
  const requestPermissions = useCallback(async () => {
    const camera = await Permission.checkPermission(PERMISSION_TYPE.camera);
    const location = await Permission.checkPermission(PERMISSION_TYPE.location);
    const photo = await Permission.checkPermission(PERMISSION_TYPE.photo);
    const bluetooth = await Permission.checkPermission(
      PERMISSION_TYPE.bluetooth,
    );
    if (!camera || !location || !photo || !bluetooth) {
      Alert.alert('Permissions', 'One or more permissions were denied');
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);
  return <BluetoothPrinter />;
};

export default App;
