import type { DrawerState } from "~/types/models";

export const useDrawer = () => {
  const state = useState<DrawerState>("app-drawer", () => ({
    isOpen: false,
    icon: "",
    type: "",
    title: "",
    description: "",
    component: null,
    props: {},
    outsideClick: true,
  }));

  const open = (config: {
    title: string;
    description?: string;
    type?: string;
    icon?: string;
    component?: any;
    props?: Record<string, any>;
    outsideClick?: boolean;
  }) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    state.value = {
      isOpen: true,
      type: config.type || "custom",
      icon: config.icon || "shopping-bag",
      title: config.title,
      description: config.description || "",
      component: config.component ? markRaw(config.component) : null,
      props: config.props || {},
      outsideClick: config.outsideClick || true,
    };
    if (process.client) {
      document.body.style.overflow = "hidden";
    }
  };

  const close = () => {
    state.value.isOpen = false;
    if (process.client) {
      document.body.style.overflow = "unset";
    }
  };

  return {
    state,
    open,
    close,
  };
};
