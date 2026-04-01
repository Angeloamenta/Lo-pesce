import { create } from 'zustand';

export const useAppStore = create((set) => ({
  avatarPosition: 'center', /* "center" | "left" */
  activeComponent: null,    /* null | "products" | "locations" | "recipe" */
  isListening: false,
  isSpeaking: false,
  isConnecting: false,
  statusMessage: '',
  sessionReady: false,
  transcript: '',

  setAvatarPosition: (position) => set({ avatarPosition: position }),
  setActiveComponent: (component) => set({ activeComponent: component }),
  setListening: (status) => set({ isListening: status }),
  setSpeaking: (status) => set({ isSpeaking: status }),
  setConnecting: (status) => set({ isConnecting: status }),
  setStatus: (message) => set({ statusMessage: message }),
  setSessionReady: (ready) => set({ sessionReady: ready }),
  setTranscript: (text) => set({ transcript: text }),

  resetUI: () => set({
    avatarPosition: 'center',
    activeComponent: null,
    statusMessage: '',
    transcript: '',
  }),
}));
