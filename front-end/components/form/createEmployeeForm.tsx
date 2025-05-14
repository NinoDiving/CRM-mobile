import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CreateEmployeeForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        role: value,
      }));
    }
  }, [value]);

  const handleSubmit = async () => {
    try {
      const token = await AuthService.getToken();
      const employeeData = {
        ...formData,
      };

      console.log("Données envoyées:", employeeData);

      const response = await fetch(
        `${Constants.expoConfig?.extra?.SERVER_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employeeData),
        }
      );

      if (response.ok) {
        Alert.alert("Succès", "L'employée a été créé avec succès");
        setFormData({
          lastname: "",
          firstname: "",
          email: "",
          password: "",
          role: "",
        });
      } else {
        throw new Error("Réponse vide du serveur");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de l'employé"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Nouvel Employé</Text>
              <View style={styles.pickerContainer}>
                <DropDownPicker
                  open={open}
                  setOpen={setOpen}
                  value={value}
                  setValue={setValue}
                  items={[
                    { label: "Commercial", value: "commercial" },
                    { label: "Administrateur", value: "admin" },
                  ]}
                  placeholder="Sélectionner un rôle"
                  zIndex={3000}
                  zIndexInverse={1000}
                  style={styles.picker}
                  containerStyle={styles.pickerContainer}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
              >
                <TextInput
                  placeholder="Nom"
                  value={formData.lastname}
                  onChangeText={(text) =>
                    setFormData({ ...formData, lastname: text })
                  }
                  style={styles.input}
                />

                <TextInput
                  placeholder="Prénom"
                  value={formData.firstname}
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstname: text })
                  }
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  style={styles.input}
                />

                <TextInput
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry
                  style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Créer l&apos;employé</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
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
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  dropDownContainer: {
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
});
