import { Text, View, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center'>
      <Image
        source={icon}
        resizeMode="contain"
        className="w-6 h-6"
        tintColor={color}
      />
      <Text className={`${focused ? 'font-psemibold': 'font-pregular'} text-xs`} style={{color:color}}>{name}</Text>
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{tabBarShowLabel: false,
      headerShown:false,
        tabBarActiveTintColor: "#ffa001",
        tabBarInactiveTintColor: "#cdcde0",
        tabBarStyle: {
            backgroundColor: "#161622",
            borderTopColor: "#232533",
            borderTopWidth: 1,
            height: 50,
        }
    }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                name="Home"
                icon={icons.home}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                name="Bookmark"
                icon={icons.bookmark}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                name="Create"
                icon={icons.plus}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                name="Profile"
                icon={icons.profile}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
