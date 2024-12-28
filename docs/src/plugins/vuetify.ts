import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// @ts-ignore
import "vuetify/styles";

export const vuetify = createVuetify({
  components,
  directives,
});
