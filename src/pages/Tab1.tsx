import React from 'react';
import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, useIonViewDidEnter, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, useIonAlert } from '@ionic/react';
import { trashOutline, pencilOutline } from 'ionicons/icons';
import RepoItem from '../components/RepoItem';
import './Tab1.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, deleteRepository, updateRepository } from '../services/GithubService';

const Tab1: React.FC = () => {

  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [presentAlert] = useIonAlert();
  const slidingRefs = React.useRef<{ [key: number]: HTMLIonItemSlidingElement | null }>({});

  const loadRepos = async () => {
    const reposData = await fetchRepositories();
    setRepos(reposData);
  };

  const handleDelete = async (repo: RepositoryItem, index: number) => {
    presentAlert({
      header: 'Confirmar eliminación',
      subHeader: `"${repo.name}"`,
      message: '¿Estás seguro de que deseas eliminar este repositorio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            slidingRefs.current[index]?.close();
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (repo.owner) {
              const success = await deleteRepository(repo.owner, repo.name);
              slidingRefs.current[index]?.close();
              if (success) {
                setRepos(repos.filter(r => r.name !== repo.name || r.owner !== repo.owner));
                setTimeout(() => {
                  presentAlert({
                    header: 'Éxito',
                    message: 'Repositorio eliminado correctamente',
                    buttons: ['OK']
                  });
                }, 300);
              } else {
                setTimeout(() => {
                  presentAlert({
                    header: 'Error',
                    message: 'No se pudo eliminar el repositorio',
                    buttons: ['OK']
                  });
                }, 300);
              }
            }
            return true;
          }
        }
      ]
    });
  };

  const handleEdit = (repo: RepositoryItem, index: number) => {
    presentAlert({
      header: 'Editar repositorio',
      cssClass: 'edit-repo-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre',
          value: repo.name,
          placeholder: 'Nombre del repositorio'
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción',
          value: repo.description || '',
          placeholder: 'Descripción del repositorio'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            slidingRefs.current[index]?.close();
          }
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (repo.owner && data.name) {
              const updated = await updateRepository(repo.owner, repo.name, {
                name: data.name,
                description: data.description || null
              });
              slidingRefs.current[index]?.close();
              if (updated) {
                setRepos(repos.map(r => 
                  (r.name === repo.name && r.owner === repo.owner) ? updated : r
                ));
                setTimeout(() => {
                  presentAlert({
                    header: 'Éxito',
                    message: 'Repositorio actualizado correctamente',
                    buttons: ['OK']
                  });
                }, 300);
              } else {
                setTimeout(() => {
                  presentAlert({
                    header: 'Error',
                    message: 'No se pudo actualizar el repositorio',
                    buttons: ['OK']
                  });
                }, 300);
              }
            }
            return true;
          }
        }
      ]
    });
  };

  useIonViewDidEnter(() => {
    console.log('***** Cargando repositorios *****');
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repos.map((repo, index) => (
            <IonItemSliding 
              key={index}
              ref={(el) => {
                if (el) {
                  slidingRefs.current[index] = el;
                }
              }}
            >
              <IonItemOptions side="start">
                <IonItemOption color="primary" onClick={() => handleEdit(repo, index)}>
                  <IonIcon icon={pencilOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
              <RepoItem repo={repo} />
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => handleDelete(repo, index)}>
                  <IonIcon icon={trashOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
