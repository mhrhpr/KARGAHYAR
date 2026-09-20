import {useCallback,useState} from "react";
import {useFocusEffect} from "expo-router";
import {router} from "expo-router";
import {Pressable,SafeAreaView,ScrollView,Text,View} from "react-native";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

type Project={id:string;name:string;project_type:string;status:string;progress:number};

export default function Projects(){
  const [projects,setProjects]=useState<Project[]>([]);
  const load=async()=>{const {data}=await supabase.from("projects").select("id,name,project_type,status,progress").order("created_at",{ascending:false});setProjects(data||[])};
  useFocusEffect(useCallback(()=>{load()},[]));
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}>
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{color:BRAND.text,fontSize:28,fontWeight:"900" as const}}>پروژه‌های من</Text><Pressable onPress={()=>router.push("/project-wizard")}><Text style={{color:BRAND.accent,fontWeight:"900" as const}}>+ پروژه</Text></Pressable></View>
    {projects.length===0?<View style={{marginTop:20,borderRadius:18,borderWidth:1,borderColor:BRAND.border,padding:20,backgroundColor:BRAND.surface}}><Text style={{color:BRAND.text,fontWeight:"800" as const,fontSize:18}}>هنوز پروژه‌ای ثبت نشده است.</Text><Text style={{color:BRAND.muted,marginTop:8}}>اولین پروژه را در کمتر از یک دقیقه بساز.</Text><Pressable onPress={()=>router.push("/project-wizard")} style={{marginTop:16,backgroundColor:BRAND.accent,padding:14,borderRadius:13}}><Text style={{color:"#fff",textAlign:"center" as const,fontWeight:"900" as const}}>ساخت پروژه جدید</Text></Pressable></View>
    :<View style={{gap:12,marginTop:20}}>{projects.map(p=><Pressable key={p.id} onPress={()=>router.push({pathname:"/project",params:{id:p.id}})} style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:18,padding:18}}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{color:BRAND.text,fontSize:18,fontWeight:"900" as const}}>{p.name}</Text><Text style={{color:p.status==="active"?"#7DD3A7":BRAND.muted,fontWeight:"800" as const}}>{p.status==="active"?"فعال":"غیرفعال"}</Text></View>
      <Text style={{color:BRAND.muted,marginTop:4}}>{p.project_type}</Text>
      <View style={{marginTop:12,height:8,borderRadius:6,backgroundColor:"#202A34",overflow:"hidden"}}><View style={{height:8,width: ((Math.max(0,Math.min(100,Number(p.progress)||0)) + "%") as `${number}%` ),backgroundColor:BRAND.accent}}/></View>
      <Text style={{color:BRAND.muted,marginTop:6}}>پیشرفت: {Number(p.progress||0).toLocaleString("fa-IR")}%</Text>
    </Pressable>)}</View>}
  </ScrollView></SafeAreaView>;
}
