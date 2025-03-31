import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import ItemListScreen from './ItemListScreen';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={isLoggedIn?styles.containerLogged:styles.container}>
      {isLoggedIn ? (
        <>
          <ItemListScreen/>
        </>
      ) : (
        <>
          <Text style={styles.title}>Bem-vindo ao TradeApp!</Text>
          <TouchableOpacity

            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Cadastrar/Entrar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerLogged: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
