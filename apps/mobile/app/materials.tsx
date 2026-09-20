import {useCallback,useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {supabase} from "../lib/supabase";
import {queueAndSync,MaterialOperation} from "../lib/offline";
import {BRAND} from "../lib/brand";

type Material={id:string;name:string;unit:string;current_stock:number;reorder_point:number};

export default function Materials(){
  const {projectId}=useLocalSearchParams<{projectId:string}>(); const [items,setItems]=useState<Material[]>([]);
  const [name,setName]=useState(""); const [unit,setUnit]=useState("کیسه"); const [stock,setStock]=useState("0"); const [reorder,setReorder]=useState("5"); const [consumeQty,setConsumeQty]=useState("1"); const [busy,setBusy]=useState(false);
  const load=async()=>{if(!projectId)return;const {data}=await supabase.from("materials").select("id,name,unit,current_stock,reorder_point").eq("project_id",projectId).order("name");setItems(data||[])}; useFocusEffect(useCallback(()=>{load()},[projectId]));
  const add=async()=>{if(!projectId||!name.trim())return;setBusy(true);const {error}=await supabase.from("materials").insert({project_id:projectId,name:name.trim(),unit:unit.trim()||"واحد",current_stock:Number(stock)||0,reorder_point:Number(reorder)||0});setBusy(false);if(error)Alert.alert("ثبت مصالح ناموفق بود",error.message);else{setName("");setStock("0");await load();}};
  const consume=async(item:Material)=>{const quantity=Number(consumeQty.replace(/[^0-9.]/g,""))||0; if(quantity<=0)return;const op:MaterialOperation={kind:"material",projectId:projectId!,materialId:item.id,transactionType:"out",quantity,unitCost:0,note:"مصرف ثبت‌شده",transactionDate:new Date().toISOString().slice(0,10)};const res=await queueAndSync(op);Alert.alert(res.queued?"ذخیره شد":"ثبت شد",res.queued?"مصرف روی گوشی نگه داشته شد تا اتصال برقرار شود.":"مصرف یک "+item.unit+" ثبت شد.");load()};
  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}><ScrollView contentContainerStyle={{paddingBottom:40}}>
    <Pressable onPress={()=>router.back()}><Text style={{color:BRAND.muted}}>← بازگشت</Text></Pressable><Text style={{color:BRAND.text,fontSize:29,fontWeight:"900",marginTop:12}}>مصالح</Text>
    <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:18,padding:16,marginTop:20,gap:10}}>
      <TextInput value={name} onChangeText={setName} placeholder="نام ماده، مثلاً گچ" placeholderTextColor="#707986" style={styles.input}/>
      <TextInput value={unit} onChangeText={setUnit} placeholder="واحد" placeholderTextColor="#707986" style={styles.input}/>
      <TextInput value={stock} onChangeText={setStock} placeholder="موجودی اولیه" keyboardType="numeric" placeholderTextColor="#707986" style={styles.input}/>
      <TextInput value={reorder} onChangeText={setReorder} placeholder="حد هشدار خرید" keyboardType="numeric" placeholderTextColor="#707986" style={styles.input}/>
      <Pressable disabled={busy} onPress={add} style={styles.primary}><Text style={styles.primaryText}>{busy?"در حال ثبت...":"افزودن ماده"}</Text></Pressable>
    </View>
    <View style={{gap:10,marginTop:20}}>{items.map(item=>{const low=Number(item.current_stock)<=Number(item.reorder_point);return <View key={item.id} style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:low?"#7A4A26":BRAND.border,borderRadius:18,padding:17}}>
      <View style={{flexDirection:"row",justifyContent:"space-between"}}><Text style={{color:BRAND.text,fontSize:18,fontWeight:"900"}}>{item.name}</Text><Text style={{color:low?"#F2B56B":"#7DD3A7",fontWeight:"800"}}>{low?"⚠️ نیاز به خرید":"موجودی مناسب"}</Text></View>
      <Text style={{color:BRAND.muted,marginTop:5}}>موجودی: {Number(item.current_stock).toLocaleString("fa-IR")} {item.unit}</Text>
      <Text style={{color:BRAND.muted}}>حد هشدار: {Number(item.reorder_point).toLocaleString("fa-IR")} {item.unit}</Text>
      <View style={{flexDirection:"row",gap:8,alignItems:"center",marginTop:12}}><TextInput value={consumeQty} onChangeText={setConsumeQty} keyboardType="numeric" placeholder="مقدار مصرف" placeholderTextColor="#707986" style={{flex:1,backgroundColor:BRAND.bg,color:BRAND.text,padding:12,borderRadius:12,borderWidth:1,borderColor:BRAND.border}}/><Pressable onPress={()=>consume(item)} style={{backgroundColor:BRAND.accent,padding:13,borderRadius:12}}><Text style={{color:"#fff",fontWeight:"900"}}>ثبت مصرف</Text></Pressable></View>
    </View>})}</View>
  </ScrollView></SafeAreaView>;
}
const styles={input:{backgroundColor:BRAND.bg,color:BRAND.text,padding:15,borderRadius:13,borderWidth:1,borderColor:BRAND.border},primary:{backgroundColor:BRAND.accent,padding:15,borderRadius:13},primaryText:{color:"#fff",textAlign:"center",fontWeight:"900"}};
