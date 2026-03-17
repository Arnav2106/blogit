import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useContactStore = create((set, get) => ({
    contacts: [],
    searchResults: [],
    isSearching: false,
    isLoadingContacts: false,

    getContacts: async () => {
        set({ isLoadingContacts: true });
        try {
            const res = await axiosInstance.get("/contacts");
            set({ contacts: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load contacts");
        } finally {
            set({ isLoadingContacts: false });
        }
    },

    searchByEmail: async (email) => {
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/contacts/search?email=${encodeURIComponent(email)}`);
            set({ searchResults: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Search failed");
        } finally {
            set({ isSearching: false });
        }
    },

    addContact: async (userId) => {
        try {
            await axiosInstance.post(`/contacts/add/${userId}`);
            toast.success("Contact added!");
            // Clear search results and refresh contacts
            set({ searchResults: [] });
            get().getContacts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add contact");
        }
    },

    removeContact: async (userId) => {
        try {
            await axiosInstance.delete(`/contacts/${userId}`);
            toast.success("Contact removed");
            get().getContacts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove contact");
        }
    },

    clearSearch: () => set({ searchResults: [] }),
}));
