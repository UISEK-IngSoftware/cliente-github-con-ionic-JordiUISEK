import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonInput, IonButton, IonText } from '@ionic/react';
import { useState } from 'react';
import { logoGithub } from 'ionicons/icons';
import AuthService from '../services/AuthService';
import './Login.css';

const Login: React.FC = () => {

  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username.trim() && !token.trim()) {
      setError('Por favor, complete ambos campos');
      return;
    } 
    
    const success = AuthService.login(username, token);
    if (success) {
      window.location.href = '/repositorios';
    } else {
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-content">
            <IonIcon icon={logoGithub} className="login-logo"></IonIcon>
            <h2>Iniciar sesión con GitHub</h2>
            <IonInput className="login-field" label="Usuario de GitHub" labelPlacement="floating" fill="outline" type="text" value={username} onIonChange={(e) => setUsername(e.detail.value!)} required></IonInput>
            <IonInput className="login-field" label="Token de acceso personal" labelPlacement="floating" fill="outline" type="password" value={token} onIonChange={(e) => setToken(e.detail.value!)} required></IonInput>
            {error && <IonText color="danger" className="error-message">{error}</IonText>}
            <IonButton expand="block" type="submit">Iniciar sesión</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
