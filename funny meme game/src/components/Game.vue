<template>
    <div
        id="game"
        @click="shot('left')"
        @contextmenu.prevent="shot('right')"
        @mousemove="movePlayer"
    >
        <img id="player" ref="player" src="../assets/player.png" alt="player" />
        <button v-if="!ready" @click="play" class="play">PLAY</button>
        <button v-else @click="pause" class="pause">PAUSE</button>
        <div id="infos">
            <div>High Score: {{ highScore }}</div>
            <div>Score: {{ score }}</div>
            <div class="life">
                <img src="../assets/sljiva.webp" alt="" />
                <div class="lifeBar">
                    <div class="inner2" ref="inner2"></div>
                </div>
            </div>
        </div>
        <audio ref="bit" loop>
            <source src="../assets/8bit.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <audio ref="original" loop autoplay>
            <source src="../assets/original.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <div class="goFast"><div class="inner" ref="inner"></div></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import kebabsImage from "../assets/kebabs.png";
import rakijaImg from "../assets/sljiva.webp";

const player = ref(null);
const bit = ref(null);
const original = ref(null);
const inner = ref(null);
const inner2 = ref(null);

const score = ref(0);
const highScore = ref(0);
const lives = ref(3);
const bulletSize = ref(20);
const ready = ref(false);
const kebabs = ref([]);
const rakijas = ref([]);
const remingBigBullet = ref(20);
const bullets = ref([]);
const canGoFast = ref(false);

const intervals = ref([]);
const kebabIntervals = ref([]);
const rakijaIntervals = ref([]);
const lifeTimeout = ref(null);

onMounted(() => {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            shot();
        }
    });
    const highScoreFromStorage = localStorage.getItem("highScore");
    if (highScoreFromStorage) {
        highScore.value = highScoreFromStorage;
    }
});

let goFastTimeout = null;

function setBulletSize(bullet) {
    if (remingBigBullet.value > 0) {
        remingBigBullet.value -= 1;
    } else {
        bulletSize.value = 20;
    }

    if (bulletSize.value === 20) {
        bullet.className = "smallBullet";
    }
    if (bulletSize.value === 50) {
        bullet.className = "biggerBullet";
    }
    if (bulletSize.value === 100) {
        bullet.className = "biggestBullet";
    }
}

function setBulletSpeed(button, bullet) {
    let speed = 5;
    if (button === "right" && canGoFast.value) {
        canGoFast.value = false;
        bullet.classList.add("fast");
        inner.value.classList.remove("animate");
        setTimeout(() => {
            clearTimeout(goFastTimeout);
            setGoFastTimeout();
            inner.value.classList.add("animate");
        }, 1000);
        speed = 10;
    }
    return speed;
}

function addLife() {
    lifeTimeout.value = setTimeout(() => {
        createRakija();
        clearTimeout(lifeTimeout.value);
        addLife();
    }, Math.random() * 120000);
}

function checkHighScore() {
    if (score.value > highScore.value) {
        highScore.value = score.value;
        localStorage.setItem("highScore", highScore.value);
    }
}

function movePlayer() {
    if (!ready.value) return;
    const { clientX, clientY } = event;
    const x = clientX;
    player.value.style.left = `${x}px`;
    // check if touching any of rakijas
    rakijas.value.forEach((rakija) => {
        const rakijaRect = rakija.getBoundingClientRect();
        const playerRect = player.value.getBoundingClientRect();
        if (
            Math.abs(rakijaRect.top - playerRect.top) > 150 ||
            Math.abs(rakijaRect.left - playerRect.left) > 100
        )
            return;

        rakija.remove();
        lives.value += 1;
        rakijas.value = rakijas.value.filter((r) => r !== rakija);
    });
}

function setGoFastTimeout() {
    inner.value.classList.add("animate");
    goFastTimeout = setTimeout(() => {
        console.log("i can go fast now");
        canGoFast.value = true;
    }, 5000);
}

function createKebab() {
    if (!ready.value) return;
    const kebab = document.createElement("img");
    kebab.classList.add("kebabs");
    kebab.src = `${kebabsImage}`;
    kebab.style.left = `${Math.random() * (window.innerWidth - 30) - 25}px`;
    let kebabY = "0";
    kebab.style.top = `${kebabY}px`;
    document.body.appendChild(kebab);
    kebabs.value.push(kebab);
    let interval = setInterval(() => {
        kebab.style.top = `${kebabY++}px`;
        if (kebabY > window.innerHeight) {
            clearInterval(interval);
            kebab.remove();
            lives.value -= 1;
            kebabs.value = kebabs.value.filter((k) => k !== kebab);
            kebabIntervals.value = kebabIntervals.value.filter(
                (k) => k !== interval
            );
        }
    }, 5);
    intervals.value.push(interval);
    kebabIntervals.value.push(interval);
}

function createRakija() {
    if (!ready.value) return;
    const rakija = document.createElement("img");
    rakijas.value.push(rakija);
    rakija.classList.add("rakija");
    rakija.src = `${rakijaImg}`;
    rakija.style.left = `${Math.random() * (window.innerWidth - 30) - 25}px`;
    let rakijaY = "0";
    rakija.style.top = `${rakijaY}px`;
    document.body.appendChild(rakija);
    let interval = setInterval(() => {
        rakija.style.top = `${rakijaY++}px`;
        if (rakija > window.innerHeight) {
            clearInterval(interval);
            rakija.remove();
            kebabs.value = kebabs.value.filter((k) => k !== kebab);
            kebabIntervals.value = kebabIntervals.value.filter(
                (k) => k !== interval
            );
        }
    }, 5);
    intervals.value.push(interval);
    rakijaIntervals.value.push(interval);
}

function play() {
    ready.value = !ready.value;
    score.value = 0;
    lives.value = 3;
    if (ready.value) {
        bit.value.play();
        original.value.pause();
    } else {
        bit.value.pause();
        original.value.play();
    }
    let createKebabsInterval = setInterval(createKebab, 1000);
    intervals.value.push(createKebabsInterval);
    setGoFastTimeout();
    checkHighScore();
    addLife();
    inner2.value.style.width = `${lives.value * 10}%`;
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
    kebabs.value.forEach((k) => k.remove());
    kebabs.value = [];
    intervals.value.forEach((i) => clearInterval(i));
    intervals.value = [];
    bullets.value.forEach((b) => b.remove());
    bullets.value = [];
    clearTimeout(goFastTimeout);
    inner.value.classList.remove("animate");
    checkHighScore();
    clearTimeout(lifeTimeout.value);
    //clear rakijas
    rakijaIntervals.value.forEach((i) => clearInterval(i));
    rakijaIntervals.value = [];
    rakijas.value.forEach((r) => r.remove());
}

function shot(button) {
    if (!ready.value) return;
    if (button === "right" && !canGoFast.value) return;
    const { clientX, clientY } = event;
    const x = player.value.offsetLeft;
    const y = player.value.offsetTop;

    const bullet = document.createElement("div");
    bullets.value.push(bullet);
    setBulletSize(bullet);
    bullet.classList.add("bullet");

    let canPenetrate = canGoFast.value && button === "right";
    let speed = setBulletSpeed(button, bullet);

    bullet.style.left = `${x}px`;
    let bulletY = 90;
    function setBulletY() {
        let newBulletY = bulletY + speed;
        return newBulletY;
    }

    bullet.style.bottom = `${bulletY}px`;
    document.body.appendChild(bullet);
    let interval = setInterval(() => {
        bullet.style.bottom = `${bulletY}px`;
        bulletY = setBulletY();
        kebabs.value.forEach((k, index) => {
            let kebabRect = k.getBoundingClientRect();
            let bulletRect = bullet.getBoundingClientRect();
            if (
                Math.abs(kebabRect.top - bulletRect.top) > 20 ||
                Math.abs(kebabRect.left - bulletRect.left) >
                    bulletSize.value + 20
            )
                return;
            if (!canPenetrate) {
                clearInterval(interval);
                intervals.value = intervals.value.filter((i) => i !== interval);
                bullets.value = bullets.value.filter((b) => b !== bullet);
                bullet.remove();
            }
            k.remove();
            clearInterval(kebabIntervals.value[index]);
            kebabs.value = kebabs.value.filter((k) => k.element !== k);
            score.value += 1;
        });
        intervals.value.push(interval);
        if (bulletY > window.innerHeight) {
            clearInterval(interval);
            intervals.value = intervals.value.filter((i) => i !== interval);
            bullet.remove();
        }
    }, 20);
}

watch(score, () => {
    if (score.value === 0) return;
    if (score.value % 20 === 0) {
        bulletSize.value = 50;
        remingBigBullet.value = 3;
    }
    if (score.value % 100 === 0) {
        bulletSize.value = 100;
        remingBigBullet.value = 8;
    }
});

watch(lives, () => {
    if (lives.value === 0) {
        pause();
    }
    inner2.value.style.width = `${lives.value * 10}%`;
});
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

.smallBullet {
    width: 20px;
    height: 20px;
    background: red;
}

.biggerBullet {
    width: 50px;
    height: 50px;
    background: blue;
}

.biggestBullet {
    width: 100px;
    height: 100px;
    background: rgb(0, 0, 0);
}

.bullet {
    position: absolute;
    border-radius: 50%;
    animation: bullet 1s linear;
    border: 5px solid white;
}

.fast {
    background: green;
}

.goFast {
    width: 200px;
    height: 20px;
    background: rgb(0, 0, 0);
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 10px;
}
.goFast .inner {
    width: 0;
    height: 100%;
    background: rgb(0, 255, 0);
    border-radius: 10px;
}

.inner.animate {
    animation: goFast 5s linear forwards;
}

@keyframes goFast {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

.rakija {
    width: 125px;
    height: 125x;
    position: absolute;
}

.life {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 200px;
    position: relative;
}
.life img {
    width: 50px;
    height: 50px;
    z-index: 2;
}
.lifeBar {
    width: 180px;
    height: 30px;
    position: absolute;
    background: rgba(0, 0, 0, 0.948);
    border-radius: 20px;
    left: 20px;
    top: 15px;
}

.lifeBar .inner2 {
    width: 0px;
    height: 30px;
    background: rgb(106, 161, 255);
    border-radius: 20px;
}
</style>
