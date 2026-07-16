import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    };

    load();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>نام: {user?.name}</Text>
      <Text>موبایل: {user?.mobile}</Text>
      <Text>ایمیل: {user?.email}</Text>

      <TouchableOpacity onPress={logout}>
        <Text style={{ color: "red", marginTop: 30 }}>
          خروج از حساب
        </Text>
      </TouchableOpacity>
    </View>
  );
}