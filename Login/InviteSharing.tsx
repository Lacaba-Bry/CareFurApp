import React,{useCallback,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TextInput,TouchableOpacity,ActivityIndicator,Alert,Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {colors} from '../lib/theme';
import {supabase} from '../lib/supabase';
import {isSharedViewer} from '../lib/accessMode';
const emailRE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function InviteSharing({navigation,route}:any){
 const params=route?.params??{};
 const code=params.accessCode;
 const permitted=!!code&&!isSharedViewer(params);
 const [invitees,setInvitees]=useState<any[]>([]),[email,setEmail]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const load=useCallback(async()=>{if(!permitted)return;setLoading(true);setError('');try{const {data,error}=await supabase.functions.invoke('manage-sharing',{body:{code,action:'list'}});if(error){const response=await error.context?.json?.().catch(()=>null);throw Error(response?.error||error.message);}if(data?.error)throw Error(data.error);setInvitees(data?.invites??[]);}catch(e:any){setError(e?.message||'Could not load invitations');}finally{setLoading(false)}},[code,permitted]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 const act=async(action:string,target?:string)=>{if(!permitted||busy)return;setBusy(true);setError('');setNotice('');try{const invited=email.trim().toLowerCase();if(action==='invite'&&!emailRE.test(invited))throw Error('Enter a valid email address.');const {data,error}=await supabase.functions.invoke('manage-sharing',{body:{code,action,email:action==='invite'?invited:target}});if(error){const message=await error.context?.json?.().catch(()=>null);throw Error(message?.error||error.message);}if(data?.error)throw Error(data.error);setEmail('');setNotice(action==='invite'?'Invitation email sent.': 'Invitation revoked.');await load();}catch(e:any){setError(e.message||'Request failed');}finally{setBusy(false)}};
 const revoke=(e:string)=>{if(Platform.OS==='web'){if(window.confirm('Revoke access for '+e+'?'))act('revoke',e);}else Alert.alert('Revoke access?',e,[{text:'Cancel'},{text:'Revoke',style:'destructive',onPress:()=>act('revoke',e)}]);};
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:22}} keyboardShouldPersistTaps="handled">
  <TouchableOpacity onPress={()=>navigation.canGoBack()?navigation.goBack():navigation.navigate('MainTabs')} style={{paddingVertical:8}}><Text style={{color:colors.primary,fontWeight:'700'}}>‹ Back</Text></TouchableOpacity>
  <Text style={{color:colors.primaryDark,fontSize:28,fontWeight:'800',marginTop:8}}>Invite Sharing</Text>
  <Text style={{color:colors.textSecondary,marginTop:8,lineHeight:21}}>Invite up to five trusted people to view this boarding stay. Viewers can see your pet, feeding and authorized camera, but cannot edit, message staff, manage invites, or see room availability.</Text>
  {!permitted?<View style={{backgroundColor:'#e1e6e5',marginTop:25,padding:27,borderRadius:20,alignItems:'center'}}><Ionicons name="lock-closed" size={34} color={colors.primaryDark}/><Text style={{fontWeight:'800',color:colors.primaryDark,marginTop:13}}>Owner boarding access required</Text></View>:<>
    <View style={{backgroundColor:'#fff',marginTop:23,padding:17,borderRadius:19,borderWidth:1,borderColor:colors.border}}><Text style={{color:colors.primaryDark,fontWeight:'800'}}>Invite an email address</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="family@gmail.com" style={{borderWidth:1,borderColor:colors.border,borderRadius:13,marginVertical:12,padding:13,color:colors.primaryDark}}/><TouchableOpacity disabled={busy||invitees.length>=5} onPress={()=>act('invite')} style={{backgroundColor:colors.primary,opacity:busy||invitees.length>=5?.5:1,alignItems:'center',padding:15,borderRadius:24}}><Text style={{color:'#fff',fontWeight:'800'}}>Send Invitation ({invitees.length}/5)</Text></TouchableOpacity></View>
    <Text style={{color:colors.primaryDark,fontSize:18,fontWeight:'800',marginTop:25,marginBottom:10}}>Shared Viewers</Text>
    {loading?<ActivityIndicator color={colors.primary}/>:invitees.length===0?<Text style={{color:colors.textSecondary}}>No invitations yet.</Text>:invitees.map(item=><View key={item.id} style={{backgroundColor:'#fff',borderRadius:13,padding:15,marginBottom:9,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:colors.border}}><Ionicons name="mail-outline" size={22} color={colors.primary}/><View style={{flex:1,marginLeft:10}}><Text style={{fontWeight:'700',color:colors.primaryDark}}>{item.invited_email}</Text><Text style={{color:colors.textSecondary,marginTop:3}}>{item.redeemed_at?'Accepted':'Invitation pending'}</Text></View><TouchableOpacity onPress={()=>revoke(item.invited_email)}><Text style={{color:'#b43d3d',fontWeight:'800'}}>Revoke</Text></TouchableOpacity></View>)}
  </>}
  {!!error&&<Text style={{color:'#b43d3d',marginTop:15}}>{error}</Text>}{!!notice&&<Text style={{color:colors.primary,marginTop:15}}>{notice}</Text>}
 </ScrollView></SafeAreaView>
}
