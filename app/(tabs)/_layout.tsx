import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setProducts,
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from "../store";
import { Provider } from "react-redux";
import store from "../store";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setProducts(data));
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const starCount = Math.ceil(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < starCount ? "★" : "☆"}
        </Text>
      );
    }

    return stars;
  };

  const renderItem = ({ item }) => {
    const maxLength = 45;
    const title =
      item.title.length > maxLength
        ? item.title.substring(0, maxLength) + "..."
        : item.title;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedProduct(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.imageCard}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{title}</Text>
          <Text style={styles.ratingContainer}>
            {renderStars(item.rating.rate)}
            <Text style={styles.ratingCount}>{item.rating.count}</Text>
          </Text>
          <Text style={styles.productPrice}>Rs. {item.price}</Text>
          <Text style={styles.productCategory}>Category: {item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headText}>Shopping</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Image
                source={{ uri: selectedProduct.image }}
                style={styles.modalImage}
              />
              <Text style={styles.modalDescription}>
                {selectedProduct.description}
              </Text>

              <View style={styles.modalQuantity}>
                <Button
                  title="+"
                  onPress={() =>
                    dispatch(incrementQuantity(selectedProduct.id))
                  }
                />
                <Text style={styles.quantityText}>
                  {selectedProduct.quantity || 0}
                </Text>
                <Button
                  title="-"
                  onPress={() =>
                    dispatch(decrementQuantity(selectedProduct.id))
                  }
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.addToCartButton]}
                  onPress={() => {
                    dispatch(addToCart(selectedProduct.id));
                    setModalVisible(false);
                  }}
                >
                  <Image
                    source={require("./img/cart.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={styles.cartButtonText}>Add To Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#80D9E1",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headText: {
    fontWeight: "900",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#525659",
    padding: 10,
    marginVertical: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 175,
  },
  imageCard: {},
  productImage: {
    width: 120,
    height: 150,
    borderRadius: 5,
  },
  productDetails: {
    marginLeft: 35,
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  productCategory: {
    fontSize: 12,
    color: "#777",
  },
  ratingContainer: {
    color: "#F8A50B",
    fontSize: 22,
  },
  ratingCount: {
    fontSize: 15,
    color: "#777",
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 180,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "50%",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#FD0002",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  closeButton: {
    backgroundColor: "#D1D1D1",
  },
  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  closeButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalPrice: {
    fontSize: 16,
    color: "#FF6347",
    marginBottom: 20,
    textAlign: "center",
  },
  modalQuantity: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
