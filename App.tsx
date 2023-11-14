import React, {useCallback, useEffect} from 'react';
import {PERMISSION_TYPE, Permission} from './AppPermission';
import {Alert} from 'react-native';
import BluetoothPrinterDocument from './components/BluetoothPrinter/BluetoothPrinter';

const App = () => {
  const requestPermissions = useCallback(async () => {
    const camera = await Permission.checkPermission(PERMISSION_TYPE.camera);
    const location = await Permission.checkPermission(PERMISSION_TYPE.location);
    const photo = await Permission.checkPermission(PERMISSION_TYPE.photo);
    const bluetooth = await Permission.checkPermission(
      PERMISSION_TYPE.bluetooth,
    );

    if (!camera || !location || !photo || !bluetooth) {
      Alert.alert(
        'Permissões necessárias',
        'Todas as permissões são necessárias para o funcionamento do app.',
      );
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return <BluetoothPrinterDocument />;
};

export default App;
