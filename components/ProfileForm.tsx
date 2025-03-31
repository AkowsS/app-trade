import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import editIcon from "../assets/images/editIcon.png";
import UserPhoto from "../assets/images/userPhoto.png";
import checkIcon from "../assets/images/check.png";
import balloonIcon from "../assets/images/balloon.png";
import galleryIcon from "../assets/images/gallery.png";
import itemsIcon from "../assets/images/items.png";
import calendarIcon from "../assets/images/calendar.png";
import storeIcon from "../assets/images/store.png";
import configIcon from "../assets/images/config.png";
import editProfile from "../assets/images/editProfile.png";
import infoIcon from "../assets/images/i.png";
import exitIcon from "../assets/images/exit.png"
import deletIcon from "../assets/images/delete.png";

interface ProfileFormProps {
  name: string;
  email: string;
  photoUrl: string;
  onNameChange: (name: string) => void;
  onPickImage: () => void;
  onSaveProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onButtonLocation: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  name,
  email,
  photoUrl,
  onNameChange,
  onPickImage,
  onSaveProfile,
  onLogout,
  onDeleteAccount,
}) => {
  const [editable, setEditable] = useState(false);
  const [optionsBar, setOptionsBar] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout>();
  const shakeStyle = {
    transform: [{ translateX: shakeAnim }],
  };

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleOptions = () => {
    const toValue = optionsBar ? 0 : 1;
    
    Animated.timing(optionsAnim, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false
    }).start(() => {
      setOptionsBar(!optionsBar);
    });
  };

  useEffect(() => {
    if (editable) {
      startShakeAnimation();
      timerRef.current = setInterval(() => {
        startShakeAnimation();
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [editable]);

  const saveProfileFunc = () => {
    onSaveProfile();
    setEditable(false);
  };

  const optionsStyle = {
    ...styles.optionsDiv,
    width: optionsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '60%']
    }),
    opacity: optionsAnim,
    padding: optionsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20]
    })
  };

  return (
    <View style={styles.container}>
      <Animated.View style={optionsStyle}>
        <Text style={styles.optionsTitle}>Opções</Text>
        <TouchableOpacity
          onPress={onLogout}
          style={styles.optionButton}
        >
          <Text style={styles.optionText}>Sair</Text>
          <Image source={exitIcon} style={{width:18, height:18}}/>
        </TouchableOpacity>
        <View style={[styles.divider, {marginVertical: 1, marginBottom: 25}]}/>
        <TouchableOpacity
          onPress={onDeleteAccount}
          style={styles.optionButton}
        >
          <Text style={styles.optionText}>Deletar Conta</Text>
          <Image source={deletIcon} style={{width:18, height:18, marginRight:2}}/>
        </TouchableOpacity>
        <View style={[styles.divider, {marginVertical: 1}]}/>
      </Animated.View>

      <View style={styles.header}>
        <Text style={styles.title}>Seu Perfil</Text>
        <TouchableOpacity
          onPress={toggleOptions}
          style={{
            position: "absolute",
            right: 5,
            top: 45,
            width: 60,
            height: 60,
            alignItems: "flex-end",
          }}
        >
          <Image source={configIcon} style={styles.icons} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{ flex: 1, marginTop: 85, margin: 0, padding: 0, width: "100%" }}
      >
        <View style={styles.profileArea}>
          <View style={styles.profile}>
            <TouchableOpacity
              onPress={() => setEditable(!editable)}
              style={{
                position: "absolute",
                right: 0,
                top: 10,
                width: 60,
                height: 60,
                alignItems: "flex-end",
              }}
            >
              <Image source={editIcon} style={styles.icons} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Animated.View style={shakeStyle}>
                <TouchableOpacity
                  onPress={() =>
                    editable ? onPickImage() : setEditable(editable)
                  }
                >
                  {photoUrl ? (
                    <Image
                      source={{ uri: photoUrl }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <Image source={UserPhoto} style={styles.profileImage} />
                    </View>
                  )}
                  <Image
                    source={editProfile}
                    style={{
                      width: 30,
                      height: 30,
                      position: "absolute",
                      borderRadius: 50,
                      borderWidth: 0,
                      bottom: 0,
                      right: 0,
                      display: editable ? "" : "none",
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
              <View style={{ height: 65, marginLeft: 20 }}>
                {editable ? (
                  <Animated.View style={shakeStyle}>
                    <TextInput
                      placeholder="Nome"
                      value={name}
                      onChangeText={onNameChange}
                      style={styles.textField}
                    />
                  </Animated.View>
                ) : (
                  <Text style={{ marginLeft: 5 }}>
                    {name ? name : "user080572"}
                  </Text>
                )}
                <Text style={{ marginLeft: 5, color: "gray" }}>{email}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.statusCircle} />
                  <Text style={{fontSize:11}}>online</Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.elementContacts}>
                <Image source={calendarIcon} style={styles.smallIcons}></Image>
                <Text style={{ marginLeft: 5, fontSize: 13, fontWeight: 400 }}>
                  No Trade-App desde Fevereiro de 2025
                </Text>
              </View>
              <View style={styles.elementContacts}>
                <Image source={balloonIcon} style={styles.smallIcons}></Image>
                <Text
                  style={{
                    marginLeft: 5,
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#000",
                  }}
                >
                  Adicionar endereço
                </Text>
              </View>
            </View>
            <View style={styles.dividerPage} />
            <View>
              <View style={styles.elementContacts}>
                <Image source={checkIcon} style={styles.icons}></Image>
                <Text>Email</Text>
              </View>
              <View style={styles.elementContacts}>
                <Image source={checkIcon} style={styles.icons}></Image>
                <Text>Telefone</Text>
              </View>
              <View style={styles.elementContacts}>
                <Image source={checkIcon} style={styles.icons}></Image>
                <Text>Facebook</Text>
              </View>
            </View>
            <View style={styles.dividerPage} />
            {editable ? (
              <View>
                <TouchableOpacity
                  style={[styles.storeButton, { backgroundColor: "#a1da87" }]}
                  onPress={saveProfileFunc}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      lineHeight: 25,
                      fontWeight: 600,
                    }}
                  >
                    Salvar Perfil
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity style={styles.storeButton}>
                  <Image source={storeIcon} style={{ width: 27, height: 25 }} />
                  <Text style={{ color: "white", fontSize: 14 }}>
                    {" "}
                    Quero cadastrar minha loja
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{flexDirection:"row", alignItems:"baseline", height:70}}>
            <Text style={{ fontWeight: 400, fontSize: 20, marginVertical: 18 }}>
              Histórico
            </Text>
            <Image source={infoIcon} style={{width:16, height:16, marginLeft: 10}}/>
          </View>
          <View style={styles.historicDiv}>
            <View>
              <Image
                source={galleryIcon}
                style={{ width: 27, height: 25, marginBottom: 3 }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "baseline",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontWeight: 500, fontSize: 18 }}>0</Text>
                <Text style={{ fontWeight: 600, fontSize: 11 }}> anúncios</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <Text style={{ fontWeight: 400, fontSize: 11 }}>
                  Publicados nos últimos{" "}
                  <Text style={{ fontWeight: 600, fontSize: 12 }}>
                    180 dias
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: 20,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Anúncios do vendedor
          </Text>
          <Text style={{ fontWeight: 400, fontSize: 13.5, marginBottom: 15 }}>
            0 de 0 anúncios publicados
          </Text>
          <View style={styles.adDiv}>
            <Image source={itemsIcon} style={styles.sellItemIcon} />
            <Text style={{ marginVertical: 15, fontSize: 13.5 }}>
              Não possui anúncios publicados
            </Text>
            <TouchableOpacity style={styles.adButton}>
              <Text>Anunciar e vender</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    width: "100%",
    backgroundColor: "#b9e22e",
    paddingTop: 35,
    paddingBottom: 18,
    elevation: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  optionsDiv: {
    position: "absolute",
    backgroundColor: "#fff",
    height: "100%",
    zIndex: 980,
    right: 0,
    overflow: "hidden",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20
  },
  optionsTitle: {
    marginTop: 80,
    fontSize: 20,
    fontWeight: "500",
    width: "100%",
    textAlign: "center",
    marginBottom: 30
  },
  optionButton: {
    padding: 0,
    marginLeft: 5,
    marginBottom: 5,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500"
  },
  profileArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  profile: {
    marginTop: 15,
    paddingTop: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "#6666",
    borderRadius: 8,
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  storeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ff6600",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#6666",
  },
  dividerPage:{
    borderBottomWidth: 1,
    borderBottomColor: "#6666",
    marginVertical: 20,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginHorizontal: 6,
  },
  icons: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginLeft: 2,
  },
  elementContacts: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  smallIcons: {
    width: 15,
    height: 15,
    marginLeft: 5,
    marginRight: 6,
  },
  historicDiv: {
    width: "35%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#6666",
    borderRadius: 8,
  },
  sellItemIcon: {
    borderRadius: 50,
    width: 55,
    height: 55,
    backgroundColor: "#d9d9d9",
  },
  adButton: {
    flex: 1,
    width: "50%",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#000",
    borderWidth: 1,
  },
  adDiv: {
    flex: 1,
    marginTop: 15,
    paddingBottom: 20,
    paddingTop: 40,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6666",
    borderRadius: 8,
    marginBottom: 15,
  },
  textField: {
    marginLeft: 5,
    borderWidth: 1,
    height: 25,
    padding: 0,
    paddingLeft: 5,
    borderRadius: 5,
    borderColor: "#ff6600",
  },
});