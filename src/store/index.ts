import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { App } from "vue";
const store = createPinia();
store.use(piniaPluginPersistedstate);
const initStore = (app: App<Element>) => {
  app.use(store);
};
export { store, initStore };
