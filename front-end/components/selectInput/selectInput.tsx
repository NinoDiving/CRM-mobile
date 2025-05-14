import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Picker } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
// ... autres imports ...

interface Employee {
  _id: string;
  firstname: string;
  lastname: string;
}

export default function CreateCustomerForm() {
  const [formData, setFormData] = useState({
    // ... autres champs ...
    employeeAffected: "", // Ajout du champ employeeAffected
  });
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Charger la liste des employés au montage du composant
  useEffect(() => {
    fetchEmployees();
  }, []);

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
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.formContainer}>
            {/* ... autres champs du formulaire ... */}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.employeeAffected}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, employeeAffected: itemValue })
                }
              >
                <Picker.Item label="Sélectionner un employé" value="" />
                {employees.map((employee) => (
                  <Picker.Item
                    key={employee._id}
                    label={`${employee.firstname} ${employee.lastname}`}
                    value={employee._id}
                  />
                ))}
              </Picker>
            </View>

            {/* ... reste du formulaire ... */}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // ... autres styles ...
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
