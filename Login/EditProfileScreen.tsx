import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';



export default function EditProfileScreen({navigation}:any){

return (

<SafeAreaView style={styles.container}>


<Text style={styles.header}>
Edit Profile
</Text>



<TouchableOpacity
onPress={()=>navigation.goBack()}
>

<Text style={styles.back}>
‹
</Text>

</TouchableOpacity>





<View style={styles.photoContainer}>


<Image

source={require('../assets/Login/Logo.jpg')}

style={styles.profileImage}

/>


<Text style={styles.change}>
Change Picture
</Text>


</View>






<View style={styles.form}>


<Input
label="First Name:"
placeholder="Beia"
/>


<Input
label="Last Name:"
placeholder="Ann"
/>


<Input
label="Birthday:"
placeholder="MM/DD/YY"
/>


<Input
label="Age:"
placeholder="23"
/>





<View style={styles.inputRow}>

<Text style={styles.label}>
Sex:
</Text>


<View style={styles.select}>

<Text>
⌄
</Text>

</View>


</View>



</View>







<View style={styles.buttons}>


<TouchableOpacity style={styles.cancel}>

<Text style={styles.cancelText}>
CANCEL
</Text>

</TouchableOpacity>





<TouchableOpacity style={styles.apply}>

<Text style={styles.applyText}>
APPLY
</Text>

</TouchableOpacity>


</View>






<Image

source={require('../assets/Login/LogoSignup.png')}

style={styles.dog}

resizeMode="cover"

/>




</SafeAreaView>

);

}







function Input({

label,
placeholder

}:{
label:string;
placeholder:string;
}){


return(

<View style={styles.inputRow}>


<Text style={styles.label}>
{label}
</Text>


TextInput

<View style={styles.input}>

<TextInput

placeholder={placeholder}

style={{flex:1,fontSize:12}}

/>

</View>


</View>


)

}







const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:'#FFFDF8',
padding:15,
},



header:{
fontSize:12,
color:'#ddd',
},



back:{
fontSize:40,
marginTop:10,
},



photoContainer:{
alignItems:'center',
},



profileImage:{
width:70,
height:70,
borderRadius:50,
},



change:{
fontSize:10,
},




form:{
backgroundColor:'#D6C292',
borderRadius:20,
padding:15,
marginTop:10,
},



inputRow:{
flexDirection:'row',
alignItems:'center',
marginBottom:12,
},



label:{
width:80,
fontSize:11,
},



input:{
backgroundColor:'white',
borderRadius:10,
height:25,
flex:1,
borderWidth:1,
borderColor:'#555',
},




select:{
backgroundColor:'white',
borderRadius:10,
height:25,
flex:1,
alignItems:'flex-end',
paddingRight:10,
},




buttons:{
flexDirection:'row',
justifyContent:'flex-end',
gap:8,
marginTop:8,
},




cancel:{
backgroundColor:'#aaa',
paddingHorizontal:15,
paddingVertical:7,
borderRadius:20,
},


apply:{
backgroundColor:'#0B6E71',
paddingHorizontal:15,
paddingVertical:7,
borderRadius:20,
},



cancelText:{
color:'white',
fontSize:11,
},


applyText:{
color:'white',
fontSize:11,
},




dog:{
position:'absolute',
bottom:0,
left:40,
width:250,
height:170,
},


});