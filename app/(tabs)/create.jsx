import { ScrollView, Text, TouchableOpacity, Image, View, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from 'expo-document-picker'
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { createVideoPost } from "../../lib/appwrite";
const Create = () => {
  const [ uploading, setUploading ] = useState(false);
  const { user } = useGlobalContext();

  const [ form, setForm ] = useState({
    title: "",
    video: null,
    thumbnail: null, 
    prompt: "",
  });

  const openPicker = async (selectType)=>{
    const result = await DocumentPicker.getDocumentAsync({
      type:selectType === "image" ?
      ['image/png', 'image/jpg', 'image/jpeg'] :
      ['video/mp4', 'video/gif']
    })

    if (!result.canceled){
      if (selectType === 'image'){
        setForm({...form, thumbnail: result.assets[0]})
      }
      if (selectType === 'video'){
        setForm({...form, video: result.assets[0]})
      }
    } else {
      setTimeout(()=> {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2))
      }, 100)
    }
  }

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="texxt-2xl text-white">Upload video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placehoder="Give your video a catch title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={()=>openPicker('video')}>
            {
              form.video ?
            (
              <Video
                source={{uri : form.video.uri}}
                className='w-full h-64 rounded-2xl'
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            )
              :
              (
                <View className="w-full rounded-2xl bg-black-100 justify-center items-center h-40 px-4 ">
                  <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
        <View className='mt-7 space-y-2'>
        <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={()=>openPicker('image')}>
            {
              form.thumbnail ?
            (
            <Image
              source={{uri: form.thumbnail.uri}}
              resizeMode="cover"
              className="w-full h-64 rounded-2xl"
            />
            )
              :
              (
                <View className="w-full rounded-2xl bg-black-100 justify-center items-center h-16 px-4 border-2  border-black-200 flex-row space-x-2 ">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-5 h-5"
                    />
                  <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
                  </View>
              )
            }
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placehoder="THe prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
