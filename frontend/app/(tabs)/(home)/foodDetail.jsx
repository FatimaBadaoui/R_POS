import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AddRemove from "../../../components/AddRemove.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { useOrder } from "../../../contexts/orderContext";

const FoodDetail = () => {
  const { id, category, tableNumber } = useLocalSearchParams();
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState([0]);
  const [extra, setExtra] = useState("");
  const [price, setPrice] = useState("");
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addItemToOrder } = useOrder();
  const router = useRouter();

  const incrementQuantity = (index) => {
    setQuantity((prevQuantity) => {
      const newQuantity = [...prevQuantity];
      newQuantity[index]++;
      return newQuantity;
    });
  };

  const decrementQuantity = (index) => {
    setQuantity((prevQuantity) => {
      const newQuantity = [...prevQuantity];
      if (newQuantity[index] > 0) {
        newQuantity[index]--;
      }
      return newQuantity;
    });
  };

  useEffect(() => {
    // Fetch item by id
    const fetchItem = async () => {
      setLoading(true);
      const url = `${TAP_TRACK_URL}/users/menu-items/${
        category === "beverage" ? "beverages" : "foods"
      }/${id}`;
      const { data } = await axios.get(url);
      setItem(data.data);
      setLoading(false);
    };
    fetchItem();
  }, [id, category]);

  useEffect(() => {
    if (item.sizesPrices) {
      setQuantity(Array(item.sizesPrices.length).fill(0));
    }
  }, [item]);

  const addExtra = async () => {
    try {
      if (!extra || !price) {
        Alert.alert("Please fill in all fields");
        return;
      }
      // add extra only if the quantity is greater than 0
      if (quantity[0] === 0 && category !== "beverage") {
        Alert.alert("Please add item to order first");
        return;
      } else if (item.sizesPrices && quantity.every((q) => q === 0)) {
        Alert.alert("Please add item to order first");
        return;
      }
      const url = `${TAP_TRACK_URL}/users/menu-items/extras`;
      const itemType = category === "beverage" ? "beverage" : "food";
      await axios.post(url, {
        extra,
        price,
        itemId: id,
        itemType,
        tableNumber,
      });
      setExtras([...extras, { extra, price }]);
      // Clear input fields
      setExtra("");
      setPrice("");
    } catch (error) {
      console.error(error);
    }
  };

  const addToOrder = () => {
    if (category === "beverage" && item.sizesPrices) {
      item.sizesPrices.forEach((sp, index) => {
        if (quantity[index] > 0) {
          addItemToOrder({
            ...item,
            name: `${item.name} (${sp.size})`,
            price: sp.price,
            quantity: quantity[index],
          });
        }
      });
    } else {
      if (quantity[0] > 0) {
        addItemToOrder({
          ...item,
          quantity: quantity[0],
        });
      }
    }
    router.push({
      pathname: "/(tabs)/(home)/order",
      params: { tableNumber },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter items-center px-4 pb-4">
      <ScrollView className="w-full bg-gray-200 rounded-lg p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          <>
            <View className="flex-row w-full justify-between items-center">
              <View className="w-[60%]">
                <Text className="text-2xl font-bold">{item.name}</Text>
              </View>
              {category !== "beverage" ? (
                <AddRemove
                  quantity={quantity[0]}
                  handleDecrement={() => decrementQuantity(0)}
                  handleIncrement={() => incrementQuantity(0)}
                />
              ) : null}
            </View>
            <View
              className={`${
                category === "beverage" ? "" : "flex-row"
              } w-full gap-x-6`}
            >
              <Text className="mt-3 text-base font-bold text-primary-dark">
                Price:
              </Text>
              {category === "beverage" ? (
                <View className="pl-4">
                  {item.sizesPrices &&
                    item.sizesPrices.map((sp, spIndex) => (
                      <View
                        key={spIndex}
                        className="flex flex-row justify-between items-center mt-2"
                      >
                        <Text className="w-[20%]">{sp.size}</Text>
                        <Text className="w-[20%]">{sp.price}€</Text>
                        <AddRemove
                          quantity={quantity[spIndex]}
                          handleDecrement={() => decrementQuantity(spIndex)}
                          handleIncrement={() => incrementQuantity(spIndex)}
                        />
                      </View>
                    ))}
                </View>
              ) : (
                <Text className="text-primary-dark text-lg">{item.price}€</Text>
              )}
            </View>
            <View className="mt-5">
              <Text className="text-base font-bold text-primary-dark">
                Description:
              </Text>
              <Text className="pl-4 text-primary-dark">
                {item.description || "No description"}
              </Text>
              <Text className="mt-3 text-base font-bold text-primary-dark">
                Ingredients:
              </Text>
              <Text className="pl-4 text-primary-dark">
                Tomato, Basil, Olive Oil, Garlic, Bread
              </Text>

              <View className="flex flex-row gap-4 mt-2">
                <Text className="font-bold text-primary-dark">is vegan?</Text>
                <Text>Yes</Text>
              </View>
              <View className="flex flex-row gap-4">
                <Text className="font-bold text-primary-dark">
                  is lactose free?
                </Text>
                <Text>No</Text>
              </View>

              <Text className="text-base font-bold mt-4 text-primary-dark">
                Extra:
              </Text>
              <View className="flex gap-1">
                {extras.map((extra, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between"
                  >
                    <Text>
                      {index + 1}. {extra.extra}
                    </Text>
                    <Text>{extra.price}€</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row mt-4">
                <TextInput
                  placeholder="extra"
                  value={extra}
                  onChangeText={setExtra}
                  className="bg-myWhite border border-gray-400 flex-1 p-2 rounded"
                />
                <TextInput
                  placeholder="price"
                  value={price}
                  onChangeText={setPrice}
                  className="bg-myWhite border border-gray-400 flex-1 p-2 rounded mx-2"
                />
                <CustomButton
                  text="Add"
                  containerStyles="bg-primary-dark text-white px-4 rounded"
                  handlePress={addExtra}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <CustomButton
        text="Add to Order"
        handlePress={addToOrder}
        containerStyles="w-full mt-4"
      />
    </SafeAreaView>
  );
};

export default FoodDetail;
