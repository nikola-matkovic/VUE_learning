<template>
    <div id="game">
        <div id="land"></div>
        <div id="player" ref="player"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const player = ref(null);
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
    position: relative;
}

#land {
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 100px;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 128, 0, 0.783) 10%,
        rgb(124, 35, 19) 80%
    );
}
#player {
    width: 50px;
    height: 80px;
    background-color: #000;
    position: absolute;
    bottom: 140px;
    left: 50px;
}
</style>
