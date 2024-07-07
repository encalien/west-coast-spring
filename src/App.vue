<script lang="ts">
// Import components
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import HomePage from "./components/pages/HomePage.vue";
import StaffPage from "./components/pages/StaffPage.vue";
import EventLocationPage from "./components/pages/EventLocationPage.vue";
import NotFoundPage from "./components/pages/NotFoundPage.vue";
import SchedulePage from "./components/pages/SchedulePage.vue";
import RegistrationPage from "./components/pages/RegistrationPage.vue";
import PricingPage from "./components/pages/PricingPage.vue";
import SaveTheDatePage from "./components/pages/SaveTheDatePage.vue";
import TermsAndConditionsPage from "./components/pages/TermsAndConditionsPage.vue";

const routes: any = {
  "/": HomePage,
  "/staff": StaffPage,
  "/schedule": SchedulePage,
  "/pricing": PricingPage,
  "/location": EventLocationPage,
  "/registration": RegistrationPage,
  "/terms-and-conditions": TermsAndConditionsPage,
};

// const routes: any = {
//   "/": SaveTheDatePage,
// };

export default {
  data() {
    return {
      currentPath: window.location.hash,
    };
  },
  components: {
    HeaderComponent,
    FooterComponent,
    HomePage,
    StaffPage,
    SchedulePage,
    PricingPage,
    EventLocationPage,
    RegistrationPage,
    TermsAndConditionsPage,
    NotFoundPage,
    SaveTheDatePage,
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || NotFoundPage;
    },
  },
  mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
    });
  },
};
</script>

<template>
  <HeaderComponent />
  <main>
    <component :is="currentView" />
    <!-- <SaveTheDatePage /> -->
  </main>
  <FooterComponent />
</template>

<style scoped></style>
