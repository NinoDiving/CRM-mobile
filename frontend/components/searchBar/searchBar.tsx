import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";
import { useState } from "react";
import { Button, TextInput, View, StyleSheet } from "react-native";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const token = await AuthService.getToken();
      console.log("Token:", token);

      const url = `${Constants.expoConfig?.extra?.serverUrl}/employee/name?name=${searchTerm}`;
      console.log("URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (responseText) {
        const data = JSON.parse(responseText);
        setSearchResults(data);
        console.log("Parsed data:", data);
      } else {
        console.log("Empty response");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un employé"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Rechercher" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    margin: 10,
  },

  input: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
