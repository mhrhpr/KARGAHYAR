import {useEffect,useState} from "react";
import {Pressable,SafeAreaView,ScrollView,Text,View} from "react-native";
import {router} from "expo-router";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

type Project={id:string;name:string;project_type:string;progress:number};

export default function Home(){
  const [name,setName]=useState("مدیر کارگاه"); const [projects,setProjects]=useState<Project[]>([]);
  useEffect(()=>{(async()=>{const {data:user}=await supabase.auth.getUser();setName(user.user?.user_metadata?.full_name||user.user?.email?.split("@")[0]||"مدیر کارگاه");const {data}=await supabase.from("projects").select("id,name,project_type,progress").eq("status","active").order("created_at",{ascending:false}).limit(3);setProjects(data||[])})()},[]);
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg}}><ScrollView contentContainerStyle={{padding:20,paddingBottom:40}}>
    <Text style={{color:BRAND.muted}}>سلام {name}</Text><Text style={{color:BRAND.text,fontSize:32,fontWeight:"900",marginTop:4}}>کارگاهیار</Text><Text style={{color:BRAND.muted,marginTop:4}}>کارگاهت را مدیریت کن، نه کاغذها را.</Text>
    <View style={{gap:12,marginTop:28}}>
      <Pressable onPress={()=>router.push("/dashboard")} style={styles.primary}><Text style={styles.primaryTitle}>📊 داشبورد</Text><Text style={styles.sub}>نمای کلی هزینه‌ها، نیروها، پیمانکاران و همه پروژه‌ها</Text></Pressable>
      <Pressable onPress={()=>router.push("/projects")} style={styles.card}><Text style={styles.title}>🏗 لیست پروژه‌ها</Text><Text style={styles.sub}>ورود سریع به پروژه‌های فعال و سوابق آن‌ها</Text></Pressable>
      <Pressable onPress={()=>router.push("/project-wizard")} style={styles.card}><Text style={styles.title}>＋ ایجاد پروژه جدید</Text><Text style={styles.sub}>پروژه را بساز و ماژول‌های لازم را انتخاب کن</Text></Pressable>
    </View>
    <Text style={{color:BRAND.text,fontSize:20,fontWeight:"900",marginTop:30}}>پروژه‌های اخیر</Text>
    <View style={{gap:10,marginTop:12}}>{projects.length?projects.map(p=><Pressable key={p.id} onPress={()=>router.push({pathname:"/project",params:{id:p.id}})} style={styles.card}><Text style={styles.title}>{p.name}</Text><Text style={styles.sub}>{p.project_type} · پیشرفت {Number(p.progress||0).toLocaleString("fa-IR")}%</Text></Pressable>):<View style={styles.card}><Text style={styles.title}>هنوز پروژه‌ای نداری.</Text><Text style={styles.sub}>از «ایجاد پروژه جدید» شروع کن.</Text></View>}</View>
    <Pressable onPress={()=>router.push("/security")} style={{marginTop:20,padding:12}}><Text style={{color:BRAND.muted,textAlign:"center"}}>تنظیمات ورود و یادآوری‌ها</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const styles={primary:{backgroundColor:BRAND.accent,padding:20,borderRadius:18},primaryTitle:{color:"#fff",fontSize:19,fontWeight:"900"},card:{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,padding:18,borderRadius:17},title:{color:BRAND.text,fontSize:17,fontWeight:"800"},sub:{color:BRAND.muted,marginTop:4}} as const;
