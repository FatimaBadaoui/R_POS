import { useContext, useEffect, useState } from "react";
import { Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import { router } from "expo-router";

const Receipts = () => {
  const { user } = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  console.log("user", user);

  useEffect(() => {
    const getReceipts = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/checkout/user/${user.id}`;
        const { data } = await axios.get(url);
        setReceipts(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getReceipts();
  }, []);

  return (
    <SafeAreaView className="flex justify-center items-center">
      <Text className="text-2xl font-bold text-primary-dark">Receipts</Text>
      <ScrollView className="mt-4 w-[85%] h-[85%]">
        {receipts.map((receipt, index) => {
          const isPaidStyle = receipt.isPaid ? "bg-primary" : "bg-secondary";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push({
                  pathname: "/receiptDetail",
                  params: { receiptId: receipt._id },
                });
              }}
              className={`flex-1 flex-row justify-between items-center p-4 ${isPaidStyle} mb-4 rounded-lg`}
            >
              <Text className="text-myWhite">Table: {receipt.tableNumber}</Text>
              <Text className="text-myWhite">
                {receipt.transactionDate.slice(0, 10)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Receipts;
