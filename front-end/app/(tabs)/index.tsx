import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    const serverUrl = Constants.expoConfig?.extra?.SERVER_URL;
    if (!serverUrl) {
      console.error("Server URL is not defined");
      return;
    }

    try {
      console.log("Tentative de connexion avec:", { email, password });

      const response = await fetch(`${serverUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Réponse complète:", data);

      if (response.ok && data.session?.access_token) {
        console.log("Token reçu, stockage en cours...");
        await AuthService.storeAuthData(data.session.access_token, data.user);
        router.replace("/(tabs)/home");
      } else {
        console.error(
          "Erreur de connexion:",
          data.message || "Erreur inconnue"
        );
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Connexion</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
