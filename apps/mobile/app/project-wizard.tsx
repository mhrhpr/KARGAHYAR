import {useMemo,useState} from "react";
import {Alert,Pressable,SafeAreaView,ScrollView,Text,TextInput,View} from "react-native";
import {router} from "expo-router";
import {supabase} from "../lib/supabase";
import {BRAND} from "../lib/brand";

const types=["مسکونی","تجاری","اداری","تولیدی","عمرانی","بازسازی","تعمیرات","انبار/کارگاه"];
const laborModels=["روزمزد","ساعتی","پیمانکاری","واحدی","حجمی","مرحله‌ای","توافقی"];

const Toggle=({title,active,onPress,desc}:{title:string;active:boolean;onPress:()=>void;desc:string})=><Pressable onPress={onPress} style={{padding:15,borderRadius:15,borderWidth:1,borderColor:active?BRAND.accent:BRAND.border,backgroundColor:active?"#132A57":BRAND.surface}}><View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center"}}><View style={{width:24,height:24,borderRadius:7,borderWidth:1,borderColor:active?"#93B4FF":BRAND.border,backgroundColor:active?BRAND.accent:"transparent",alignItems:"center",justifyContent:"center"}}><Text style={{color:"#fff",fontWeight:"900"}}>{active?"✓":""}</Text></View><View style={{flex:1,marginRight:12}}><Text style={{color:BRAND.text,fontWeight:"800",fontSize:16}}>{title}</Text><Text style={{color:active?"#D6E4FF":BRAND.muted,marginTop:3}}>{desc}</Text></View></View></Pressable>;

export default function Wizard(){
  const [step,setStep]=useState(1); const [name,setName]=useState(""); const [type,setType]=useState(types[0]);
  const [address,setAddress]=useState(""); const [client,setClient]=useState(""); const [manager,setManager]=useState("");
  const [area,setArea]=useState(""); const [floors,setFloors]=useState(""); const [capacity,setCapacity]=useState("");
  const [models,setModels]=useState<string[]>(["روزمزد"]); const [modules,setModules]=useState({workers:true,contractors:true,materials:true,expenses:true,progress:true,reports:true,payments:true});
  const [busy,setBusy]=useState(false);

  const toggleModel=(v:string)=>setModels((x)=>x.includes(v)?x.filter(i=>i!==v):[...x,v]);
  const toggleModule=(k:keyof typeof modules)=>setModules((x)=>({...x,[k]:!x[k]}));
  const detailLabel=useMemo(()=>type==="تولیدی"?"ظرفیت/واحد تولید":type==="مسکونی"||type==="تجاری"||type==="اداری"||type==="عمرانی"||type==="بازسازی"||type==="تعمیرات"?"مساحت تقریبی (مترمربع)":"ظرفیت یا مشخصه اصلی",[type]);

  const save=async()=>{
    if(!name.trim())return;
    setBusy(true);
    try{
      const {data:user}=await supabase.auth.getUser();
      if(!user.user){router.replace("/sign-in");return;}
      const code="K-"+Date.now().toString().slice(-6);
      const settings={modules,laborModels:models,details:{area:area.trim()||null,floors:floors.trim()||null,capacity:capacity.trim()||null}};
      const {data,error}=await supabase.from("projects").insert({
        owner_id:user.user.id,name:name.trim(),code,status:"active",project_type:type,
        address:address.trim()||null,client_name:client.trim()||null,manager_name:manager.trim()||null,settings
      }).select("id").single();
      if(error)throw error;
      router.replace({pathname:"/project",params:{id:data.id}});
    }catch(error){Alert.alert("ساخت پروژه انجام نشد",error instanceof Error?error.message:"لطفاً دوباره امتحان کن.");}
    finally{setBusy(false);}
  };

  return <SafeAreaView style={{flex:1,backgroundColor:BRAND.bg,padding:20}}>
    <ScrollView contentContainerStyle={{paddingBottom:40}}>
      <Text style={{color:BRAND.muted}}>ساخت پروژه · مرحله {step} از 4</Text>
      <Text style={{color:BRAND.text,fontSize:29,fontWeight:"900",marginTop:5}}>پروژه جدید</Text>

      {step===1&&<View style={{gap:10,marginTop:24}}>{types.map(t=><Pressable key={t} onPress={()=>{setType(t);setStep(2)}} style={{padding:17,borderRadius:15,borderWidth:1,borderColor:t===type?BRAND.accent:BRAND.border,backgroundColor:BRAND.surface}}><Text style={{color:BRAND.text,fontWeight:"800",fontSize:17}}>{t}</Text></Pressable>)}</View>}

      {step===2&&<View style={{gap:12,marginTop:24}}>
        <Text style={{color:BRAND.text,fontWeight:"800"}}>اطلاعات اصلی</Text>
        <TextInput value={name} onChangeText={setName} placeholder="نام پروژه، مثلاً مسکونی نیاوران" placeholderTextColor="#707986" style={styles.input}/>
        <TextInput value={address} onChangeText={setAddress} placeholder="آدرس پروژه" placeholderTextColor="#707986" style={styles.input}/>
        <TextInput value={client} onChangeText={setClient} placeholder="نام کارفرما (اختیاری)" placeholderTextColor="#707986" style={styles.input}/>
        <TextInput value={manager} onChangeText={setManager} placeholder="مدیر پروژه/کارگاه (اختیاری)" placeholderTextColor="#707986" style={styles.input}/>
        <TextInput value={type==="تولیدی"?capacity:area} onChangeText={type==="تولیدی"?setCapacity:setArea} placeholder={detailLabel} placeholderTextColor="#707986" keyboardType="numeric" style={styles.input}/>
        {(type==="مسکونی"||type==="تجاری"||type==="اداری")&&<TextInput value={floors} onChangeText={setFloors} placeholder="تعداد طبقات (اختیاری)" placeholderTextColor="#707986" keyboardType="numeric" style={styles.input}/>}
        <Pressable disabled={!name.trim()} onPress={()=>setStep(3)} style={{backgroundColor:BRAND.text,padding:16,borderRadius:14,opacity:name.trim()?1:.4}}><Text style={{textAlign:"center",fontWeight:"900",color:BRAND.bg}}>ادامه</Text></Pressable>
      </View>}

      {step===3&&<View style={{gap:10,marginTop:24}}>
        <Text style={{color:BRAND.text,fontSize:18,fontWeight:"900"}}>روش‌های نیروی انسانی</Text>
        {laborModels.map(v=><Toggle key={v} title={v} active={models.includes(v)} onPress={()=>toggleModel(v)} desc={v==="روزمزد"?"محاسبه بر اساس کارکرد روزانه":v==="پیمانکاری"?"محاسبه مقدار × نرخ واحد":"روش پرداخت مورد استفاده در پروژه"}/>)}
        <Text style={{color:BRAND.text,fontSize:18,fontWeight:"900",marginTop:12}}>ماژول‌های پروژه</Text>
        <Toggle title="گزارش روزانه" active={modules.reports} onPress={()=>toggleModule("reports")} desc="ثبت فعالیت‌های روزانه"/>
        <Toggle title="نیروها" active={modules.workers} onPress={()=>toggleModule("workers")} desc="کارکرد و دستمزد"/>
        <Toggle title="پیمانکاران" active={modules.contractors} onPress={()=>toggleModule("contractors")} desc="کارکرد و قراردادهای واحدی"/>
        <Toggle title="مصالح و موجودی" active={modules.materials} onPress={()=>toggleModule("materials")} desc="موجودی و هشدار نقطه سفارش"/>
        <Toggle title="هزینه‌ها" active={modules.expenses} onPress={()=>toggleModule("expenses")} desc="هزینه‌های متفرقه پروژه"/>
        <Toggle title="پرداخت‌ها" active={modules.payments} onPress={()=>toggleModule("payments")} desc="پرداخت‌های ثبت‌شده"/>
        <Toggle title="پیشرفت" active={modules.progress} onPress={()=>toggleModule("progress")} desc="درصد پیشرفت پروژه"/>
        <Pressable onPress={()=>setStep(4)} style={{backgroundColor:BRAND.text,padding:16,borderRadius:14,marginTop:6}}><Text style={{textAlign:"center",fontWeight:"900",color:BRAND.bg}}>ادامه</Text></Pressable>
      </View>}

      {step===4&&<View style={{marginTop:24,gap:12}}>
        <View style={{backgroundColor:BRAND.surface,borderWidth:1,borderColor:BRAND.border,borderRadius:20,padding:20}}>
          <Text style={{color:BRAND.muted}}>پیش‌نمایش</Text><Text style={{color:BRAND.text,fontSize:23,fontWeight:"900",marginTop:8}}>{name}</Text>
          <Text style={{color:BRAND.muted,marginTop:5}}>{type}{address?" · "+address:""}</Text>
          {client&&<Text style={{color:BRAND.muted}}>کارفرما: {client}</Text>}
          {manager&&<Text style={{color:BRAND.muted}}>مدیر: {manager}</Text>}
          <Text style={{color:BRAND.muted}}>روش‌های نیرو: {models.join("، ")}</Text>
          <Text style={{color:BRAND.muted}}>ماژول فعال: {Object.values(modules).filter(Boolean).length} مورد</Text>
        </View>
        <Pressable disabled={busy} onPress={save} style={{backgroundColor:BRAND.accent,padding:16,borderRadius:14,opacity:busy?.6:1}}><Text style={{color:"#fff",textAlign:"center",fontWeight:"900"}}>{busy?"در حال ساخت...":"تأیید و ساخت پروژه"}</Text></Pressable>
        <Pressable onPress={()=>setStep(3)} style={{borderWidth:1,borderColor:BRAND.border,padding:16,borderRadius:14}}><Text style={{color:BRAND.text,textAlign:"center",fontWeight:"800"}}>ویرایش</Text></Pressable>
      </View>}
    </ScrollView>
  </SafeAreaView>;
}
const styles={input:{backgroundColor:BRAND.surface,color:BRAND.text,padding:16,borderRadius:14,borderWidth:1,borderColor:BRAND.border}};
