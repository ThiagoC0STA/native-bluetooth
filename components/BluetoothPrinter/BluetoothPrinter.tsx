import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  FlatList,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';

const BluetoothPrinterDocument = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState<any>([]);

  const startScan = async () => {
    if (!isScanning) {
      const isEnabled = await BluetoothManager.isBluetoothEnabled();
      if (!isEnabled) {
        Alert.alert('Error', 'Bluetooth is not enabled');
        return;
      }

      setIsScanning(true);

      BluetoothManager.scanDevices()
        .then((e: any) => {
          setIsScanning(false);
          if (e.found) {
            setPeripherals(JSON.parse(e.found));
          }
        })
        .catch((error: any) => {
          Alert.alert('Error', 'Failed to scan devices: ' + error.message);
          setIsScanning(false);
        });
    }
  };

  const printDocument = async (peripheral: any, type: string) => {
    await BluetoothManager.connect(peripheral.address);

    if (type === 'boleto') {
      const boletoText =
        'Dados do Boleto\nLinha Digitavel: 1234.5678\nValor: R$ 100,00\n';

      await BluetoothEscposPrinter.printText(boletoText, {});
    } else if (type === 'recibo') {
      const reciboText =
        'Recibo de Pagamento\nValor: R$ 100,00\nRecebido de: Joao\n';
      await BluetoothEscposPrinter.printText(reciboText, {});
    }
    Alert.alert('Success', 'Document sent to printer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.innerContainer}>
        <Button
          title={isScanning ? 'Scanning...' : 'Scan for Printers'}
          onPress={startScan}
        />

        {peripherals.length > 0 ? (
          <FlatList
            data={peripherals.filter((item: any) => item.name)}
            keyExtractor={item => item.address}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <Text style={styles.deviceName}>{item?.name}</Text>
                <Button
                  title="Print Boleto"
                  onPress={() => printDocument(item, 'boleto')}
                />
                <Button
                  title="Print Recibo"
                  onPress={() => printDocument(item, 'recibo')}
                />
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Devices Found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    margin: 10,
  },
  listItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#202020',
    borderRadius: 5,
  },
  deviceName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFF',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BluetoothPrinterDocument;
