import {useCallback,useState} from "react";
import {useFocusEffect} from "expo-router";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

export default function Progress(){
  const {projectId}=useLocalSearchParams<{projectId:string}>(); const [value,setValue]=useState("0"); const [note,setNote]=useState(""); const [name,setName]=useState("");
  const load=async()=>{if(!projectId)return;const {data}=await supabase.from("projects").select("name,progress").eq("id",projectId).single();setName(data?.name||"");setValue(String(data?.progress||0));};
  useFocusEffect(useCallback(()=>{load()},[projectId]));
  const save=async()=>{const n=Number(value.replace(/[^0-9.]/g,""));if(n<0||n>100){Alert.alert("درصد نامعتبر","بین ۰ تا ۱۰۰ وارد کن.");return;}const {error}=await supabase.from("projects").update({progress:n}).eq("id",projectId);if(error){Alert.alert("ثبت پیشرفت ناموفق بود",error.message);return;}Alert.alert("ثبت شد","پیشرفت پروژه به‌روزرسانی شد.");setNote("");load();};
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}><Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← بازگشت</Text></Pressable><Text style={{color:BRAND.text,fontSize:29,fontWeight:"900",marginTop:12}}>پیشرفت پروژه</Text><Text style={{color:BRAND.muted,marginTop:4}}>{name}</Text>
    <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:20,padding:20,marginTop:20,gap:12}}><Text style={{color:BRAND.muted}}>درصد پیشرفت فعلی</Text><TextInput value={value} onChangeText={setValue} keyboardType="numeric" style={styles.input}/><TextInput value={note} onChangeText={setNote} placeholder="یادداشت اختیاری، مثلاً پایان گچ‌کاری طبقه ۳" placeholderTextColor="#707986" style={styles.input}/><Pressable onPress={save} style={styles.primary}><Text style={styles.primaryText}>ثبت پیشرفت</Text></Pressable></View>
  </ScrollView></SafeAreaView>;
}
const styles={input:{backgroundColor:BRAND.bg,color:BRAND.text,padding:15,borderRadius:13,borderWidth:1,borderColor:BRAND.border},primary:{backgroundColor:BRAND.accent,padding:15,borderRadius:13},primaryText:{color:"#fff",textAlign:"center" as const,fontWeight:"900" as const}};