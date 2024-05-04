import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { icons } from '../constants'
const FormField = ({title, value, keyboardType, placehoder, otherStyles, handleChangeText, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View className={`w-full h-16 px-4 bg-black-100 rounded-md items-center border-2 border-black-200 focus:border-secondary flex-row`}>
        <TextInput
            className="flex-1 text-white font-psemibold text-base"
            value={value}
            placeholder={placehoder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />
        {
            title === 'Password' && (<TouchableOpacity onPress={()=> setshowPassword(!showPassword)}>
                <Image className='w-6 h-6' resizeMode='contain' source={!showPassword ? icons.eye : icons.eyeHide}/>
            </TouchableOpacity>)
        }

        
      </View>
      
    </View>
  )
}

export default FormField