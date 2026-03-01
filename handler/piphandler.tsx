import { NativeModules } from 'react-native';

export const enterPip = () => {
  NativeModules.PipModule.enterPip();
};