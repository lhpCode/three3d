const whiteList = ["/login", "/404"];
const isWhiteListPage = (path: string): string | undefined => {
  return whiteList.find((item) => item === path);
};

export default isWhiteListPage;
