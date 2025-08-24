import { create } from "zustand";

interface ProfileState {
  profile: string | null;
  phone: string | null;
  setProfile: (profile: string | null) => void;
  setPhone: (phone: string | null) => void;
}

export const useProfile = create<ProfileState>((set) => ({
  profile: "13",
  phone: "1313131313",
  setProfile: (profile) => set({ profile }),
  setPhone: (phone) => set({ phone }),
}));
