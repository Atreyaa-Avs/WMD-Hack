import { create } from "zustand";

interface ProfileState {
  profile: string | null;
  setProfile: (profile: string | null) => void;
}

export const useProfile = create<ProfileState>((set) => ({
  profile: "1",
  setProfile: (profile) => set({ profile }),
}));
