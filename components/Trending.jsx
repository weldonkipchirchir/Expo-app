import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { useState, memo } from "react";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";
const zoomIn = {
  0: {
    scale: 0.6,
  },
  1: {
    scale: 0.8,
  },
};
const zoomOut = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 0.6,
  },
};
const TrendingItem = memo(({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-3"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          onPress={() => setPlay(true)}
          activeOpacity={0.7}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <ImageBackground
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
});

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanges = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
