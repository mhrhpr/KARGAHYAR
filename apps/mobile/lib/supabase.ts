import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if(!url||!key){console.warn("Supabase env vars are not configured.");}
const storage={getItem:(key:string)=>SecureStore.getItemAsync(key),setItem:(key:string,value:string)=>SecureStore.setItemAsync(key,value),removeItem:(key:string)=>SecureStore.deleteItemAsync(key)};
export const supabase=createClient(url||"https://example.invalid",key||"missing-key",{auth:{storage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});