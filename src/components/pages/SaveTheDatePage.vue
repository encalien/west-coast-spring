<template>
  <section id="landing">
    <a href="http://" target="_blank" rel="noopener noreferrer">
      <img src="/src/assets/images/flyer.png" alt="banner" id="banner" />
    </a>
    <h1>Coming soon!</h1>
    <div id="social-icons" class="menu-item flex-container flex-container-row">
      <a :href="'mailto:' + $t('contact.email')" class="menu-item-link">
        <font-awesome-icon icon="fa-regular fa-envelope"></font-awesome-icon>
      </a>
      <a
        href="https://www.facebook.com/events/423860077298282"
        target="_blank"
        class="menu-item-link"
      >
        <font-awesome-icon icon="fa-brands fa-facebook-f"></font-awesome-icon>
      </a>
    </div>
  </section>
</template>

<style scoped>
#banner {
  max-width: 70vw;
  max-height: 50vh;
  margin-bottom: 2rem;
}

#landing {
  color: var(--dark-1);
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-weight: bold;
}

#social-icons {
  height: 40px;
  margin: 0 2rem;
}

#social-icons > .flex-item {
  flex: 1 0 50%;
}

.menu-item-link {
  font-size: 1.2rem;
  font-weight: bold;
  display: block;
  width: 100%;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
