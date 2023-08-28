import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";
import { toast } from "react-toastify";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = async (data, navigate) => {
   
    try {
      const response = await axios.post(jwtServiceConfig.signUp, data);

      if (response.data.user) {
        toast("Sing Up done Successfully 😊");

        navigate("/sign-in");
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      throw error;
    }
  };

  signInWithEmailAndPassword = async (email, password) => {

    try {
      const response = await axios.post(jwtServiceConfig.signIn, {
        data: {
          email,
          password,
        },
      });

      let entityName;
      if (response.data.user) {
        entityName = "user";
      } else if (response.data.partner) {
        entityName = "partner";
      } else {
        throw new Error("Unknown entity type in response");
      }
      if (response.status === 200) {
        this.setSession(response.data.access_token);
        this.emit("onLogin", response.data[entityName]);
  
        return response.data[entityName];
      }
    } catch (error) {
      throw error;
    }
  };


 
  signInWithToken = async () => {
    const token = this.getAccessToken();
    try {

      const response = await axios.get(jwtServiceConfig.accessToken, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
 
      if (response.data.entityType === 'user' || response.data.entityType === 'partner') {
        this.setSession(response.data.access_token); // Enregistrer le token dans la session
        return response.data[response.data.entityType]; // Renvoyer l'entité appropriée (user ou partner)
      } else {
        this.logout();
        throw new Error("Failed to login with token. Invalid entity type.");
      }
    } catch (error) {
      this.logout();
      throw new Error("Failed to login with token.");
    }
  };
  
  

  updateUserData = (user) => {
    console.log( "user to update", user)
    return axios.put(`${jwtServiceConfig.updateUser}${user._id}`, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
