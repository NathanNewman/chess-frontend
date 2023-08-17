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
        },
        "post"
      );
      this.login(
        response.token,
        response.user.username,
        response.user.elo
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
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
        response.user.elo
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
      console.error("API Error:", error);
      throw error;
    }
  }

  static async deleteUser(username) {
    try {
      const response = await this.request(`users/${username}`, {}, "delete");
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  static login(token, username, elo) {
    localStorage.setItem("authenticated", token);
    localStorage.setItem("username", username);
    localStorage.setItem("elo", elo);
    this.token = token;
    return token;
  }

  static logout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("elo");
  }

  static async recordGame(username, result, elo, moves, playerColor) {
    console.log(elo);
    try {
      let { user } = await this.request(
        "game/record",
        {
          username: username,
          result: result,
          elo: elo,
          moves: moves,
          userColor: playerColor,
        },
        "post"
      );
      localStorage.setItem("elo", user.elo);
      return user;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  static async replayGame(matchId) {
    try {
      const response = await this.request(`game/replay/${matchId}`, {}, "get");
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  static async getMatches(username) {
    try {
      const response = await this.request(
        `game/matches/${username}`,
        {},
        "get"
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  static async userProfile(username) {
    const user = await this.getUser(username);
    const matches = await this.getMatches(username);
    user.matches = matches;
    return user;
  }
  static async getLeaders() {
    try {
      const leaders = await this.request("users/leaderboard", {}, "get");
      return leaders;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  static async getWinLoss(username) {
    try {
      const response = await this.request(
        `game/win-loss/${username}`,
        {},
        "get"
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}

export default ChessApi;
