import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";
const SearchInput = ({initialQuery, placeholder}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery||"");
  return (
    <View
      className={`w-full h-[53px] px-4 bg-black-100 rounded-md items-center border-2 border-black-200 focus:border-secondary flex-row space-x-4`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder ? placeholder :"Search for a video topic"}
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please enter something to research results across the database"
            );
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} resizeMode="contain" className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
