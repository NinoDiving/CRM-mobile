import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";
const USER_KEY = "user_data";

export const AuthService = {
  async storeAuthData(token: string, userData: any) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des données d'authentification:",
        error
      );
      throw error;
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      throw error;
    }
  },

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      console.log(userData);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur:",
        error
      );
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  },
};
