type Ref<T> = { current: T } | ((instance: T) => void) | null;

export default function mergeRefs<T extends HTMLElement>(
  ...refs: Array<Ref<T> | Ref<T | null>>
) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}
