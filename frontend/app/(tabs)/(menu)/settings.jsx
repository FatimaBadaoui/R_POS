import React, { useState } from "react";
import { View, Text, Switch, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import { useTheme } from "../../../contexts/themeContext.jsx";
import { router } from "expo-router";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState("en");
  const { theme, toggleTheme } = useTheme();

  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";

  return (
    <SafeAreaView
      className={`flex-1 justify-center items-center pt-16 ${bgColor}`}
    >
      <Text className={`text-3xl font-bold mb-6 ${textColor}`}>Settings</Text>
      <View className="w-[80%] space-y-4">
        <View className="flex flex-row justify-between items-center">
          <Text className={`text-lg ${textColor}`}>Notifications</Text>
          <View className="transform scale-150">
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#C8C8C8" : "#FFFFFF"}
              trackColor={{ false: "#B46617", true: "#6D9773" }}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className={`text-lg ${textColor}`}>Theme</Text>
          <View className="w-[50%] bg-white rounded-lg border border-[#828282] h-12 justify-center">
            <Picker
              selectedValue={theme}
              onValueChange={(itemValue) => toggleTheme()}
              className="w-full h-full"
            >
              <Picker.Item label="Light" value="light" />
              <Picker.Item label="Dark" value="dark" />
            </Picker>
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className={`text-lg ${textColor}`}>Language</Text>
          <View className="w-[50%] bg-white rounded-lg border border-[#828282] h-12 justify-center">
            <Picker
              selectedValue={language}
              onValueChange={(itemValue) => setLanguage(itemValue)}
              className="w-full h-full"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="German" value="de" />
              <Picker.Item label="Arabic" value="ar" />
            </Picker>
          </View>
        </View>
        <View className="w-full flex items-center mt-20">
          <CustomButton
            text="Save"
            containerStyles="w-[50%] mt-20"
            handlePress={() => {
              /* Handle save action */
              router.push("/(tabs)/(menu)");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
