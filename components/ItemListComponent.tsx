import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

interface ItemsProps {
  name: string;
  imageUrl: string;
  visibility: boolean;
  category: string;
  userEmail: string;
  itemId: string;
  latitude?: number;
  longitude?: number;
  displayPosition: number;
}

export const ItemListComponent: React.FC<ItemsProps> = ({
  name,
  imageUrl,
  visibility,
  category,
  userEmail,
  itemId,
  latitude,
  longitude,
  displayPosition,
}) => {
  const navigation = useNavigation();

  if (!visibility) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ItemDetails", {
          name: name,
          category: category,
          imageUrl: imageUrl,
          userEmail: userEmail,
          itemId: itemId,
          latitude: latitude,
          longitude: longitude,
        })
      }
      style={displayPosition == 0 ? styles.dividerPage : {}}
    >
      <View
        style={
          displayPosition == 0
            ? styles.itemContainerList
            : styles.itemContainerGrid
        }
      >
        {imageUrl === "" || imageUrl === undefined ? (
          <Image
            source={require("../assets/images/no-image-icon.png")}
            style={
              displayPosition == 0 ? styles.image : styles.imageContainerGrid
            }
          />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={
              displayPosition == 0 ? styles.image : styles.imageContainerGrid
            }
          />
        )}
        <View
          style={
            displayPosition == 0
              ? styles.textContainer
              : styles.textContainerGrid
          }
        >
          <Text
            style={displayPosition == 0 ? styles.name : styles.nameGrid}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Text style={styles.category}>{category}</Text>
          <Text
            style={displayPosition == 0 ? styles.category : styles.categoryGrid}
          >
            0km - 2025
          </Text>
          <Text style={styles.info}>25 março 15:51 | Fortaleza</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainerList: {
    height: 180,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemContainerGrid: {
    height: 400,
    width: 190,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 0,
  },
  imageContainerGrid: {
    width: "100%",
    height: 250,
    marginRight: 15,
  },
  image: {
    width: "45%",
    height: "90%",
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    height: "95%",
    flex: 1,
    justifyContent: "flex-start",
  },
  textContainerGrid: {
    padding: 5,
    height: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  nameGrid: {
    fontSize: 17,
    color: "#333",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  categoryGrid: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  info: {
    fontSize: 11,
    color: "#666",
    marginTop: 10,
  },
  dividerPage: {
    borderBottomWidth: 1,
    borderBottomColor: "#6666",
    marginVertical: 2,
  },
});
