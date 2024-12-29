import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// @ts-ignore
import "vuetify/styles";

export const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    global: {
      body: false,
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          background: "#161616",

          text: "#FAF8F8  ",

          surface: "#333333",
          primary: "#66C0FF",
        },
      },
    },
  },
});
