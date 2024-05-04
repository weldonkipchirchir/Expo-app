import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import CustomButton from './CustomButton'
import { router } from "expo-router";

const EmptyState = ({title, subtitle, placeholder}) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[260px] h-[200px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center mt-2 text-white font-psemibold">{title}</Text>
      <Text className="text-sm text-gray-100 font-pmedium">{subtitle}</Text>
      <CustomButton title={placeholder? placeholder:"create video"}
      handlePress={()=>router.push('/create')}
      containerStyles='w-full my-5'
      />
    </View>
  );
};

export default EmptyState;
