<template>
    <div id="game" @click="shot" @mousemove="movePlayer">
        <img id="player" ref="player" src="../assets/player.png" alt="player" />
        <button v-if="!ready" @click="play" class="play">PLAY</button>
        <button v-else @click="pause" class="pause">PAUSE</button>
        <div id="infos">
            <div>Score: {{ score }}</div>
            <div>Lives: {{ lives }}</div>
        </div>
        <audio ref="bit" loop>
            <source src="../assets/8bit.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <audio ref="original" loop autoplay>
            <source src="../assets/original.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import kebabsImage from "../assets/kebabs.png";

const player = ref(null);
const bit = ref(null);
const original = ref(null);

const score = ref(0);
const lives = ref(3);

const ready = ref(false);
const skipFirst = ref(true);
const kebabs = ref([]);

function movePlayer() {
    if (!ready.value) return;
    const { clientX, clientY } = event;
    const x = clientX;
    player.value.style.left = `${x}px`;
}

function createKebab() {
    if (!ready.value) return;
    const kebab = document.createElement("img");
    kebab.classList.add("kebabs");
    kebab.src = `${kebabsImage}`;
    kebab.style.left = `${Math.random() * window.innerWidth}px`;
    let kebabY = "0";
    kebab.style.top = `${kebabY}px`;
    document.body.appendChild(kebab);
    kebabs.value.push(kebab);
    let interval = setInterval(() => {
        kebab.style.top = `${kebabY++}px`;
        if (kebabY > window.innerHeight) {
            clearInterval(interval);
            kebab.remove();
            kebabs.value = kebabs.value.filter((k) => k !== kebab);
        }
    }, 5);
}

function play() {
    ready.value = !ready.value;
    if (ready.value) {
        bit.value.play();
        original.value.pause();
    } else {
        bit.value.pause();
        original.value.play();
    }

    setInterval(createKebab, 1000);
}

function pause() {
    ready.value = !ready.value;
    if (ready.value) {
        bit.value.play();
        original.value.pause();
    } else {
        bit.value.pause();
        original.value.play();
    }
}

function shot() {
    if (!ready.value) return;
    const { clientX, clientY } = event;
    const x = clientX;
    const y = clientY;
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${x}px`;
    let bulletY = "90";
    bullet.style.bottom = `${bulletY}px`;
    document.body.appendChild(bullet);
    let interval = setInterval(() => {
        bullet.style.bottom = `${bulletY++}px`;

        //check if bullet hit kebab
        kebabs.value.forEach((k) => {
            let kebabRect = k.getBoundingClientRect();
            let bulletRect = bullet.getBoundingClientRect();
            console.log();
            if (
                Math.abs(kebabRect.top - bulletRect.top) < 45 &&
                Math.abs(kebabRect.left - bulletRect.left) < 45
            ) {
                clearInterval(interval);
                bullet.remove();
                k.remove();
                kebabs.value = kebabs.value.filter((k) => k.element !== k);
            }
        });

        if (bulletY > window.innerHeight) {
            clearInterval(interval);
            bullet.remove();
        }
    }, 5);
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap");

*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: inherit;
    overflow: hidden;
    user-select: none;
}

body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: poppins, sans-serif;
}
#game {
    height: 100vh;
    width: 100vw;
    background: url("../assets/background.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
}

#player {
    position: absolute;
    bottom: 0;
    left: 20px;
    width: 100px;
    height: 100px;
    translate: -50%;
    pointer-events: none;
    user-select: none;
}

.play {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    outline: 0;
    border: 0;
    background: #fff;
    width: 300px;
    height: 100px;
    border-radius: 20px;
    font-size: 2rem;
}

.pause {
    position: absolute;
    top: 20px;
    left: 60px;
    translate: -50% -50%;
    outline: 0;
    border: 0;
    background: rgb(52, 40, 40);
    width: 100px;
    height: 33px;
    border-radius: 20px;
    font-size: 1.4rem;
    color: white;
}

.bullet {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    animation: bullet 1s linear;
}

.kebabs {
    width: 60px;
    aspect-ratio: 1;
    position: absolute;
    pointer-events: none;
    user-select: none;
}
#infos {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    font-size: 1.5rem;
    font-weight: 500;
    text-shadow: 0 0 10px #000;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
}
</style>
