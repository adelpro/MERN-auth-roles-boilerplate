import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
// TODO get default value from accesstoken from cookies because oafter reloud the default value is null
export const AccessToken = atom({
  key: 'AccessToken',
  default: null
});
export const NotificationsLength = atom({
  key: 'NotificationsLength',
  default: 0
});
export const Persist = atom({
  key: 'Persist',
  default: false,
  effects_UNSTABLE: [persistAtom]
  // effects: [
  //  ({ setSelf }) => {
  //    const cookies = new Cookies()
  //     const checkToken = cookies.get('checkToken')
  //  },
  // ],
});
