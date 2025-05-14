import HomeAdmin from "@/components/home/homeAdmin";
import HomeEmployee from "@/components/home/homeEmployee";
import { AuthService } from "@/service/auth/auth.service";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
export default function HomeScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const employee = await AuthService.getUserData();
      if (employee.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsEmployee(true);
      }
    };
    checkRole();
  }, []);

  if (isAdmin) {
    return <HomeAdmin />;
  } else if (isEmployee) {
    return <HomeEmployee />;
  } else {
    return (
      <Text>Erreur lors de la récupération des données de l&apos;employé</Text>
    );
  }
}
