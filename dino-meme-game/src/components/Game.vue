<template>
    <div id="game">
        <div id="land"></div>
        <img :class="imageClass" :src="image" id="player" ref="player" />
        <audio ref="audioEl" :src="audio" loop></audio>
        <audio ref="slapAudio" :src="slap"></audio>
        <audio ref="explosionAudio" :src="explosion"></audio>
        <img ref="bge1" :src="background" id="background1" />
        <img class="full" v-if="burekHit" :src="burekFull" id="burek" />
        <img class="full" v-if="mineHit" :src="mineFull" id="mine" />
        <div ref="scoreElement">Score: {{ score }}</div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import audio from "../assets/crna-dvojka.mp3";
import imageDown from "../assets/dvojka.png";
import imageUp1 from "../assets/omco1.png";
import imageUp2 from "../assets/omco2.png";
import mine from "../assets/mine.webp";
import burek_sa_sirom from "../assets/burek_sa_sirom.png";
import background from "../assets/background.jpg";
import burekFull from "../assets/burek_full.jpg";
import mineFull from "../assets/mine_full.gif";
import slap from "../assets/slap.mp3";
import explosion from "../assets/explosion.mp3";

const slapAudio = ref(null);
const explosionAudio = ref(null);
const player = ref(null);
const audioEl = ref(null);
const scoreElement = ref(0);
const bge1 = ref(null);
const bge2 = ref(null);
const bgx = ref(0);

const score = ref(0);
let jumpTimeout = ref(null);
let createEnemyTimeout = ref(null);
let scoreInterval = ref(null);
let isDonw = ref(false);

let burekHit = ref(false);
let mineHit = ref(false);

const gameOver = ref(false);
const firstTime = ref(true);
const enemies = ref([]);

const jump = () => {
    //allow to jump only once
    if (jumpTimeout.value || gameOver.value || isDonw.value) {
        return;
    }
    player.value.classList.add("jump");
    jumpTimeout.value = setTimeout(() => {
        player.value.classList.remove("jump");
        jumpTimeout.value = null;
    }, 1000);
};

const goDown = () => {
    if (jumpTimeout.value || isDonw.value || gameOver.value) {
        return;
    }
    isDonw.value = true;
    player.value.classList.add("down");
};

const removeDown = () => {
    player.value.classList.remove("down");
    isDonw.value = false;
};

const restart = () => {
    gameOver.value = false;
    firstTime.value = true;
    enemies.value.forEach((e) => {
        e.remove();
    });
    enemies.value = [];
    burekHit.value = false;
    mineHit.value = false;
    score.value = 0;
};

const createEnemy = () => {
    if (createEnemyTimeout.value) {
        clearTimeout(createEnemyTimeout.value);
    }
    const enemy = document.createElement("img");
    enemies.value.push(enemy);
    enemy.classList.add("enemy");
    enemy.style.left = "800px";
    let enemyType = Math.floor(Math.random() * 2);
    if (enemyType === 0) {
        enemy.style.bottom = "150px";
        enemy.src = burek_sa_sirom;
        enemy.classList.add("burek");
    } else {
        enemy.src = mine;
        enemy.style.width = "45px";
        enemy.style.height = "20px";
        enemy.classList.add("mine");
    }
    document.getElementById("game").appendChild(enemy);
    let moveEnemy = setInterval(() => {
        let x = parseInt(enemy.style.left);
        if (x < -60) {
            enemies.value = enemies.value.filter((e) => e !== enemy);
            enemy.remove();
            clearInterval(moveEnemy);
        } else {
            let playerRect = player.value.getBoundingClientRect();
            let { left, top, bottom, right } = playerRect;
            enemies.value.forEach((e) => {
                let enemyRect = e.getBoundingClientRect();
                let {
                    left: eLeft,
                    top: eTop,
                    bottom: eBottom,
                    right: eRight,
                } = enemyRect;
                if (
                    (left < eRight &&
                        right > eLeft &&
                        top < eBottom &&
                        bottom > eTop) ||
                    (left < eRight &&
                        right > eLeft &&
                        top < eBottom &&
                        bottom > eTop)
                ) {
                    if (e.classList.contains("burek")) {
                        burekHit.value = true;
                        slapAudio.value.play();
                    } else {
                        mineHit.value = true;
                        explosionAudio.value.play();
                    }
                    clearInterval(moveEnemy);
                    setTimeout(() => {
                        gameOver.value = true;
                    }, 1000);
                    return;
                }
            });
            x -= 5;
            enemy.style.left = `${x}px`;
        }
    }, 25);
    if (gameOver.value) {
        clearInterval(moveEnemy);
        clearTimeout(createEnemyTimeout.value);
        createEnemyTimeout.value = null;
        return;
    } else {
        let min = 1000;
        let max = 3000;
        let time = Math.floor(Math.random() * (max - min + 1)) + min;
        createEnemyTimeout.value = setTimeout(createEnemy, time);
    }
};

onMounted(() => {
    window.addEventListener("keydown", (e) => {
        audioEl.value.play();
        if (e.key === " " || e.key === "ArrowUp") {
            jump();
            if (firstTime.value) {
                createEnemyTimeout.value = setTimeout(createEnemy, 1000); //start the game
                firstTime.value = false;
            }
            return;
        }
        if (e.key === "r") {
            restart();
            return;
        }
        if (e.key === "ArrowDown" || e.key === "s") {
            goDown();
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowDown" || e.key === "s") {
            removeDown();
        }
    });
    scoreInterval.value = setInterval(() => {
        score.value++;
    }, 1000);
});

watch(gameOver, (val) => {
    console.log(val);
    if (val) {
        // alert("Game Over");
        restart();
    }
});

const imageClass = computed(() => {
    if (isDonw.value) {
        return "golf";
    }
    if (jumpTimeout.value) {
        return "omco1 jump";
    }
    return "omco2";
});

const image = computed(() =>
    isDonw.value ? imageDown : jumpTimeout.value ? imageUp2 : imageUp1
);
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
    padding: 20px;
}

#game {
    border: 1px solid #000;
    width: 800px;
    height: 600px;
    position: relative;
    background-size: cover;
    background-position: 0 0;
}

#land {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0px;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 128, 0, 0.783),
        rgb(124, 35, 19)
    );
}
#player {
    position: absolute;
    bottom: 50px;
    left: 50px;
    display: block;
}
.omco1 {
    height: 150px;
    width: 75px;
}
.omco2 {
    height: 150px;
    width: 75px;
}
.golf {
    height: 50px;
    width: auto;
}

.jump {
    animation: jump 1s linear;
}

@keyframes jump {
    0% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0.33333, 0.66667, 0.66667, 1);
    }
    50% {
        transform: translateY(-125px);
        animation-timing-function: cubic-bezier(0.33333, 0, 0.66667, 0.33333);
    }
    100% {
        transform: translateY(0);
    }
}

#game .enemy {
    width: 70px;
    height: 35px;
    position: absolute;
    bottom: 45px;
}

#game #player.down {
    height: 50px;
}

* {
    overflow: hidden;
}

#background1 {
    height: 100% !important;
    position: absolute;
    z-index: -1;
}
.full {
    width: 100%;
    height: 100%;
}
</style>
