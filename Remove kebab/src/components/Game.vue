<template>
    <div id="background">
        <div id="game"  @click="shot('primary')" @contextmenu.prevent="shot('super')" @mousemove="movePlayer">
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
            <div class="goFast">
                <div class="inner" ref="inner"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import kebabsImage from "../assets/kebab.webp";
import rakijaImg from "../assets/sljiva.webp";

/* ================== KONFIGURACIJA IGRE ================== */
const PLAYER_HITBOX_X = 100;
const PLAYER_HITBOX_Y = 150;

const BULLET_HITBOX_X = 20;
const BULLET_HITBOX_Y = 20;

const BULLET_DEFAULT_SIZE = 20;
const BULLET_MEDIUM_SIZE = 50;
const BULLET_BIG_SIZE = 100;

const BULLET_MEDIUM_TRIGGER = 20;   // score % 20
const BULLET_BIG_TRIGGER = 50;     // score % 100

const BULLET_MEDIUM_AMMO = 5;
const BULLET_BIG_AMMO = 10;

const BULLET_DEFAULT_SPEED = 5;
const BULLET_FAST_SPEED = 10;

const BULLET_COOLDOWN = 250; // ms

const kebab_FALL_INTERVAL = 5;   // ms tick za pad kebaba
const RAKIJA_FALL_INTERVAL = 5;  // ms tick za pad rakije

const INITIAL_LIVES = 5;
const MAX_LIVES = 10;

const LIFE_WIDTH_MULTIPLIER = 10; // % širine bara po životu

const Kebab_INTERVAL = 1000;  // ms spawn kebaba
const RAKIJA_INTERVAL_RANDOM = 60000; // max random ms za spawn rakije

const GO_FAST_DELAY = 1000; // ms do aktivacije super moda
const SUPER_MODE_RECOVERY = 1000; // ms animacija vraćanja

/* ================== STANJE IGRE ================== */
const player = ref(null);
const bit = ref(null);
const original = ref(null);
const inner = ref(null);
const inner2 = ref(null);

const score = ref(0);
const highScore = ref(0);
const lives = ref(3);
const bulletSize = ref(BULLET_DEFAULT_SIZE);
const ready = ref(false);
const kebabs = ref([]);
const rakijas = ref([]);
const remainingBigBullet = ref(20);
const bullets = ref([]);
const canGoFast = ref(false);
const cansShot = ref(true)

const kebabIntervals = ref([]);
const rakijaIntervals = ref([]);
const lifeTimeout = ref(null);
const createKebabsInterval = ref(null);
const speedOfKebabs = ref(Kebab_INTERVAL);


onMounted(() => {

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "Digit4") {
            shot("primary");
        }
        if (e.code === "KeyS") {
            shot("super")
        }
    });
    const highScoreFromStorage = localStorage.getItem("highScore");
    if (highScoreFromStorage) {
        highScore.value = highScoreFromStorage;
    }
});

let goFastTimeout = null;

function setBulletSize(bullet) {
    if (remainingBigBullet.value > 0) {
        remainingBigBullet.value--;
    } else {
        bulletSize.value = BULLET_DEFAULT_SIZE;
    }

    if (bulletSize.value === BULLET_DEFAULT_SIZE) {
        bullet.className = "smallBullet";
    }
    if (bulletSize.value === BULLET_MEDIUM_SIZE) {
        bullet.className = "biggerBullet";
    }
    if (bulletSize.value === BULLET_BIG_SIZE) {
        bullet.className = "biggestBullet";
    }
}

function setBulletSpeed(button, bullet) {
    let speed = BULLET_DEFAULT_SPEED;
    if (button === "super" && canGoFast.value) {

        bullet.classList.add("fast");
        inner.value.classList.remove("animate");
        setTimeout(() => {
            clearTimeout(goFastTimeout);
            setGoFastTimeout();
            inner.value.classList.add("animate");
        }, SUPER_MODE_RECOVERY);
        speed = BULLET_FAST_SPEED;
    }
    return speed;
}

function addLife() {
    lifeTimeout.value = setTimeout(() => {
        createRakija();
        clearTimeout(lifeTimeout.value);
        addLife();
    }, Math.random() * RAKIJA_INTERVAL_RANDOM);
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
            Math.abs(rakijaRect.top - playerRect.top) > PLAYER_HITBOX_Y ||
            Math.abs(rakijaRect.left - playerRect.left) > PLAYER_HITBOX_X
        )
            return;

        rakija.remove();
        if (lives.value < MAX_LIVES) lives.value += 1;
        rakijas.value = rakijas.value.filter((r) => r !== rakija);
    });
}

function setGoFastTimeout() {
    inner.value.classList.add("animate");
    goFastTimeout = setTimeout(() => {
        canGoFast.value = true;
    }, GO_FAST_DELAY);
}

function createKebab() {
    if (!ready.value) return;
    const kebab = document.createElement("img");
    kebab.classList.add("kebabs");
    kebab.src = `${kebabsImage}`;
    kebab.style.left = `${Math.random() * (window.innerWidth - 30) - 25}px`;
    let kebabY = 0;
    kebab.style.top = `${kebabY}px`;
    document.body.appendChild(kebab);

    const kebabData = {
        id: Date.now() + Math.random(), // Jedinstveni ID
        element: kebab,
        intervalId: null
    };

    const interval = setInterval(() => {
        kebabY++;
        kebab.style.top = `${kebabY}px`;
        if (kebabY > window.innerHeight) {
            clearInterval(interval);
            kebab.remove();
            lives.value -= 1;
            kebabs.value = kebabs.value.filter((k) => k.id !== kebabData.id);
        }
    }, kebab_FALL_INTERVAL);

    kebabData.intervalId = interval;
    kebabs.value.push(kebabData);
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
    }, RAKIJA_FALL_INTERVAL);
    rakijaIntervals.value.push(interval);
}


function pause(){
    alert("Fine, You paused, but you can't just pause like that in real war!")
}

function play() {
    ready.value = !ready.value;
    score.value = 0;
    lives.value = INITIAL_LIVES;
    if (ready.value) {
        bit.value.play();
        original.value.pause();
    }
    createKebabsInterval.value = setInterval(createKebab, Kebab_INTERVAL);
    setGoFastTimeout();
    checkHighScore();
    addLife();
    inner2.value.style.width = `${lives.value * LIFE_WIDTH_MULTIPLIER}%`;
}


// Primary mode - normal 
// Supper - bullets can penetrate more then one kebab
function moveBullet(bullet, currentY, speed) {

    let newBulletY = currentY + speed;
    bullet.style.bottom = newBulletY + "px"

    bullet.style.bottom = `${newBulletY}px`;

    return newBulletY
}

function drawBulletToScreen(mode) {

    cansShot.value = false;
    const x = player.value.offsetLeft;

    const bullet = document.createElement("div");
    bullets.value.push(bullet);
    setBulletSize(bullet);
    bullet.classList.add("bullet");
    let speed = setBulletSpeed(mode, bullet);

    bullet.style.left = `${x}px`;
    let bulletY = 90;

    bullet.style.bottom = `${bulletY}px`;
    document.body.appendChild(bullet);

    return {
        bullet,
        bulletY,
        speed,
    }

}

function checkForKebabCoalition(bullet, interval, canPenetrate) {
    const bulletRect = bullet.getBoundingClientRect();

    const kebabsToRemove = [];

    for (const kebab of kebabs.value) {
        const kebabRect = kebab.element.getBoundingClientRect();

        if (
            Math.abs(kebabRect.top - bulletRect.top) > 50 ||
            Math.abs(kebabRect.left - bulletRect.left) > bulletSize.value + BULLET_HITBOX_X
        ) {
            continue;
        }

        if (
            bulletRect.left < kebabRect.right &&
            bulletRect.right > kebabRect.left &&
            bulletRect.top < kebabRect.bottom &&
            bulletRect.bottom > kebabRect.top
        ) {
            kebabsToRemove.push(kebab);

            if (!canPenetrate) {
                clearInterval(interval);
                bullet.remove();
                bullets.value = bullets.value.filter((b) => b !== bullet);
                break; 
            }
        }
    }

    if (kebabsToRemove.length > 0) {
        for (const kebab of kebabsToRemove) {
            score.value += 1;
            kebab.element.remove();
            clearInterval(kebab.intervalId);
        }

        const idsToRemove = new Set(kebabsToRemove.map(k => k.id));
        kebabs.value = kebabs.value.filter(k => !idsToRemove.has(k.id));
    }
}

function setBulletInterval(bullet, bulletY, canPenetrate, speed) {

    let interval = setInterval(() => {
        bulletY = moveBullet(bullet, bulletY, speed);
        bullet.style.bottom = `${bulletY}px`; 

        checkForKebabCoalition(bullet, interval, canPenetrate);

        if (bulletY > window.innerHeight) {
            clearInterval(interval);
            bullet.remove();
        }
    }, 20);

}

function shot(mode = "primary") {
    if (!ready.value) return;

    if (!cansShot.value) return;

    if (!["primary", "super"].includes(mode)) return
    if (mode === "super" && !canGoFast.value) return;

    const { bullet, bulletY, speed } = drawBulletToScreen(mode);

    let canPenetrate = canGoFast.value && mode === "super";


    setBulletInterval(bullet, bulletY, canPenetrate, speed)

    if (canPenetrate) canGoFast.value = false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

watch(score, () => {
    if (score.value === 0) return;
    if (score.value % BULLET_MEDIUM_TRIGGER === 0) {
        bulletSize.value = BULLET_MEDIUM_SIZE;
        remainingBigBullet.value = BULLET_MEDIUM_AMMO;
    }
    if (score.value % BULLET_BIG_TRIGGER === 0) {
        bulletSize.value = BULLET_BIG_SIZE;
        remainingBigBullet.value = BULLET_BIG_AMMO;
    }
});

watch(cansShot, async (newValue, oldValue) => {
    if (newValue === false) {
        await sleep(BULLET_COOLDOWN);
        cansShot.value = true
    }
})

watch(lives, () => {
    if (lives.value === 0) {
        checkHighScore();
        alert("Game is Over, but who am i to tell you to stop war crimes? Continue as long as you want");
        bit.value.pause();
        original.value.play();
    }
    inner2.value.style.width = `${lives.value * LIFE_WIDTH_MULTIPLIER}%`;
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

#background{
    height: 100vh;
    width: 100vw;
    background: url("../assets/background.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
}

#game {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;
    backdrop-filter: blur(10px);
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
    animation: goFast 1s linear forwards;
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
