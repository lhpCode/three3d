import { computed } from "vue";
export default function (props: any, proName: string, emit: any) {
  return computed({
    get() {
      return new Proxy(props[proName], {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target, key, value) {
          emit(`update:${proName}`, {
            ...target,
            [key]: value,
          });
          return true;
        },
      });
    },
    set() {},
  });
}
