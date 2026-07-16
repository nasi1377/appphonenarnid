import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
const API = "http://10.211.242.239:8080";

type Product = {
  id: number;
  name: string | null;
  price: number;
  image?: string;
};



export default function HomeScreen() {

  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);

  // خواندن اطلاعات کاربر
  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");

      if (data) {
        setUser(JSON.parse(data));
      }
    };

    loadUser();
  }, []);

  // دریافت محصولات
  useEffect(() => {

axios
.get(API + "/api/products")
.then((res) => {

console.log("PRODUCT JSON = ", JSON.stringify(res.data, null, 2));

setProducts(res.data);

})
.catch((err) => {

console.log(
"PRODUCT ERROR = ",
err.response?.data || err.message
);

});

}, []);
const addToCart = async (product: Product) => {
  try {

    const token = await AsyncStorage.getItem("token");

    Alert.alert(
      "TOKEN",
      token ?? "توکن وجود ندارد"
    );

    const res = await axios.post(
      API + "/api/cart",
      {
        quantity: 1,
        product: {
          id: product.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert(
      "موفق",
      "Status: " + res.status
    );

  } catch (err:any) {

    Alert.alert(
      "خطای سبد خرید",
      "Status: " +
      (err.response?.status ?? "ندارد") +
      "\n\nData:\n" +
      JSON.stringify(err.response?.data) +
      "\n\nMessage:\n" +
      err.message
    );

  }
};


  return (


  <View style={styles.container}>

    <View style={styles.header}>

      <Text style={styles.title}>Banogol</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>

        <TouchableOpacity
          onPress={() => router.push("/profile" as any)}
          style={{ marginRight: 15 }}
        >
          <Text
            style={{
              color: "#7C3AED",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            👤 {user ? user.name : "ورود"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cart" as any)}>
          <Text style={{ fontSize: 28 }}>🛒</Text>
        </TouchableOpacity>

      </View>

    </View>

    <Text style={{ marginBottom: 15 }}>
      تعداد محصولات: {products.length}
    </Text>

    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>

          <Image
            source={{
              uri: item.image
                ? API + "/" + item.image.replace(/\\/g, "/")
                : "https://via.placeholder.com/300",
            }}
            style={styles.image}
          />

          <Text style={styles.name}>
            {item.name ?? "بدون نام"}
          </Text>

          <Text style={styles.price}>
            {Number(item.price).toLocaleString()} تومان
          </Text>

        <TouchableOpacity
  style={styles.cartButton}
  onPress={() => {
    Alert.alert("تست", "دکمه کار می‌کند");
    addToCart(item);
  }}
>
  <Text style={styles.cartButtonText}>
    🛒 افزودن به سبد خرید
  </Text>
</TouchableOpacity>

        </View>
      )}
    />

  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },

  name: {
    fontSize: 18,
    marginTop: 10,
  },

  price: {
    color: "green",
    marginTop: 5,
  },
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},
cartButton: {
  backgroundColor: "#7C3AED",
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  alignItems: "center",
},

cartButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 15,
},
});