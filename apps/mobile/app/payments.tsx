import {useCallback,useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {queueAndSync,PaymentOperation} from "../lib/offline";
import {BRAND} from "../lib/brand";

type Item={id:string;name:string};
type Payment={id:string;payment_date:string;party_type:string;amount:number;method:string;description:string|null};

export default function Payments(){
  const {projectId}=useLocalSearchParams<{projectId:string}>(); const [workers,setWorkers]=useState<Item[]>([]); const [contractors,setContractors]=useState<Item[]>([]);
  const [items,setItems]=useState<Payment[]>([]); const [partyType,setPartyType]=useState<PaymentOperation["partyType"]>("worker"); const [partyId,setPartyId]=useState<string|null>(null);
  const [amount,setAmount]=useState(""); const [method,setMethod]=useState<PaymentOperation["method"]>("cash"); const [description,setDescription]=useState(""); const [busy,setBusy]=useState(false);

  const load=async()=>{if(!projectId)return;const [w,c,p]=await Promise.all([
    supabase.from("workers").select("id,name").eq("project_id",projectId).eq("active",true).order("name"),
    supabase.from("contractors").select("id,name").eq("project_id",projectId).order("name"),
    supabase.from("payments").select("id,payment_date,party_type,amount,method,description").eq("project_id",projectId).order("payment_date",{ascending:false})
  ]);setWorkers(w.data||[]);setContractors(c.data||[]);setItems(p.data||[]);};
  useFocusEffect(useCallback(()=>{load()},[projectId]));
  const parties=partyType==="worker"?workers:partyType==="contractor"?contractors:[];
  const add=async()=>{if(!projectId||!amount)return;if(partyType!=="other"&&!partyId){Alert.alert("مخاطب پرداخت را انتخاب کن");return;}setBusy(true);const op:PaymentOperation={kind:"payment",projectId,partyType,partyId,amount:Number(amount.replace(/[^0-9.]/g,""))||0,paymentDate:new Date().toISOString().slice(0,10),method,description:description.trim()};try{const r=await queueAndSync(op);Alert.alert(r.queued?"ذخیره شد":"ثبت شد",r.queued?"پرداخت روی گوشی نگه داشته شد تا اتصال برقرار شود.":"پرداخت با موفقیت ثبت شد.");setAmount("");setDescription("");setPartyId(null);await load();}catch(e){Alert.alert("ثبت پرداخت ناموفق بود",e instanceof Error?e.message:"دوباره امتحان کن.");}finally{setBusy(false)}};
  const label=(t:string)=>t==="worker"?"نیرو":t==="contractor"?"پیمانکار":t==="supplier"?"تأمین‌کننده":"سایر";
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}>
    <Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← بازگشت</Text></Pressable><Text style={{color:BRAND.text,fontSize:29,fontWeight:"900" as const,marginTop:12}}>پرداخت‌ها</Text>
    <View style={{gap:9,marginTop:18}}><Text style={styles.label}>پرداخت به</Text><View style={{flexDirection:"row",gap:8}}>{[["worker","نیرو"],["contractor","پیمانکار"],["supplier","تأمین‌کننده"],["other","سایر"]].map(([v,t])=><Pressable key={v} onPress={()=>{setPartyType(v as PaymentOperation["partyType"]);setPartyId(null)}} style={{flex:1,padding:12,borderRadius:12,borderWidth:1,borderColor:partyType===v?BRAND.accent:BRAND.border,backgroundColor:partyType===v?BRAND.accent:BRAND.surface}}><Text style={{color:"#fff",textAlign:"center" as const,fontSize:12,fontWeight:"800" as const}}>{t}</Text></Pressable>)}</View>
    {partyType!=="other"&&<View style={{gap:8,marginTop:4}}>{parties.map(p=><Pressable key={p.id} onPress={()=>setPartyId(p.id)} style={{padding:13,borderRadius:12,borderWidth:1,borderColor:partyId===p.id?BRAND.accent:BRAND.border,backgroundColor:BRAND.surface}}><Text style={{color:BRAND.text,fontWeight:"800" as const}}>{p.name}</Text></Pressable>)}</View>}
    <TextInput value={amount} onChangeText={setAmount} placeholder="مبلغ به تومان" keyboardType="numeric" placeholderTextColor="#707986" style={styles.input}/>
    <TextInput value={description} onChangeText={setDescription} placeholder="توضیح پرداخت" placeholderTextColor="#707986" style={styles.input}/>
    <View style={{flexDirection:"row",gap:8}}>{[["cash","نقدی"],["card","کارت"],["transfer","انتقال"],["other","سایر"]].map(([v,t])=><Pressable key={v} onPress={()=>setMethod(v as PaymentOperation["method"])} style={{flex:1,padding:12,borderRadius:12,borderWidth:1,borderColor:method===v?BRAND.accent:BRAND.border,backgroundColor:method===v?BRAND.accent:BRAND.surface}}><Text style={{color:"#fff",textAlign:"center" as const,fontSize:12,fontWeight:"800" as const}}>{t}</Text></Pressable>)}</View>
    <Pressable disabled={busy} onPress={add} style={[styles.primary,{opacity:busy?.6:1}]}><Text style={styles.primaryText}>{busy?"در حال ثبت...":"ثبت پرداخت"}</Text></Pressable></View>
    <View style={{gap:10,marginTop:22}}>{items.map(p=><View key={p.id} style={styles.card}><View style={{flexDirection:"row",justifyContent:"space-between"}}><Text style={styles.title}>{label(p.party_type)}</Text><Text style={styles.amount}>{Number(p.amount).toLocaleString("fa-IR")} تومان</Text></View><Text style={styles.sub}>{p.description||"بدون توضیح"} · {p.payment_date}</Text></View>)}</View>
  </ScrollView></SafeAreaView>;
}
const styles={label:{color:BRAND.muted,fontSize:12},input:{backgroundColor:BRAND.surface,color:BRAND.text,padding:15,borderRadius:13,borderWidth:1,borderColor:BRAND.border},primary:{backgroundColor:BRAND.accent,padding:15,borderRadius:13},primaryText:{color:"#fff",textAlign:"center" as const,fontWeight:"900" as const},card:{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:17,padding:17},title:{color:BRAND.text,fontWeight:"800" as const},amount:{color:BRAND.text,fontWeight:"900" as const},sub:{color:BRAND.muted,marginTop:5}};
