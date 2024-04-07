import service from "@/utils/request";

/** 登录 */
export function userLoginApi(data: {}) {
  return service({
    url: "user/login",
    method: "post",
    data,
  });
}

/** 获取用户信息 */
export function getUserInfoApi() {
  return service({
    url: "user/getUserInfo",
    method: "get",
  });
}
