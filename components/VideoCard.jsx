import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { icons } from "../constants";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { useGlobalContext } from "../context/GlobalProvider";
import { addBookmarkToVideo } from "../lib/appwrite";
const VideoCard = ({
  video: {
    title,
    thumbnail,
    prompt,
    video,
    id,
    bookmarked,
    users: { username, avatar },
  },
  refetch
}) => {
  const [play, setPlay] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const { user } = useGlobalContext();

  const handleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handleBookmarked = async (id, bookmarked) => {
    try {
      if (bookmarked) {
        await addBookmarkToVideo(id, user.$id, false); // Pass the video ID and user ID
        setBookmark(!bookmark);
      } else {
        await addBookmarkToVideo(id, user.$id, true); // Pass the video ID and user ID
        setBookmark(!bookmark);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
        if (refetch) {
          await refetch();
        }
      }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary items-center ">
            <Image
              resizeMode="cover"
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-xs text-gray-100 font-pregular"
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <TouchableOpacity
            className="w-full items-end mb-10"
            onPress={handleMenu}
          >
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
              onPress
            />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setMenuVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handleBookmarked(id, bookmarked)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: bookmark ? "orange" : "black",
                  }}
                >
                  Bookmark
                </Text>
              </TouchableOpacity>
              {/* Add more options here */}
              <Pressable onPress={() => setMenuVisible(false)}>
                <Text
                  style={{ fontSize: 16, color: bookmark ? "black" : "orange" }}
                >
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
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
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          onPress={() => setPlay(true)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
