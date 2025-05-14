import { AuthService } from "@/service/auth/auth.service";
import Constants from "expo-constants";

export const fetchCustomerById = async (id: string) => {
  const token = await AuthService.getToken();
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/customer/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export const fetchCustomers = async () => {
  try {
    const token = await AuthService.getToken();
    const response = await fetch(
      `${Constants.expoConfig?.extra?.SERVER_URL}/customer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
  }
};
