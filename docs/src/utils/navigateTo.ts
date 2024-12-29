import router from "../plugins/router";

export const navigateTo = (url: string, external = false) => {
  if (external) {
    window.location.href = url;
  } else {
    router.push(url);
  }
};
