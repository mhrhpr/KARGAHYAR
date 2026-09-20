import {useEffect,useState} from "react";
import {Pressable,SafeAreaView,ScrollView,Text,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

type Project={id:string;name:string;project_type:string;status:string;progress:number;address:string|null;client_name:string|null;manager_name:string|null;settings:any};

export default function ProjectHome(){
  const {id}=useLocalSearchParams<{id:string}>(); const [project,setProject]=useState<Project|null>(null);
  const [workers,setWorkers]=useState(0); const [contractors,setContractors]=useState(0);
  const [cost,setCost]=useState(0);
  useEffect(()=>{if(!id)return;(async()=>{const {data}=await supabase.from("projects").select("id,name,project_type,status,progress,address,client_name,manager_name,settings").eq("id",id).single();setProject(data); const [w,c]=await Promise.all([
    supabase.from("workers").select("id",{count:"exact",head:true}).eq("project_id",id).eq("active",true),
    supabase.from("contractors").select("id",{count:"exact",head:true}).eq("project_id",id)
  ]); setWorkers(w.count||0); setContractors(c.count||0);
  const {data:reports}=await supabase.from("daily_reports").select("id").eq("project_id",id);
  const ids=(reports||[]).map(r=>r.id);
  if(ids.length){const [we,ce]=await Promise.all([supabase.from("worker_entries").select("payable").in("report_id",ids),supabase.from("contractor_entries").select("amount").in("report_id",ids)]); const wc=(we.data||[]).reduce((s,r)=>s+Number(r.payable||0),0); const cc=(ce.data||[]).reduce((s,r)=>s+Number(r.amount||0),0); setCost(wc+cc);}
  })()},[id]);
  if(!project)return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><Text style={{color:BRAND.text,fontSize:24,fontWeight:"900"}}>در حال بارگذاری...</Text></SafeAreaView>;
  const modules=project.settings?.modules||{};
  const go=(path:string)=>router.push({pathname:path as any,params:{projectId:project.id}});
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}>
    <Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← پروژه‌ها</Text></Pressable>
    <Text style={{color:BRAND.text,fontSize:30,fontWeight:"900",marginTop:12}}>{project.name}</Text>
    <Text style={{color:BRAND.muted,marginTop:4}}>{project.project_type} · {project.status==="active"?"فعال":"غیرفعال"}</Text>
    <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:20,padding:20,marginTop:20}}>
      <Text style={{color:BRAND.muted}}>نمای سریع پروژه</Text>
      <View style={{flexDirection:"row",gap:10,marginTop:14}}>
        {[["نیرو",workers],["پیمانکار",contractors],["پیشرفت",(project.progress||0)+"%"]].map(([t,v])=><View key={String(t)} style={{flex:1}}><Text style={{color:BRAND.muted,fontSize:12}}>{t}</Text><Text style={{color:BRAND.text,fontSize:20,fontWeight:"900",marginTop:3}}>{v}</Text></View>)}
      </View>
      <Text style={{color:BRAND.muted,marginTop:16}}>هزینه ثبت‌شده نیروی انسانی و پیمانکار: <Text style={{color:BRAND.text,fontWeight:"900"}}>{cost.toLocaleString("fa-IR")} تومان</Text></Text>
    </View>
    <Text style={{color:BRAND.text,fontSize:21,fontWeight:"900",marginTop:26}}>عملیات پروژه</Text>
    <View style={{gap:10,marginTop:12}}>
      {modules.reports!==false&&<Pressable onPress={()=>go("/daily-report")} style={styles.primary}><Text style={styles.primaryText}>📋 گزارش روزانه</Text><Text style={styles.sub}>ثبت سریع کارکرد و فعالیت</Text></Pressable>}
      {modules.workers!==false&&<Pressable onPress={()=>go("/workers")} style={styles.card}><Text style={styles.title}>👷 نیروها</Text><Text style={styles.sub}>افراد، تخصص و دستمزد</Text></Pressable>}
      {modules.contractors!==false&&<Pressable onPress={()=>go("/contractors")} style={styles.card}><Text style={styles.title}>🧑‍🔧 پیمانکاران</Text><Text style={styles.sub}>کارکرد و نرخ واحد</Text></Pressable>}
      {modules.materials!==false&&<Pressable onPress={()=>go("/materials")} style={styles.card}><Text style={styles.title}>🧱 مصالح</Text><Text style={styles.sub}>موجودی و نقطه سفارش</Text></Pressable>}
      {modules.expenses!==false&&<Pressable onPress={()=>go("/expenses")} style={styles.card}><Text style={styles.title}>💰 هزینه‌ها</Text><Text style={styles.sub}>خرج‌های جاری پروژه</Text></Pressable>}
      <Pressable onPress={()=>router.push({pathname:"/dashboard"})} style={styles.card}><Text style={styles.title}>📊 داشبورد کلی</Text><Text style={styles.sub}>برگشت به نمای تمام پروژه‌ها</Text></Pressable>
    </View>
  </ScrollView></SafeAreaView>;
}
const styles={primary:{backgroundColor:BRAND.accent,padding:18,borderRadius:17},primaryText:{color:"#fff",fontSize:18,fontWeight:"900"},card:{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,padding:18,borderRadius:17},title:{color:BRAND.text,fontSize:17,fontWeight:"800"},sub:{color:BRAND.muted,marginTop:3}};
