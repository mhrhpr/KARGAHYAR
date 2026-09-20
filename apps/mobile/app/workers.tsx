import {useCallback,useState} from "react";
import {useFocusEffect} from "expo-router";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

type Worker={id:string;name:string;specialty:string|null;daily_wage:number|null};
export default function Workers(){
  const {projectId}=useLocalSearchParams<{projectId?:string}>(); const [items,setItems]=useState<Worker[]>([]); const [projectName,setProjectName]=useState("");
  const [name,setName]=useState(""); const [specialty,setSpecialty]=useState(""); const [wage,setWage]=useState(""); const [busy,setBusy]=useState(false);
  const load=async()=>{let id=projectId; if(!id){const {data}=await supabase.from("projects").select("id,name").eq("status","active").limit(2);if((data||[]).length===1){id=data![0].id;} else {setProjectName("ابتدا از فهرست پروژه‌ها یک پروژه انتخاب کن.");return;}} const {data:p}=await supabase.from("projects").select("name").eq("id",id).single();setProjectName(p?.name||"");const {data}=await supabase.from("workers").select("id,name,specialty,daily_wage").eq("project_id",id).eq("active",true).order("created_at",{ascending:false});setItems(data||[])};
  useFocusEffect(useCallback(()=>{load()},[projectId]));
  const add=async()=>{if(!name.trim())return;const id=projectId; if(!id){Alert.alert("پروژه مشخص نیست","از فهرست پروژه‌ها یک پروژه را باز کن.");return;}setBusy(true);const {error}=await supabase.from("workers").insert({project_id:id,name:name.trim(),specialty:specialty.trim()||null,payment_type:"daily",daily_wage:Number(wage)||0,active:true});setBusy(false);if(error){Alert.alert("ثبت نیرو ناموفق بود",error.message);return;}setName("");setSpecialty("");setWage("");load()};
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}><Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← بازگشت</Text></Pressable><Text style={{color:BRAND.text,fontSize:28,fontWeight:"900" as const,marginTop:10}}>نیروها</Text>{projectName&&<Text style={{color:BRAND.muted,marginTop:4}}>{projectName}</Text>}
  <View style={{marginTop:18,gap:10,backgroundColor:BRAND.surface,padding:16,borderRadius:18,borderWidth:1,borderColor:BRAND.border}}><TextInput value={name} onChangeText={setName} placeholder="نام نیرو" placeholderTextColor="#707986" style={styles.input}/><TextInput value={specialty} onChangeText={setSpecialty} placeholder="تخصص، مثلاً آرماتوربند" placeholderTextColor="#707986" style={styles.input}/><TextInput value={wage} onChangeText={setWage} placeholder="مزد روزانه به تومان" keyboardType="numeric" placeholderTextColor="#707986" style={styles.input}/><Pressable disabled={busy||!projectId} onPress={add} style={[styles.primary,{opacity:(busy||!projectId)?0.5:1}]}><Text style={styles.primaryText}>{busy?"در حال ثبت...":"افزودن نیرو"}</Text></Pressable></View>
  <View style={{gap:10,marginTop:20}}>{items.map(w=><View key={w.id} style={styles.card}><Text style={styles.title}>{w.name}</Text><Text style={styles.sub}>{w.specialty||"بدون تخصص"} · {Number(w.daily_wage||0).toLocaleString("fa-IR")} تومان</Text></View>)}</View></ScrollView></SafeAreaView>;
}
const styles={input:{color:BRAND.text,padding:14,borderWidth:1,borderColor:BRAND.border,borderRadius:12,backgroundColor:BRAND.bg},primary:{backgroundColor:BRAND.accent,padding:15,borderRadius:13},primaryText:{color:"#fff",textAlign:"center" as const,fontWeight:"900" as const},card:{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:16,padding:16},title:{color:BRAND.text,fontWeight:"800" as const,fontSize:17},sub:{color:BRAND.muted,marginTop:3}};
