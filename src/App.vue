<template>
  <div id="app">
    <FileDownloader />
  </div>
</template>

<script>
import FileDownloader from './components/FileDownloader.vue';

export default {
  name: 'App',
  components: {
    FileDownloader,
  },
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

body {
  background-color: #121212;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

#app {
  width: 100%;
  max-width: 600px;
  padding: 20px;
}
</style>