import { useEffect, useState } from "preact/hooks";

const read = () => decodeURIComponent(location.hash.replace(/^#\/?/, "")) || "overview";

export function useRoute() {
  const [route, set] = useState(read);
  useEffect(() => {
    const on = () => { set(read()); window.scrollTo(0, 0); };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return route;
}
