
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
import axios from "axios";
import { router } from "expo-router";

const API = "http://10.125.74.239:8080";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("خطا", "تمام فیلدها را پر کنید.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API + "/api/auth/register", {
        name,
        email,
        phone,
        password,
      });

      Alert.alert("موفق", "ثبت‌نام با موفقیت انجام شد.");

router.replace("/login" as any);
    } catch (e: any) {
      Alert.alert(
        "خطا",
        e?.response?.data?.message || "ثبت‌نام انجام نشد."
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

      <Text style={styles.title}>ایجاد حساب کاربری</Text>

      <TextInput
        style={styles.input}
        placeholder="نام و نام خانوادگی"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="ایمیل"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="شماره موبایل"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
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
        onPress={register}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ثبت‌نام</Text>
        )}
      </TouchableOpacity>

<TouchableOpacity
  onPress={() => router.replace("/login" as any)}
>        <Text style={styles.link}>
          قبلاً ثبت‌نام کرده‌اید؟ ورود
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
    marginBottom: 10,
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#7C3AED",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#7C3AED",
    fontWeight: "600",
  },
});

