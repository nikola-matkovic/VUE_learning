<template>
    <div id="background" :class="{playing: isPlaying}">
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

<script>

import { ref, onMounted, watch } from "vue";
import kebabsImage from "../assets/kebab.webp";
import rakijaImg from "../assets/sljiva.webp";


// Ref DOM elements

const player = ref(null);
const music8bit = ref(null);
const musicOriginal = ref(null);
const progressBar = ref(null);
const progressBarInner = ref(null);

// Status variables
const isMainMenu = ref(null)
const isPaused = ref(null)
const isOver = ref(null)
const isPlaying = ref(true)


// Other variables
const score = ref(0);
const highScore = ref(0);
const lives = ref(3);

// Bullet metrics
const bulletSize = ref(null);
const canGoSuper = ref(null);
const cansShot = ref(null)
const remainingBigBullet = ref(null);

// Kebab Metrics

const createKebabsInterval = ref(null);
const speedOfKebabs = ref(1000);
const removedKebabs = ref([]);

// Arrays
const bullets = ref([]);
const kebabs = ref([]);
const rakijas = ref([]);

const bulletIntervals = ref([]);
const kebabIntervals = ref([]);
const rakijaIntervals = ref([]);

</script>


<style>
#background{
    height: 100vh;
    width: 100vw;
    background: url("../assets/background.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;

    &.playing game{
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
    }
}

#game {
    width: 100%;
    height: 100%;
    position: relative;
}

</style>