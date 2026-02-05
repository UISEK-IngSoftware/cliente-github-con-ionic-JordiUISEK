import { useState } from 'react';
import { useIonViewDidEnter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/react';
import { UserInfo } from '../interfaces/UserInfo';
import { getUserInfo } from '../services/GithubService';
import AuthService from '../services/AuthService';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './Tab3.css';

const Tab3: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    login: '',
    name: 'No se puede cargar el nombre de usuario',
    username: 'no-username',
    avatar_url: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    email: 'No se puede cargar el email del usuario',
    bio: 'No se puede cargar la biografia',
  });

  const loadUserInfo = async () => {
    setLoading(true);
    const response = await getUserInfo();
    setUserInfo({
      login: response.login,
      name: response.name,
      avatar_url: response.avatar_url,
      bio: response.bio,
    });
    setLoading(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    history.push('/login');
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img alt={userInfo.login} src={userInfo.avatar_url} className="img" />
          <IonCardHeader>
            <IonCardTitle>{userInfo.name}</IonCardTitle>
            <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>{userInfo.bio}</IonCardContent>

          <IonButton expand="block" color="danger" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
        </IonCard>
      </IonContent>
      <LoadingSpinner isOpen={loading} />
    </IonPage>
  );
};

export default Tab3;
