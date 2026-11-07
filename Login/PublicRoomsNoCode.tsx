import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TouchableOpacity,ActivityIndicator,RefreshControl} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {supabase} from '../lib/supabase';
import {colors} from '../lib/theme';

const dateKey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const ROOM_GROUPS:Record<string,string>={};
const surface='#fffdfa';
export default function PublicRoomsNoCode({navigation}:any){
  const [days,setDays]=useState(0);
  const [rooms,setRooms]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState('');
  const day=useMemo(()=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return d},[days]);
  const load=async()=>{
    setError('');
    const {data,error:e}=await supabase.rpc('public_room_availability',{target_date:dateKey(day)});
    if(e){setRooms([]);setError('Room availability is temporarily unavailable. Please contact CareFur.');}
    else setRooms(data??[]);
    setLoading(false);setRefreshing(false);
  };
  useEffect(()=>{let active=true;setLoading(true);(async()=>{const {data,error:e}=await supabase.rpc('public_room_availability',{target_date:dateKey(day)});if(!active)return;
    if(e){setRooms([]);setError('Room availability is temporarily unavailable. Please contact CareFur.');}
    else{setError('');setRooms(data??[])}setLoading(false);setRefreshing(false)})();return()=>{active=false}},[day]);
  const available=rooms.filter(r=>r.availability_status==='available'||r.available===true).length;
  const roomNumber=(r:any)=>String(r.room_number??r.requested_room_number??'').replace(/^R0*/i,'');
  return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
    <ScrollView contentContainerStyle={{padding:20,paddingBottom:45}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={colors.primary}/>}>
      <TouchableOpacity onPress={()=>navigation.goBack()} accessibilityLabel="Back" style={{flexDirection:'row',alignItems:'center',marginBottom:16}}><Ionicons name="arrow-back" size={20} color={colors.primary}/><Text style={{marginLeft:8,color:colors.primary,fontWeight:'700'}}>Back</Text></TouchableOpacity>
      <Text style={{fontSize:29,fontWeight:'800',color:colors.primaryDark}}>Find their perfect room</Text>
      <Text style={{fontSize:14,lineHeight:22,color:colors.textSecondary,marginTop:7,marginBottom:22}}>Explore CareFur's rooms and availability. No boarding code required.</Text>
      <View style={{backgroundColor:'#e8f4f0',borderRadius:22,padding:18,borderWidth:1,borderColor:'#cee5dc',marginBottom:16}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'700'}}>ROOM AVAILABILITY</Text><Text style={{fontSize:24,fontWeight:'800',color:colors.primaryDark,marginTop:4}}>{loading?'Checking...':error?'Unavailable':`${available} of ${rooms.length} available`}</Text></View><View style={{backgroundColor:'#fff',borderRadius:18,padding:13}}><Ionicons name="home-outline" size={26} color={colors.primary}/></View></View>
        <Text style={{fontSize:12,color:colors.textSecondary,marginTop:9}}>Availability is for the selected day. Dates for an entire stay must be confirmed when reserving.</Text>
      </View>
      <View style={{backgroundColor:'#fff',borderRadius:18,padding:13,marginBottom:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:colors.border}}>
        <TouchableOpacity disabled={days===0} onPress={()=>setDays(d=>Math.max(0,d-1))} accessibilityLabel="Previous day" style={{padding:10,opacity:days === 0 ? 0.3 : 1}}><Ionicons name="chevron-back" size={22} color={colors.primary}/></TouchableOpacity>
        <View style={{alignItems:'center'}}><Text style={{fontSize:11,fontWeight:'700',color:colors.textSecondary}}>SELECTED DATE</Text><Text style={{fontSize:16,fontWeight:'800',color:colors.primaryDark,marginTop:3}}>{day.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</Text></View>
        <TouchableOpacity onPress={()=>setDays(d=>d+1)} accessibilityLabel="Next day" style={{padding:10}}><Ionicons name="chevron-forward" size={22} color={colors.primary}/></TouchableOpacity>
      </View>
      {loading?<ActivityIndicator color={colors.primary} size="large" style={{marginTop:28}}/>:error?<Text style={{color:colors.danger,lineHeight:21}}>{error}</Text>:rooms.length===0?<View style={{padding:30,alignItems:'center',backgroundColor:surface,borderRadius:20}}><Ionicons name="bed-outline" size={36} color={colors.primary}/><Text style={{marginTop:10,color:colors.textSecondary}}>No room data is available for this date.</Text></View>:
        rooms.map((r:any,i:number)=>{const name=r.room_name|| (r.room_number?`Room ${roomNumber(r)}`:`Room ${i+1}`);const isAvailable=r.availability_status==='available'||r.available===true;return <View key={String(r.room_id||r.id||i)} style={{backgroundColor:surface,borderWidth:1,borderColor:colors.border,borderRadius:22,padding:16,marginBottom:12,flexDirection:'row',alignItems:'center'}}>
          <View style={{width:56,height:58,borderRadius:17,backgroundColor:isAvailable?'#e4f1ed':'#f0efeb',justifyContent:'center',alignItems:'center',marginRight:14}}><Ionicons name="bed-outline" size={25} color={isAvailable?colors.primary:colors.textMuted}/></View>
          <View style={{flex:1,marginRight:8}}><Text style={{fontSize:16,fontWeight:'800',color:colors.primaryDark}} numberOfLines={2}>{name}</Text><Text style={{fontSize:12,color:colors.textSecondary,marginTop:4}}>Room {r.room_number??i+1}</Text></View>
          <View style={{backgroundColor:isAvailable?'#e7f5ea':'#fff1dd',borderRadius:50,paddingHorizontal:10,paddingVertical:8,flexDirection:'row',alignItems:'center'}}><Ionicons name={isAvailable?'checkmark-circle':'time-outline'} size={14} color={isAvailable?'#23834a':'#a66b16'}/><Text style={{fontSize:11,fontWeight:'800',color:isAvailable?'#23834a':'#a66b16',marginLeft:4}}>{isAvailable?'Available':'Unavailable'}</Text></View>
        </View>})}
      <View style={{padding:17,backgroundColor:'#f3f7f5',borderRadius:16,marginTop:10}}><Text style={{fontSize:12,lineHeight:19,color:colors.textSecondary}}>Room status may change as new reservations are received. Contact CareFur to confirm availability for your intended check-in and check-out dates.</Text></View>
    </ScrollView>
  </SafeAreaView>
}
