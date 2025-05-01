import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { AuthService } from "@/service/auth/auth.service";
import DropDownPicker from "react-native-dropdown-picker";

interface Employee {
  _id: string;
  firstname: string;
  lastname: string;
}

export default function CreateCustomerForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    employeeAffected: "",
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
        employeeAffected: value,
      }));
    }
  }, [value]);

  const fetchEmployees = async () => {
    try {
      const token = await AuthService.getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.serverUrl}/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setEmployees(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Vérifier que les champs requis sont remplis
      if (!formData.address || !formData.city || !formData.zipCode) {
        Alert.alert("Erreur", "L'adresse complète est requise");
        return;
      }

      if (!value) {
        Alert.alert("Erreur", "Veuillez sélectionner un commercial");
        return;
      }

      // Géocoder l'adresse avant l'envoi
      const geocodeSuccess = await geocodeAddress();
      if (!geocodeSuccess) return;

      const token = await AuthService.getToken();

      const customerData = {
        ...formData,
        employeeAffected: value,
      };

      console.log("Données envoyées:", customerData); // Debug

      const response = await fetch(
        `${Constants.expoConfig?.extra?.serverUrl}/customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerData),
        }
      );

      console.log("Status:", response.status); // Debug
      const responseText = await response.text(); // Récupérer le texte brut
      console.log("Response text:", responseText); // Debug

      if (responseText) {
        const data = JSON.parse(responseText);
        if (response.ok) {
          Alert.alert("Succès", "Le client a été créé avec succès");
          setFormData({
            fullname: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            zipCode: "",
            latitude: "",
            longitude: "",
            employeeAffected: "",
          });
        }
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

  const geocodeAddress = async (): Promise<boolean> => {
    try {
      const { address, city, zipCode } = formData;
      const fullAddress = `${address}, ${zipCode} ${city}, France`;
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
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lon.toString(),
        }));
        return true;
      }
      Alert.alert("Erreur", "Adresse non trouvée");
      return false;
    } catch (error) {
      console.error("Erreur lors du géocodage:", error);
      Alert.alert("Erreur", "Erreur lors de la géolocalisation");
      return false;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Nouveau Client</Text>

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
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Téléphone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
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
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Code postal"
              value={formData.zipCode}
              onChangeText={(text) =>
                setFormData({ ...formData, zipCode: text })
              }
              style={styles.input}
              keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
              <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                items={employees.map((emp) => ({
                  label: `${emp.firstname} ${emp.lastname}`,
                  value: emp._id,
                }))}
                placeholder="Sélectionner un commercial"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Créer le client</Text>
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
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
