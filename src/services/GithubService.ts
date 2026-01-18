import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import AuthService from "./AuthService";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL as string;
// const GITHUB_API_TOKEN = `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN as string}`;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
    const authHeader = AuthService.getAuthHeader();
    if (authHeader) {
        config.headers.Authorization = authHeader;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
 
    try {
        const response = await githubApi.get(`/user/repos`, {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            },
        });

        const reposData: RepositoryItem[] = response.data.map((repo: {
            name: string;
            description: string | null;
            owner?: { avatar_url?: string; login?: string };
            language: string | null;
        }) => ({
            name: repo.name,
            description: repo.description || null,
            imageUrl: repo.owner?.avatar_url || null,
            owner: repo.owner?.login || null,
            language: repo.language || null,
        }));

        return reposData;
    } catch (error) {
        console.error("Error al obtener los repositorios", error);
        return [];
    }
};

export const createRepository = async (repository: RepositoryItem): Promise<RepositoryItem | null> => {
    try {
        const payload = {
            name: repository.name,
            description: repository.description || '',
            private: false,
            auto_init: false
        };
        const response = await githubApi.post(`/user/repos`, payload);
        console.log("Repositorio creado: ", response.data);
        return {
            name: response.data.name,
            description: response.data.description || null,
            imageUrl: response.data.owner?.avatar_url || null,
            owner: response.data.owner?.login || null,
            language: response.data.language || null,
        };
    } catch (error) {
        console.error("Error al crear el repositorio", error);
        throw error;
    }
};

export const getUserInfo = async (): Promise<UserInfo | null> => {
    try {
        const response = await githubApi.get(`/user`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la información del usuario: ", error);
        return null;
    }
};

export const deleteRepository = async (owner: string, repoName: string): Promise<boolean> => {
    try {
        await githubApi.delete(`/repos/${owner}/${repoName}`);
        console.log("Repositorio eliminado: ", repoName);
        return true;
    } catch (error) {
        console.error("Error al eliminar el repositorio", error);
        return false;
    }
};

export const updateRepository = async (owner: string, repoName: string, updates: Partial<RepositoryItem>): Promise<RepositoryItem | null> => {
    try {
        const response = await githubApi.patch(`/repos/${owner}/${repoName}`, updates);
        console.log("Repositorio actualizado: ", response.data);
        return {
            name: response.data.name,
            description: response.data.description || null,
            imageUrl: response.data.owner?.avatar_url || null,
            owner: response.data.owner?.login || null,
            language: response.data.language || null,
        };
    } catch (error) {
        console.error("Error al actualizar el repositorio", error);
        return null;
    }
};