import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";

const API = "http://10.211.242.239:8080";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
  if (!mobile || !password) {
    Alert.alert("خطا", "شماره موبایل و رمز عبور را وارد کنید.");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(API + "/api/auth/login", {
      mobile: mobile.trim(),
      password: password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    // ذخیره توکن
    await AsyncStorage.setItem("token", res.data.token);

    // ذخیره اطلاعات کاربر
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // تست
    const savedToken = await AsyncStorage.getItem("token");
    console.log("TOKEN AFTER SAVE =", savedToken);

    Alert.alert("موفق", "ورود با موفقیت انجام شد.");

    router.replace("/");

  } catch (e: any) {
    console.log("LOGIN ERROR:", e.response?.data);

    Alert.alert(
      "خطا",
      e.response?.data?.message ||
      JSON.stringify(e.response?.data) ||
      e.message
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <Text style={styles.logo}>Banogol</Text>

      <Text style={styles.title}>ورود به حساب کاربری</Text>

      <TextInput
        style={styles.input}
        placeholder="شماره موبایل"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="رمز عبور"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ورود</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register" as any)}
      >
        <Text style={styles.link}>
          حساب کاربری ندارید؟ ثبت‌نام
        </Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#7C3AED",
    textAlign: "center",
    marginBottom: 15,
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 30,
    color: "#333",
  },

  input: {
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: "#7C3AED",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#7C3AED",
    fontWeight: "600",
  },
});