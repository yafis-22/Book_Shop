import { writable } from 'svelte/store';

// Initial state
const initialState = {
    userToken: null,
    isAdmin: false,
};

// Create a writable store
const authStore = writable(initialState);

export default authStore;
