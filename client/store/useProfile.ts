import { create } from "zustand";

interface ProfileState {
  profile: string | null;
  phone: string | null;
  setProfile: (profile: string | null) => void;
  setPhone: (phone: string | null) => void;
}

export const useProfile = create<ProfileState>((set) => ({
  profile: "1",
  phone: "1111111111",
  setProfile: (profile) => set({ profile }),
  setPhone: (phone) => set({ phone }),
}));
