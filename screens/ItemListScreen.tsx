import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ItemListComponent } from "@/components/ItemListComponent";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import notificationIcon from "../assets/images/notification.png";
import saveIcon from "../assets/images/save.png";
import lupaIcon from "../assets/images/lupa.png";
import gridIcon from "../assets/images/grid.png";
import listIcon from "../assets/images/list2.png";
import scrollIcon from "../assets/images/scroll.png";
import closeIcon from "../assets/images/close.png"

export default function ItemListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayItems, setDisplayItems] = useState(0);

  const categories = [
    { label: "Todas as Categorias", value: "" },
    { label: "Casa e Decoração", value: "Casa e Decoração" },
    { label: "Móveis", value: "Móveis" },
    { label: "Eletro", value: "Eletro" },
    { label: "Materiais de Construção", value: "Materiais de Construção" },
    { label: "Informática", value: "Informática" },
    { label: "Games", value: "Games" },
    { label: "Tvs e Video", value: "Tvs e Video" },
    { label: "Áudio", value: "Áudio" },
    { label: "Câmeras e Drones", value: "Câmeras e Drones" },
    { label: "Moda e Beleza", value: "Moda e Beleza" },
    { label: "Escritório e Home Office", value: "Escritório e Home Office" },
    { label: "Música e Hobbies", value: "Música e Hobbies" },
    { label: "Esportes e Fitness", value: "Esportes e Fitness" },
    { label: "Artigos Infantis", value: "Artigos Infantis" },
    { label: "Animais de Estimação", value: "Animais de Estimação" },
    { label: "Agro e Indústria", value: "Agro e Indústria" },
    { label: "Serviços", value: "Serviços" },
    { label: "Vagas de Emprego", value: "Vagas de Emprego" },
  ];

  const handleSelectCategory = (itemValue) => {
    setSelectedCategory(itemValue);
    setModalVisible(false);
  };
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchUserLocation();
  }, [navigation]);

  const fetchUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permissão de localização negada.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (querySnapshot) => {
        const otherUsersItems = querySnapshot.docs.flatMap((doc) => {
          const data = doc.data();
          return (
            data.items?.filter(
              (item: any) => item.userEmail !== currentUser.email
            ) || []
          );
        });

        setItems(otherUsersItems);
        setFilteredItems(otherUsersItems);
        setLoading(false);
      },
      (error) => {
        setError("Erro ao carregar itens.");
        console.error("Erro ao buscar itens: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const nameMatch = searchName
        ? item.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const categoryMatch = selectedCategory
        ? item.category === selectedCategory
        : true;
      return nameMatch && categoryMatch;
    });
    setFilteredItems(filtered);
  }, [searchName, selectedCategory, items]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando itens...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}></Text>
      </View>
      <View
        style={[
          {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          },
          styles.divider,
        ]}
      >
        <View style={styles.inputField}>
          <TextInput
            style={[styles.input, styles.verticalDivider]}
            placeholder="Buscar"
            value={searchName}
            onChangeText={setSearchName}
          />
          <Image source={lupaIcon} style={{ width: 20, height: 20 }} />
        </View>
        <Image source={notificationIcon} style={{ width: 19, height: 19 }} />
        <Image source={saveIcon} style={{ width: 18, height: 18 }} />
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            paddingHorizontal: 25,
            width: "65%",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ fontSize: 14, fontWeight: 400 }}>Categoria</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginRight: 20 }}>
          <TouchableOpacity
            onPress={() => setDisplayItems(0)}
            style={[
              styles.displayItens,
              {
                backgroundColor: displayItems == 0 ? "#e3f2fd" : "transparent",
              },
            ]}
          >
            <Image source={listIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDisplayItems(1)}
            style={[
              styles.displayItens,
              {
                backgroundColor: displayItems == 1 ? "#e3f2fd" : "transparent",
              },
            ]}
          >
            <Image source={gridIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.value && styles.selectedCategory,
                    {
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                    },
                  ]}
                  onPress={() => handleSelectCategory(item.value)}
                >
                  <Text>{item.label}</Text>
                  {index === 0 ? (
                    <Image
                      source={closeIcon}
                      style={{ width: 15, height: 15, marginRight: 2 }}
                    />
                  ) : (
                    <Image
                      source={scrollIcon}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemListComponent
            name={item.name}
            imageUrl={item.imageUrl}
            visibility={item.visibility}
            category={item.category}
            userEmail={item.userEmail}
            itemId={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            displayPosition={displayItems}
          />
        )}
        contentContainerStyle={
          displayItems == 0 ? styles.listContent : styles.listContentGrid
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "85%",
  },
  listContent: {
    width: "100%",
    maxWidth: "100%",
    paddingBottom: 50,
    paddingHorizontal: 10,
  },
  listContentGrid: {
    flexDirection: "row",
    maxWidth: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8d7da",
  },
  errorText: {
    fontSize: 18,
    color: "#721c24",
  },
  textInput: {
    paddingLeft: 10,
  },
  header: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    width: "100%",
    backgroundColor: "#b9e22e",
    elevation: 1,
  },
  inputField: {
    marginVertical: 10,
    borderWidth: 1,
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verticalDivider: {
    borderRightWidth: 1,
    borderRightColor: "#6666",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#6666",
  },
  button: {
    height: 40,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedCategory: {
    backgroundColor: "#e3f2fd",
    borderRadius:8,
  },
  displayItens: {
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    borderRadius: 5,
  },
});
