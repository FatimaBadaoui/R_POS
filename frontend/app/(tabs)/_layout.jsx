import React, { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Tabs, useRootNavigationState, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import menu from "../../assets/icons/menu.png";
import home from "../../assets/icons/home.png";
import profile from "../../assets/icons/profile.png";
import TabIcon from "../../components/TabIcon.jsx";
import DropDownMenu from "../../components/DropDownMenu.jsx";
import Header from "../../components/Header.jsx";

const TabsLayout = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const router = useRouter();
  const navigationState = useRootNavigationState();

  const handleBack = () => {
    if (navigationState && navigationState.routes.length > 1) {
      router.back();
    } else {
      Alert.alert("No screen to go back to.");
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.get(
        "https://sour-turtle-53.loca.lt/users/logout",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userData");
        Alert.alert("Logged out successfully");
        router.push("/");
      } else {
        Alert.alert("Logout failed, please try again");
      }
    } catch (error) {
      Alert.alert("An error occurred, please try again");
    }
    setMenuVisible(false);
  };

  const handleProfile = () => {
    setMenuVisible(false);
    router.push("/(profile)");
  };

  const handleSettings = () => {
    setMenuVisible(false);
    router.push("/(menu)/settings");
  };

  return (
    <>
      <Header handleBack={handleBack} />
      <DropDownMenu
        visible={menuVisible}
        onClose={toggleMenu}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
      />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#7CA982",
          tabBarInactiveTintColor: "#F1F7ED",
          tabBarStyle: {
            backgroundColor: "#152E2B",
            borderTopWidth: 1,
            borderTopColor: "#E0EEC6",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="(menu)"
          options={{
            title: "Menu",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TouchableOpacity onPress={toggleMenu}>
                <TabIcon
                  icon={menu}
                  name="Menu"
                  color={color}
                  focused={focused}
                />
              </TouchableOpacity>
            ),
          }}
          listeners={({}) => ({
            tabPress: (e) => {
              e.preventDefault();
              toggleMenu();
            },
          })}
        />
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={home}
                name="Home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={profile}
                name="Profile"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
