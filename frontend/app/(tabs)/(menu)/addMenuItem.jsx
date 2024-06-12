import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import MenuForm from "../../../components/MenuForm.jsx";
import { useState } from "react";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { router } from "expo-router";
import { useMenu } from "../../../contexts/menuContext.jsx";
import { useTheme } from "../../../contexts/themeContext.jsx";

const AddMenuItem = () => {
  const { fetchMenuItems } = useMenu();
  const { theme, bgColor, textColor } = useTheme();
  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "",
    type: "",
    description: "",
    ingredients: "",
    price: 0,
    sizesPrices: [
      { size: "small", price: 0 },
      { size: "medium", price: 0 },
      { size: "large", price: 0 },
    ],
    isVegan: false,
    isLactoseFree: false,
  });

  const handleAddMenuItem = async () => {
    if (
      menuItem.name === "" ||
      menuItem.category === "" ||
      menuItem.description === ""
    ) {
      Alert.alert("Please fill all the necessary fields");
      return;
    }
    let url = `${TAP_TRACK_URL}/users/menu-items`;
    try {
      if (menuItem.category === "beverage") {
        url += "/beverages";
      } else {
        url += "/foods";
      }
      // Send a POST request to the server
      const { data } = await axios.post(url, menuItem);
      // Show success message
      Alert.alert("Success", "Menu item added successfully");
      // Clear the form
      setMenuItem({
        name: "",
        category: "",
        type: "",
        description: "",
        ingredients: "",
        price: 0,
        sizesPrices: [
          { size: "small", price: 0 },
          { size: "medium", price: 0 },
          { size: "large", price: 0 },
        ],
        isVegan: false,
        isLactoseFree: false,
      });
      // Fetch the menu items again to update the list
      fetchMenuItems();
      // Redirect to the menu page
      router.push("editMenu");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView className={`${bgColor} h-full`}>
      <View className="w-full flex items-center justify-center px-8">
        <Text className={`${textColor} text-xl font-bold mb-4`}>Add Menu</Text>
        <MenuForm menuItem={menuItem} setMenuItem={setMenuItem} />
        <CustomButton
          text="Add"
          handlePress={handleAddMenuItem}
          containerStyles="w-[50%] mt-9"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddMenuItem;
