import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import en from "./i18n/en";
import si from "./i18n/si";
import fr from "./i18n/fr";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      lang: "en",
    };
  },
  mutations: {
    changeLang(state, lang) {
      state.lang = lang;
    },
  },
});

import Home from "./components/pages/Home.vue";
import Staff from "./components/pages/Staff.vue";
import NotFound from "./components/pages/NotFound.vue";
import Schedule from "./components/pages/Schedule.vue";
import Pricing from "./components/pages/Pricing.vue";
import TermsAndConditions from "./components/pages/TermsAndConditions.vue";
import Levels from "./components/pages/Levels.vue";
import WSDC from "./components/pages/WSDC.vue";
import EventLocation from "./components/pages/EventLocation.vue";
import Slovenia from "./components/pages/Slovenia.vue";
import HowToGetHere from "./components/pages/HowToGetHere.vue";

import { createRouter, createWebHistory } from "vue-router";

import "./assets/stylesheets/main.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DayTrip from "./components/pages/DayTrip.vue";

/* add icons to the library */
library.add(faEnvelope, faFacebookF, faInstagram, faBars);

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: { en, si, fr },
});

const routes: any = [
  { path: "/:lang(en|si|fr)/", component: Home },
  {
    path: "/:lang(en|si|fr)/team",
    component: Staff,
  },
  // {
  //   path: '/:lang(en|si|fr)/team/djs',
  //   component: Staff,
  //   props: { staffIndex: 1 }
  // },
  // {
  //   path: '/:lang(en|si|fr)/team/mc',
  //   component: Staff,
  //   props: { staffIndex: 2 }
  // },
  // {
  //   path: '/:lang(en|si|fr)/team/competitions',
  //   component: Staff,
  //   props: { staffIndex: 3 }
  // },
  { path: "/:lang(en|si|fr)/workshops/levels", component: Levels },
  { path: "/:lang(en|si)/workshops/wsdc", component: WSDC },
  {
    path: "/:lang(fr)/workshops/wsdc",
    component: WSDC,
    redirect: "/fr",
  },
  { path: "/:lang(en|si|fr)/workshops/schedule", component: Schedule },
  { path: "/:lang(en|si|fr)/pricing", component: Pricing },
  {
    path: "/:lang(en|si|fr)/location/venue/main",
    component: EventLocation,
    props: { venueIndex: 0 },
  },
  {
    path: "/:lang(en|si|fr)/location/venue/preparty",
    component: EventLocation,
    props: { venueIndex: 1 },
  },
  { path: "/:lang(en|si|fr)/location/slovenia", component: Slovenia },
  {
    path: "/:lang(si)/location/slovenia",
    component: EventLocation,
    redirect: "/si/location/venue",
  },
  {
    path: "/:lang(en|si|fr)/location/how-to-get-here",
    component: HowToGetHere,
  },
  {
    path: "/:lang(si)/location/how-to-get-here",
    component: EventLocation,
    redirect: "/si/location/venue",
  },
  { path: "/:lang(en|si|fr)/day-trip", component: DayTrip },
  {
    path: "/:lang(en|si|fr)/terms-and-conditions",
    component: TermsAndConditions,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.mount("#app");
