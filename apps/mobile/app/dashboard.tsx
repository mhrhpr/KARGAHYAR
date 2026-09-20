import {useEffect,useState} from "react";
import {router} from "expo-router";
import {Pressable,SafeAreaView,ScrollView,Text,View} from "react-native";
import {supabase} from "../lib/supabase";
import {syncPendingOperations} from "../lib/offline";
import {BRAND} from "../lib/brand";

const Card=({label,value,accent=false}:{label:string;value:string|number;accent?:boolean})=><View style={{flex:1,backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:18,padding:17}}><Text style={{color:BRAND.muted,fontSize:12}}>{label}</Text><Text style={{color:accent?BRAND.accent:BRAND.text,fontSize:24,fontWeight:"900",marginTop:5}}>{value}</Text></View>;

export default function Dashboard(){
  const [name,setName]=useState("مدیر کارگاه"); const [projects,setProjects]=useState(0); const [workers,setWorkers]=useState(0); const [contractors,setContractors]=useState(0); const [cost,setCost]=useState(0); const [paid,setPaid]=useState(0); const [pending,setPending]=useState(0);
  useEffect(()=>{(async()=>{const {data:user}=await supabase.auth.getUser();setName(user.user?.user_metadata?.full_name||user.user?.email?.split("@")[0]||"مدیر کارگاه");
    const [p,w,c,we,ce,ex,py,ops]=await Promise.all([
      supabase.from("projects").select("id",{count:"exact",head:true}).eq("status","active"),
      supabase.from("workers").select("id",{count:"exact",head:true}).eq("active",true),
      supabase.from("contractors").select("id",{count:"exact",head:true}),
      supabase.from("worker_entries").select("payable,advance"),
      supabase.from("contractor_entries").select("amount"),
      supabase.from("expenses").select("amount"),
      supabase.from("payments").select("amount"),
      syncPendingOperations()
    ]);
    const workerCost=(we.data||[]).reduce((sum,row)=>sum+Number(row.payable||0)+Number(row.advance||0),0);
    const contractorCost=(ce.data||[]).reduce((sum,row)=>sum+Number(row.amount||0),0);
    const expenseCost=(ex.data||[]).reduce((sum,row)=>sum+Number(row.amount||0),0);
    const paymentTotal=(py.data||[]).reduce((sum,row)=>sum+Number(row.amount||0),0);
    setProjects(p.count||0);setWorkers(w.count||0);setContractors(c.count||0);setCost(workerCost+contractorCost+expenseCost);setPaid(paymentTotal);setPending(ops.pending);
  })()},[]);
  const logout=async()=>{await supabase.auth.signOut();router.replace("/sign-in")};
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg}}><ScrollView contentContainerStyle={{padding:20,paddingBottom:40}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}><View><Text style={{color:BRAND.muted}}>سلام</Text><Text style={{color:BRAND.text,fontSize:27,fontWeight:"900",marginTop:2}}>{name}</Text></View><Pressable onPress={logout} style={{padding:10}}><Text style={{color:"#FF8C8C",fontWeight:"700"}}>خروج</Text></Pressable></View>
    <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:20,padding:20,marginTop:24}}><Text style={{color:BRAND.muted}}>نمای کلی کسب‌وکار</Text><Text style={{color:BRAND.text,fontSize:28,fontWeight:"900",marginTop:7}}>همه‌چیز یک‌جا</Text><Text style={{color:BRAND.muted,marginTop:5}}>مناسب مدیریت چند پروژه بدون ورود به جزئیات هر پروژه.</Text><Pressable onPress={()=>router.push("/daily-report")} style={{marginTop:18,backgroundColor:BRAND.accent,padding:15,borderRadius:13}}><Text style={{textAlign:"center",color:"#fff",fontWeight:"900"}}>ثبت گزارش امروز</Text></Pressable></View>
    <View style={{flexDirection:"row",gap:10,marginTop:16}}><Card label="پروژه فعال" value={projects}/><Card label="نیروی فعال" value={workers}/></View>
    <View style={{flexDirection:"row",gap:10,marginTop:10}}><Card label="پیمانکار" value={contractors}/><Card label="هزینه عملیاتی" value={cost.toLocaleString("fa-IR")+" تومان"} accent/></View><View style={{flexDirection:"row",gap:10,marginTop:10}}><Card label="پرداخت ثبت‌شده" value={paid.toLocaleString("fa-IR")+" تومان"}/><Card label="مانده عملیات" value={Math.max(0,cost-paid).toLocaleString("fa-IR")+" تومان"}/></View>
    {pending>0&&<View style={{marginTop:12,borderWidth:1,borderColor:"#7A5A2B",backgroundColor:"#211A10",borderRadius:16,padding:14}}><Text style={{color:"#F2C26B",fontWeight:"800"}}>{pending.toLocaleString("fa-IR")} عملیات در انتظار همگام‌سازی است.</Text></View>}
    <Text style={{color:BRAND.text,fontSize:21,fontWeight:"900",marginTop:28}}>دسترسی سریع</Text>
    <View style={{gap:10,marginTop:12}}>{[["پروژه‌ها","/projects"],["ساخت پروژه جدید","/project-wizard"],["نیروها","/workers"],["پیمانکاران","/contractors"],["تنظیمات و ورود سریع","/security"]].map(([title,path])=><Pressable key={path} onPress={()=>router.push(path as any)} style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:16,padding:17}}><Text style={{color:BRAND.text,fontSize:16,fontWeight:"800"}}>{title}</Text></Pressable>)}</View>
  </ScrollView></SafeAreaView>;
}
