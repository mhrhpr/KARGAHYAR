import {useCallback,useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {queueAndSync,ExpenseOperation} from "../lib/offline";
import {BRAND} from "../lib/brand";

type Expense={id:string;expense_date:string;category:string;description:string|null;amount:number};

export default function Expenses(){
  const {projectId}=useLocalSearchParams<{projectId:string}>(); const [items,setItems]=useState<Expense[]>([]);
  const [category,setCategory]=useState("متفرقه"); const [description,setDescription]=useState(""); const [amount,setAmount]=useState(""); const [busy,setBusy]=useState(false);
  const load=async()=>{if(!projectId)return;const {data}=await supabase.from("expenses").select("id,expense_date,category,description,amount").eq("project_id",projectId).order("expense_date",{ascending:false});setItems(data||[])}; useFocusEffect(useCallback(()=>{load()},[projectId]));
  const add=async()=>{if(!projectId||!amount)return;setBusy(true);const op:ExpenseOperation={kind:"expense",projectId:projectId!,expenseDate:new Date().toISOString().slice(0,10),category:category.trim()||"متفرقه",description:description.trim(),amount:Number(amount.replace(/[^0-9.]/g,""))||0};const r=await queueAndSync(op);setBusy(false);setAmount("");setDescription("");Alert.alert(r.queued?"ذخیره شد":"ثبت شد",r.queued?"هزینه روی گوشی نگه داشته شد تا اتصال برقرار شود.":"هزینه با موفقیت ثبت شد.");await load()};
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}>
    <Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← بازگشت</Text></Pressable><Text style={{color:BRAND.text,fontSize:29,fontWeight:"900" as const,marginTop:12}}>هزینه‌های پروژه</Text>
    <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:18,padding:16,marginTop:20,gap:10}}>
      <TextInput value={category} onChangeText={setCategory} placeholder="دسته هزینه" placeholderTextColor="#707986" style={styles.input}/>
      <TextInput value={description} onChangeText={setDescription} placeholder="توضیح" placeholderTextColor="#707986" style={styles.input}/>
      <TextInput value={amount} onChangeText={setAmount} placeholder="مبلغ به تومان" keyboardType="numeric" placeholderTextColor="#707986" style={styles.input}/>
      <Pressable disabled={busy} onPress={add} style={styles.primary}><Text style={styles.primaryText}>{busy?"در حال ثبت...":"ثبت هزینه"}</Text></Pressable>
    </View>
    <View style={{gap:10,marginTop:20}}>{items.map(e=><View key={e.id} style={styles.card}><View style={{flexDirection:"row",justifyContent:"space-between"}}><Text style={styles.title}>{e.category}</Text><Text style={styles.amount}>{Number(e.amount).toLocaleString("fa-IR")} تومان</Text></View><Text style={styles.sub}>{e.description||"بدون توضیح"} · {e.expense_date}</Text></View>)}</View>
  </ScrollView></SafeAreaView>;
}
const styles={input:{backgroundColor:BRAND.bg,color:BRAND.text,padding:15,borderRadius:13,borderWidth:1,borderColor:BRAND.border},primary:{backgroundColor:BRAND.accent,padding:15,borderRadius:13},primaryText:{color:"#fff",textAlign:"center" as const,fontWeight:"900" as const},card:{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:17,padding:17},title:{color:BRAND.text,fontSize:17,fontWeight:"800" as const},amount:{color:BRAND.text,fontWeight:"900" as const},sub:{color:BRAND.muted,marginTop:5}};
