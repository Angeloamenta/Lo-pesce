import { create } from 'zustand';

export const useAppStore = create((set) => ({
  avatarPosition: 'center', /* "center" | "left" */
  activeComponent: null,    /* null | "products" | "locations" | "recipe" */
  isListening: false,
  isSpeaking: false,
  isConnecting: false,
  statusMessage: '',
  sessionReady: false,

  setAvatarPosition: (position) => set({ avatarPosition: position }),
  setActiveComponent: (component) => set({ activeComponent: component }),
  setListening: (status) => set({ isListening: status }),
  setSpeaking: (status) => set({ isSpeaking: status }),
  setConnecting: (status) => set({ isConnecting: status }),
  setStatus: (message) => set({ statusMessage: message }),
  setSessionReady: (ready) => set({ sessionReady: ready }),

  resetUI: () => set({
    avatarPosition: 'center',
    activeComponent: null,
    statusMessage: '',
  }),
}));
