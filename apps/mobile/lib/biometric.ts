import * as LocalAuthentication from "expo-local-authentication"; import * as SecureStore from "expo-secure-store";
const FLAG="kargahyar.biometric.enabled";
export async function canUseBiometric(){const supported=await LocalAuthentication.hasHardwareAsync(); const enrolled=await LocalAuthentication.isEnrolledAsync(); return supported&&enrolled;}
export async function getBiometricEnabled(){return (await SecureStore.getItemAsync(FLAG))==="1";}
export async function setBiometricEnabled(enabled:boolean){await SecureStore.setItemAsync(FLAG,enabled?"1":"0");}
export async function authenticateBiometric(){const result=await LocalAuthentication.authenticateAsync({promptMessage:"ورود سریع به کارگاهیار",fallbackLabel:"استفاده از رمز گوشی"}); return result.success;}