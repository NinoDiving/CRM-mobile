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

type Employee = {
  id: string;
  firstname: string;
  lastname: string;
};

export default function CreateCustomerForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    latitude: "",
    longitude: "",
    employee_affected: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        employee_affected: value,
      }));
    }
  }, [value]);

  const fetchEmployees = async () => {
    try {
      const token = await AuthService.getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.SERVER_URL}/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Vérifier que les champs requis sont remplis
      if (!formData.address || !formData.city || !formData.zipcode) {
        Alert.alert("Erreur", "L'adresse complète est requise");
        return;
      }

      if (!value) {
        Alert.alert("Erreur", "Veuillez sélectionner un commercial");
        return;
      }

      // Géocoder l'adresse avant l'envoi
      const geoData = await geocodeAddress();
      if (!geoData) return;

      const token = await AuthService.getToken();

      const customerData = {
        ...formData,
        employee_affected: value,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
      };

      console.log("Données envoyées:", customerData);

      const response = await fetch(
        `${Constants.expoConfig?.extra?.SERVER_URL}/customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerData),
        }
      );

      if (response.ok) {
        Alert.alert("Succès", "Le client a été créé avec succès");
        setFormData({
          fullname: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          zipcode: "",
          latitude: "",
          longitude: "",
          employee_affected: "",
        });
      } else {
        throw new Error("Réponse vide du serveur");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création du client"
      );
    }
  };

  const geocodeAddress = async (): Promise<{
    latitude: string;
    longitude: string;
  } | null> => {
    try {
      const { address, city, zipcode } = formData;
      const fullAddress = `${address}, ${zipcode} ${city}, France`;
      const encodedAddress = encodeURIComponent(fullAddress);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            "Accept-Language": "fr",
            "User-Agent": "CRMMobileApp/1.0 (contact@votremail.com)",
          },
        }
      );

      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return {
          latitude: lat.toString(),
          longitude: lon.toString(),
        };
      }
      Alert.alert("Erreur", "Adresse non trouvée");
      return null;
    } catch (error) {
      console.error("Erreur lors du géocodage:", error);
      Alert.alert("Erreur", "Erreur lors de la géolocalisation");
      return null;
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
              <Text style={styles.title}>Nouveau Client</Text>

              <View style={styles.pickerContainer}>
                <DropDownPicker
                  open={open}
                  setOpen={setOpen}
                  value={value}
                  setValue={setValue}
                  items={employees.map((emp) => ({
                    key: emp.id,
                    label: `${emp.firstname} ${emp.lastname}`,
                    value: emp.id,
                  }))}
                  placeholder="Sélectionner un commercial"
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
                  placeholder="Nom complet"
                  value={formData.fullname}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullname: text })
                  }
                  style={styles.input}
                />

                <TextInput
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  style={styles.input}
                  keyboardType="phone-pad"
                />

                <TextInput
                  placeholder="Adresse"
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                  style={styles.input}
                />

                <TextInput
                  placeholder="Ville"
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  style={styles.input}
                />

                <TextInput
                  placeholder="Code postal"
                  value={formData.zipcode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, zipcode: text })
                  }
                  style={styles.input}
                  keyboardType="numeric"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Créer le client</Text>
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
