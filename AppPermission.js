import {check, request, RESULTS, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';

const PLATFORM_MICROPHONE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
};

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_PHOTO_LIBRARY_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_BLUETOOTH_PERMISSIONS = {
  ios: [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
  android: [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  ],
};

const REQUEST_PERMISSION_TYPE = {
  microphone: PLATFORM_MICROPHONE_PERMISSIONS,
  camera: PLATFORM_CAMERA_PERMISSIONS,
  photo: PLATFORM_PHOTO_LIBRARY_PERMISSIONS,
  location: PLATFORM_LOCATION_PERMISSIONS,
  bluetooth: PLATFORM_BLUETOOTH_PERMISSIONS,
};

const PERMISSION_TYPE = {
  location: 'location',
  camera: 'camera',
  microphone: 'microphone',
  bluetooth: 'bluetooth',
  photo: 'photo',
};

class AppPermission {
  checkPermission = async type => {
    let permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];

    if (!permissions) {
      return true;
    }

    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    try {
      for (let permission of permissions) {
        const result = await check(permission);
        if (result !== RESULTS.GRANTED) {
          return this.requestPermission(permission);
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking permissions', error);
      return false;
    }
  };

  requestPermission = async permission => {
    try {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting permissions', error);
      return false;
    }
  };
}

const Permission = new AppPermission();
export {Permission, PERMISSION_TYPE};
