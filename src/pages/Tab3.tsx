import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {
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
          <img alt="Jordi Sánchez" src="https://jorch.es/img/home/home.jpg" />
          <IonCardHeader>
            <IonCardTitle>Jordi Sánchez Fernández</IonCardTitle>
            <IonCardSubtitle>jordi.sanchez@uisek.edu.ec</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Soy un estudiante de Ingeniería en Software de la UISEK. Actualmente trabajo como desarrollador web en una empresa Europea.</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
