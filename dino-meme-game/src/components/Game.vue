<template>
    <div id="game"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
</script>

<style>
#app {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game {
    border: 1px solid #000;
    width: 800px;
    height: 600px;
}
</style>
