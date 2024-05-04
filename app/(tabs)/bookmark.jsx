import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { getBookmarkedVideosForUser } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
const Bookmark = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(() => getBookmarkedVideosForUser(user.$id));
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        // data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} refetch={refetch}/>
        )}
        ListHeaderComponent={() => (
          <View className="px-4 my-6 space-y-6">
            <View className="flex-row items-start justify-between my-3">
              <View>
                <Text className="text-2xl text-white font-psemibold">
                  Bookmarks
                </Text>
              </View>
            </View>
            <SearchInput placeholder='Search your bookmarked'/>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No bookmarked videos"
            placeholder='Back to Explorer'
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
