import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const AccessToken = atom({
  key: "AccessToken",
  default: null,
  // effects_UNSTABLE: [persistAtom],
});
export const Persist = atom({
  key: "Persist",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
