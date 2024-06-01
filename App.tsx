import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { SvgXml } from "react-native-svg";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import * as ImagePicker from "expo-image-picker";

export type RBSheetRef = {
  open: () => void;
  close: () => void;
  // Add other methods or properties if needed
};
interface Product {
  name: string;
  price: string;
  imageUri: string;
}

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    price: "",
    imageUri: "",
  });
  const refRBSheet = useRef<RBSheetRef>(null);
  const ADD = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" width="50" height="50" rx="25" transform="rotate(90 50 0)" fill="#0DDE65"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15 25.625C15 26.6605 15.8395 27.5 16.875 27.5L34.375 27.5C35.4105 27.5 36.25 26.6605 36.25 25.625C36.25 24.5895 35.4105 23.75 34.375 23.75L16.875 23.75C15.8395 23.75 15 24.5895 15 25.625Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M25.625 15C24.5895 15 23.75 15.8395 23.75 16.875L23.75 34.375C23.75 35.4105 24.5895 36.25 25.625 36.25C26.6605 36.25 27.5 35.4105 27.5 34.375L27.5 16.875C27.5 15.8395 26.6605 15 25.625 15Z" fill="white"/>
  </svg>
  `;
  const OOPS = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path stroke="#2289ce" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13.253 5.98 12 13.5l-1.253-7.52a1.27 1.27 0 1 1 2.506 0Z"></path> <circle cx="12" cy="19" r="1" stroke="#2289ce" stroke-width="2"></circle> </g></svg>`;
  const THUMBS = `<svg fill="#2289ce" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#2289ce"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 43.9374 51.7656 C 45.7655 51.3438 47.6171 50.1484 47.6171 47.8984 C 47.6171 46.9844 47.3593 46.3516 47.0546 45.8125 C 46.8671 45.5078 46.8905 45.2734 47.1718 45.1563 C 48.6481 44.5000 49.8673 43.1875 49.8673 41.2891 C 49.8673 40.2344 49.5860 39.2735 49.0470 38.5937 C 48.7887 38.2422 48.8358 37.9610 49.2577 37.7032 C 50.3593 37.0937 51.0625 35.7344 51.0625 34.1875 C 51.0625 33.1094 50.7107 31.9141 50.0545 31.3281 C 49.7031 31.0000 49.7732 30.7656 50.1716 30.4375 C 50.9454 29.8516 51.3673 28.7266 51.3673 27.3906 C 51.3673 25.0937 49.5860 23.2422 47.2421 23.2422 L 38.8749 23.2422 C 36.7655 23.2422 35.3358 22.1406 35.3358 20.4063 C 35.3358 17.1719 39.3436 11.3594 39.3436 7.1641 C 39.3436 4.9844 37.9140 3.6719 36.0624 3.6719 C 34.3749 3.6719 33.5077 4.8437 32.5936 6.6250 C 29.1014 13.5156 24.3671 19.0703 20.7811 23.8281 C 17.7343 27.9063 16.2343 31.3281 16.1640 36.9532 C 16.0467 45.6016 23.0546 52.1875 34.0702 52.2813 L 37.3280 52.3047 C 40.3983 52.3281 42.6483 52.0937 43.9374 51.7656 Z M 4.6327 37.1172 C 4.6327 44.1484 8.9921 50.0313 14.8749 50.0313 L 19.0702 50.0313 C 14.8280 46.9375 12.8827 42.2500 12.9764 36.8828 C 13.0467 30.9297 15.3671 26.6875 17.4296 24.1094 L 13.9843 24.1094 C 8.7108 24.1094 4.6327 29.8281 4.6327 37.1172 Z"></path></g></svg>`;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera roll permissions to pick an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCurrentProduct({ ...currentProduct, imageUri: result.assets[0].uri });
    }
  };

  const addProduct = () => {
    if (products.length >= 5) {
      Alert.alert(
        "Maximum limit reached",
        "You can only add up to 5 products."
      );
      return;
    }

    if (
      !currentProduct.name ||
      !currentProduct.price ||
      !currentProduct.imageUri
    ) {
      Alert.alert(
        "Incomplete Product",
        "Please fill all fields and add an image."
      );
      return;
    }

    setProducts([...products, currentProduct]);
    setCurrentProduct({ name: "", price: "", imageUri: "" });
    refRBSheet.current?.close();
  };

  //console.log("Image-----", currentProduct.imageUri);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat().format(parseFloat(price));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View
      className={`flex-row justify-between items-center bg-[#2289ce] shadow-md rounded-[10px] px-[10px] py-[10px] mt-[20px]`}
    >
      <View className={`flex-row justify-center items-center space-x-3`}>
        <Image
          source={{ uri: item.imageUri }}
          className={`w-[80px] h-[80px] rounded-[10px]`}
        />
        <Text className={`text-[#fff] font-semibold text-[20px]`}>
          {item.name}
        </Text>
      </View>
      <Text className={`text-[#fff] font-semibold text-[16px]`}>
        ₦{formatPrice(item.price)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1`}>
      <View className={`px-[20px]`}>
        <StatusBar style="auto" />
        <Text>Products</Text>

        {/* For Product Added */}
        <View></View>

        {products.length > 0 && (
          <View className={`w-full`}>
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item, index) => index.toString()}
              className={`mt-1`}
            />
          </View>
        )}

        {products.length < 5 && (
          <View className={`flex items-center`}>
            {products.length < 1 ? (
              <View>
                <SvgXml xml={OOPS} width={150} height={150} />
                <Text className={`text-[14px] font-bold mb-[10px]`}>
                  No Product Available
                </Text>
              </View>
            ) : (
              <View>
                <SvgXml xml={THUMBS} width={150} height={150} />
              <Text className={`text-[14px] font-bold mb-[10px]`}>
                You can add More Products
              </Text>
              </View>
            )}
            <TouchableOpacity
              className={`flex items-center justify-center bg-[#2289ce] px-[20px] py-[20px]`}
              onPress={() => refRBSheet.current?.open()}
            >
              <Text
                className={`text-[#fff] font-bold text-[20px] rounded-[20px]`}
              >
                Add Products
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal for Upload */}
        <RBSheet
          ref={refRBSheet}
          draggable
          customStyles={{
            wrapper: {},
            container: {
              borderTopLeftRadius: 20,
              height: "65%",
              backgroundColor: "#fff",
              borderTopRightRadius: 20,
              paddingBottom: 5,
              paddingHorizontal: 10,
            },
            draggableIcon: {
              backgroundColor: "#CCD6EB",
            },
          }}
          customModalProps={{
            animationType: "slide",
            statusBarTranslucent: true,
          }}
          customAvoidingViewProps={{
            enabled: false,
          }}
        >
          <View className={`mt-4 px-[10px]`}>
            <Text
              className={`font-sequel-sans-semi-bold-head mt-4 text-center text-[20px] text-[#000A1F]`}
            >
              Enter new products
            </Text>
            <View className={`mt-[10px]`}>
              <Text>Enter Product Name</Text>
              <TextInput
                placeholder="Product Name"
                className={`px-[20px] py-[10px] border-[1.5px] border-[#2a2a2a] rounded-[10px]`}
                value={currentProduct.name}
                onChangeText={(text) =>
                  setCurrentProduct({ ...currentProduct, name: text })
                }
              />
            </View>
            <View className={`mt-[10px]`}>
              <Text>Enter Product Name</Text>
              <View className={`flex-row items-center`}>
                <TextInput
                  placeholder="Product Image"
                  className={`px-[20px] py-[10px] border-[1.5px] border-[#2a2a2a] rounded-[10px] w-3/4`}
                  value={currentProduct.imageUri ? "Image Selected" : ""}
                  editable={false}
                />
                <TouchableOpacity className={`w-1/4`} onPress={pickImage}>
                  <SvgXml xml={ADD} />
                </TouchableOpacity>
              </View>
            </View>
            <View className={`mt-[10px]`}>
              <Text>Enter Product Price</Text>
              <TextInput
                placeholder="Product Price"
                className={`px-[20px] py-[10px] border-[1.5px] border-[#2a2a2a] rounded-[10px]`}
                value={currentProduct.price}
                onChangeText={(text) =>
                  setCurrentProduct({ ...currentProduct, price: text })
                }
                keyboardType="numeric"
              />
            </View>
            <View className={`mt-[10px]`}>
              <TouchableOpacity
                onPress={addProduct}
                className={`flex items-center justify-center bg-[#2289ce] px-[20px] py-[20px]`}
              >
                <Text className={`text-[#fff]`}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
