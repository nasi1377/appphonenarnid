import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const API = "http://10.211.242.239:8080";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
};

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);
  const increase = async (id: number) => {

  try {

    const token = await AsyncStorage.getItem("token");

    await axios.put(
      API + "/api/cart/" + id + "/increase",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadCart();

  } catch (err) {

    console.log(err);

  }

};

const decrease = async (id: number) => {

  try {

    const token = await AsyncStorage.getItem("token");

    await axios.put(
      API + "/api/cart/" + id + "/decrease",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadCart();

  } catch (err) {

    console.log(err);

  }

};

const removeItem = async (id: number) => {

  Alert.alert(
    "حذف محصول",
    "آیا مطمئن هستید؟",
    [
      {
        text: "خیر",
        style: "cancel",
      },
      {
        text: "بله",
        onPress: async () => {

          const token = await AsyncStorage.getItem("token");

          await axios.delete(
            API + "/api/cart/" + id,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          loadCart();

        },
      },
    ]
  );

};

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(API + "/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("CART =", res.data);

      setCart(res.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.quantity * Number(item.product.price);
  }, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>سبد خرید شما خالی است</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>ادامه خرید</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
   

  <View style={styles.container}>

    <Text style={styles.title}>
      🛒 سبد خرید
    </Text>

    <FlatList
      data={cart}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (

        <View style={styles.card}>

          <Image
            style={styles.image}
            source={{
              uri: item.product.image
                ? API + "/" + item.product.image.replace(/\\/g, "/")
                : "https://via.placeholder.com/300",
            }}
          />

          <View style={{ flex: 1 }}>

            <Text style={styles.name}>
              {item.product.name}
            </Text>

            <Text style={styles.price}>
              {Number(item.product.price).toLocaleString()} تومان
            </Text>


            <View style={styles.counter}>

              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => decrease(item.id)}
              >
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>


              <Text style={{ marginHorizontal: 15 }}>
                {item.quantity}
              </Text>


              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => increase(item.id)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeItem(item.id)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  حذف
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      )}
    />



           

         

        
    

      <View style={styles.footer}>

        <Text style={styles.total}>
          جمع کل :
          {" "}
          {totalPrice.toLocaleString()}
          {" "}
          تومان
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    fontSize: 20,
    marginBottom: 25,
  },

  button: {
    backgroundColor: "#7C3AED",
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    padding: 10,
    elevation: 3,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    color: "green",
    marginTop: 10,
  },

  qty: {
    marginTop: 10,
    color: "#555",
  },
  counter: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 12,
},

counterBtn: {
  width: 35,
  height: 35,
  borderRadius: 18,
  backgroundColor: "#7C3AED",
  justifyContent: "center",
  alignItems: "center",
},

counterText: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "bold",
},

deleteBtn: {
  backgroundColor: "#EF4444",
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 8,
  marginTop: 12,
  alignSelf: "flex-start",
},

  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  

});