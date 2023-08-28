import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import jwtService from './services/jwtService';
import { toast } from "react-toastify";
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', async () => {
      try {
    
        /**
         * Sign in and retrieve user data with stored token
         */
        try {
          const user = await jwtService.signInWithToken();
          success(user, 'You are already Signed 😉');
        } catch (error) {
          pass(error.message);
        }
        
      } catch (error) {
        // Handle the error here, if necessary
        console.error("An error occurred:", error);
        // You can also send the error to a centralized error handler
        // using an error management tool like Sentry or log it on a server.
      }
    });
    

    jwtService.on('onLogin', (user) => {
      success(user, "Sing In done Successfully 😊");
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      try {
        if (message) {
          toast(message);
        
        }
    
        Promise.all([
          dispatch(setUser(user)),
          // Vous pouvez recevoir des données ici avant l'initialisation de l'application
        ]).then((values) => {
          setWaitAuthCheck(false);
          setIsAuthenticated(true);
        });
      } catch (error) {
        // Gérer l'erreur ici, si nécessaire
        console.error("Une erreur s'est produite :", error);
        // Vous pouvez également envoyer l'erreur à un gestionnaire d'erreurs centralisé
        // en utilisant un outil de gestion des erreurs comme Sentry ou en le journalisant sur un serveur.
      }
    }
    

    function pass(message) {
      if (message) {
        toast.error(message);
        //dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
