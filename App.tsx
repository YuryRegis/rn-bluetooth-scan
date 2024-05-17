/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {BleManager, Device, ScanCallbackType} from 'react-native-ble-plx';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const bleManager = new BleManager();

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [devicesList, setDevicesList] = React.useState<Device[]>([]);
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  function scanDevices() {
    setIsScanning(true);
    bleManager.startDeviceScan(
      null,
      {callbackType: ScanCallbackType.FirstMatch},
      (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
        const isDeviceInList = devicesList.some(dev => dev.id === device?.id);
        if (device && !isDeviceInList) {
          setDevicesList(devices => devices.concat(device));
        }
      },
    );
  }

  function stopScan(devices?: Device[]) {
    setIsScanning(false);
    if (devices) {
      setDevicesList(devices);
    }
    bleManager.stopDeviceScan();
  }

  function renderDeviceItem(deviceItem: Device) {
    const title = deviceItem.name || deviceItem.localName || 'Desconhecido';
    return (
      <Section title={title} key={deviceItem.id}>
        <View style={styles.sectionMainDescription}>
          <Text>{`ID: ${deviceItem.id || 'desconhecido'}`}</Text>
          <Text>{`RSSI: ${deviceItem.rssi || 'desconhecido'}`}</Text>
          <Text>{`MTU: ${deviceItem.mtu || 'desconhecido'}`}</Text>
          <Text>
            {`txPowerLevel: ${deviceItem.txPowerLevel || 'desconhecido'}`}
          </Text>
        </View>
      </Section>
    );
  }

  const buttonMessage = !isScanning
    ? 'Clique em "procurar" para listar os devices'
    : 'Clique em "pausar" para encerrar a busca';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            ...styles.viewContainer,
          }}>
          <Section title="Bluetooth 'Hello World'">
            <View style={styles.buttonContainer}>
              <Button
                title="procurar"
                disabled={isScanning}
                onPress={scanDevices}
              />
              <Button
                title="pausar"
                disabled={!isScanning}
                onPress={() => stopScan()}
              />
            </View>
            <View style={styles.sectionMainDescription}>
              <Text style={styles.sectionDescription}>{buttonMessage}</Text>
            </View>
          </Section>

          <Section title="Devices">
            <FlatList
              data={devicesList}
              keyExtractor={item => item.id}
              renderItem={({item}) => renderDeviceItem(item)}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    display: 'flex',
    paddingHorizontal: 24,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionMainDescription: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
