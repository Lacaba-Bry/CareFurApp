import React,{useCallback,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,ActivityIndicator,TouchableOpacity,RefreshControl,Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {supabase} from '../lib/supabase';
import {colors} from '../lib/theme';
export default function MyPetsNoCode({navigation}:any){
const [pets,setPets]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[refreshing,setRefreshing]=useState(false);
const load=useCallback(async()=>{try{setError('');const {data,error:err}=await supabase.functions.invoke('get-my-pets',{body:{}});if(err)throw err;if(data?.error)throw new Error(data.error);setPets(data?.pets??[]);}catch(e:any){setError(e?.message??'Unable to load your pets');}finally{setLoading(false);setRefreshing(false)}},[]);
useFocusEffect(useCallback(()=>{load()},[load]));
return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:21}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} />}>
<Text style={{fontSize:28,fontWeight:'800',color:colors.primaryDark,marginBottom:7}}>My Pets</Text><Text style={{color:colors.textSecondary,marginBottom:24}}>Pets linked to your confirmed CareFur account email. Boarding codes aren't required to view this list.</Text>
{loading?<ActivityIndicator color={colors.primary}/>:error?<Text style={{color:colors.danger}}>{error}</Text>:pets.length===0?<View style={{backgroundColor:'#fff',borderRadius:20,padding:28,alignItems:'center'}}><Ionicons name="paw-outline" size={44} color={colors.primary}/><Text style={{fontWeight:'700',fontSize:18,marginTop:10,color:colors.primaryDark}}>No linked pets yet</Text><Text style={{textAlign:'center',marginTop:8,color:colors.textSecondary}}>Ask CareFur staff to link your pet record to your registered email.</Text></View>:pets.map(p=><TouchableOpacity onPress={()=>navigation.getParent()?.navigate('PetProfile',{pet:p,sharedViewer:false})} key={p.id} style={{backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:20,padding:15,flexDirection:'row',alignItems:'center',marginBottom:12}}>{p.photo_url?<Image source={{uri:p.photo_url}} style={{height:66,width:66,borderRadius:15,marginRight:13}}/>:<Ionicons name="paw" size={36} color={colors.primary} style={{marginRight:15}}/>}<View style={{flex:1}}><Text style={{fontSize:20,fontWeight:'800',color:colors.primaryDark}}>{p.name}</Text><Text style={{color:colors.textSecondary}}>{p.species}{p.breed?' · '+p.breed:''}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.textMuted}/></TouchableOpacity>)}
</ScrollView></SafeAreaView>}
