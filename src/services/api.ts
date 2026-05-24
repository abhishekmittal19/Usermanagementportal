export interface UserAddress {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface UserCompany {
  name: string;
  department: string;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  role: string;
  image?: string;
  address: UserAddress; 
  company: UserCompany;
  birthDate?: string;
  university?: string;
}

const BASE_URL = 'https://dummyjson.com';

// Mock Delay Helper to showcase skeleton loaders
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Get all users
  async getUsers(): Promise<User[]> {
    // Artificial delay to show skeleton loaders beautifully
    await delay(600);
    const response = await fetch(`${BASE_URL}/users?limit=0`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users;
  },

  // Get a single user by ID
  async getUserById(id: number): Promise<User> {
    await delay(400);
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }
    return response.json();
  },

  // Add a user
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await delay(500);
    const response = await fetch(`${BASE_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  // Update a user
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    await delay(500);
    
    // For DummyJSON, ids > 208 are mock users we created locally.
    // Calling PUT /users/{id} for IDs > 208 will error on the server because they don't exist.
    // So we'll mock the response directly for those IDs!
    if (id > 208) {
      return { id, ...user } as User;
    }

    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user with id ${id}`);
    }
    return response.json();
  },

  // Delete a user
  async deleteUser(id: number): Promise<boolean> {
    await delay(500);
    
    if (id > 208) {
      return true;
    }

    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
    return true;
  },
};
