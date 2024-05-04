import { Text, View, ScrollView, Image, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
const Sign_in = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false)
  const {setUser, user, setIsLoggedIn} = useGlobalContext()

  const submit = async () => {
    if ( form.email ==="" || form.password === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setisSubmitting(true)
    try {
      await signIn(form.email, form.password);
      //set result to global using context
      const result = await getCurrentUser()
      setUser(result)
      setIsLoggedIn(true)
      Alert.alert("Success", "User signed in successfully");
      router.replace('/home')
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[86vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign In to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(value) => setForm({ ...form, email: value})}
            otherStyles="mt-7"
            keyboardType="email-address"
            placehoder="example@gmail.com"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(value) => setForm({ ...form, password: value})}
            otherStyles="mt-7"
            placehoder='password'
          />

          <CustomButton title="Sign In"
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
          <Text className='font-pregular, text-lg text-gray-100'>
            Don't have account?
          </Text>
          <Link href='/sign-up' className="text-lg font-psemibold text-secondary">Sign Up</Link>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sign_in;
