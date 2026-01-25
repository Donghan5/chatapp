import { client } from '../../../lib/axios';
import { User } from '@chatapp/common-types';

export const userApi = {
    searchByEmail: async (email: string): Promise<User> => {
        const response = await client.get<User>("/users/search", {
            params: { email },
        });
        return response.data;
    },
    searchByUsername: async (username: string): Promise<User[]> => {
        const response = await client.get<User[]>("/users/search", {
            params: { username },
        });
        return response.data;
    },
};