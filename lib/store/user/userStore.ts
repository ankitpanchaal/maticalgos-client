import { create } from "zustand";

type State = {
  accName: string;
};

type Action = {
    setAccName: (accName: string) => void;
};

const useUserStore = create<State & Action>((set) => ({
    accName: "",
    setAccName: (accName) => set({ accName }),
}));

export default useUserStore;