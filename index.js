/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

async function requestLocationPermission() {
  try {
    const bluetoothPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Permissão Bluetooth',
        message: 'O aplicativo precisa acessar seu bluetooth',
        buttonNeutral: 'Pergunte-me depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (!bluetoothPermission) {
      return;
    }
    if (bluetoothPermission === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permissão BLT concedida >>>', bluetoothPermission);
    } else {
      console.log('Permissão BLT negada >>>', bluetoothPermission);
    }
  } catch (err) {
    console.warn(err);
  }
}

requestLocationPermission();
AppRegistry.registerComponent(appName, () => App);
