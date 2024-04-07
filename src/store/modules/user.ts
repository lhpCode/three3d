import { defineStore } from "pinia";
import { store } from "../index";
export interface State extends UserInfoParams {
  userName: string;
  token: string;
  role: string;
  routerList: RouterRes[];
}
export interface UserInfoParams {
  nickName: string;
  userName: string;
  token: string;
  role?: string;
}

export const useUserInfoStore = defineStore({
  id: "user",
  state: (): State => ({
    nickName: "",
    userName: "",
    token: "",
    role: "",
    routerList: [],
  }),
  actions: {
    dropLogin() {
      this.userName = "";
      this.token = "";
      this.role = "";
      this.routerList = [];
    },
    getToken() {
      return this.token;
    },
    login(params: UserInfoParams) {
      const { userName, token, nickName } = params;
      this.userName = userName;
      this.token = token;
      this.nickName = nickName;
    },
    setUserInfo(role: string, routerList: any) {
      this.role = role;
      this.routerList = routerList;
    },
    async getUserInfo() {
      return this.routerList;
    },
  },
  persist: {
    paths: ["nickName", "userName", "token"],
  },
});

export const useUserInfoStoreWithOut = () => {
  return useUserInfoStore(store);
};
