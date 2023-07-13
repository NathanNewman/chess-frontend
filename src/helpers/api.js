import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class ChessApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const token = localStorage.getItem("authenticated");

    const url = `${BASE_URL}/${endpoint}`;

    const headers = { Authorization: `Bearer ${token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async createUser(username, password, imageURL) {
    try {
      let response = await this.request(
        "users/register",
        {
          username: username,
          password: password,
          imageURL: imageURL,
        },
        "post"
      );
      this.login(
        response.token,
        response.user.username,
        response.user.imageURL
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async authenticate(username, password) {
    try {
      const response = await this.request(
        "users/login",
        {
          username: username,
          password: password,
        },
        "post"
      );
      this.login(
        response.token,
        response.user.username,
        response.user.imageURL
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  static async getUser(username) {
    try {
      const response = await this.request(`users/${username}`, {}, "get");
      return response;
    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async updateUser(user) {
    try {
      const response = await this.request(
        `users/${user.username}`,
        {
          imageURL: user.imageURL,
        },
        "patch"
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async deleteUser(username) {
    try {
      const response = await this.request(`users/${username}`, {}, "delete");
      return response;
    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static login(token, username, imageURL) {
    localStorage.setItem("authenticated", token);
    localStorage.setItem("username", username);
    localStorage.setItem("imageURL", imageURL);
    this.token = token;
    return token;
  }

  static logout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("imageURL");
  }
}

export default ChessApi;
