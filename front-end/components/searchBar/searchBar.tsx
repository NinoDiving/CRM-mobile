import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  onSearchResults: (results: any[]) => void;
};

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const token = await AuthService.getToken();
      console.log("Token:", token);

      const url = `${Constants.expoConfig?.extra?.SERVER_URL}/customer/search?name=${searchTerm}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      if (responseText) {
        const data = JSON.parse(responseText);
        onSearchResults(data);
      } else {
        onSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      onSearchResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un client"
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
