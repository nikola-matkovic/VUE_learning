<template>
    <div class="game-container">
        <div ref="left" id="left"></div>
        <div ref="right" id="right"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const left = ref(null);
const right = ref(null);

let moveLeftInterval = ref(0);
let moveRightInterval = ref(0);
const lastKey = ref("");

const stop = (e) => {
    let key = e.key;
    lastKey.value = "";
    switch (key) {
        case "ArrowUp":
        case "ArrowDown":
            clearInterval(moveRightInterval.value);
            break;
        case "w":
        case "s":
            clearInterval(moveLeftInterval.value);
            break;
    }
};

const move = (e) => {
    let key = e.key;
    if (key === lastKey.value) return;
    lastKey.value = key;
    switch (key) {
        case "ArrowUp":
            if (moveRightInterval.value) clearInterval(moveRightInterval.value);
            moveRightInterval.value = setInterval(() => {
                right.value.style.top = right.value.offsetTop - 5 + "px";
            }, 20);
            break;
        case "ArrowDown":
            if (moveRightInterval.value) clearInterval(moveRightInterval.value);
            moveRightInterval.value = setInterval(() => {
                right.value.style.top = right.value.offsetTop + 5 + "px";
            }, 20);
            break;
        case "w":
            if (moveLeftInterval.value) clearInterval(moveLeftInterval.value);
            moveLeftInterval.value = setInterval(() => {
                left.value.style.top = left.value.offsetTop - 5 + "px";
            }, 20);
            break;
        case "s":
            if (moveLeftInterval.value) clearInterval(moveLeftInterval.value);
            moveLeftInterval.value = setInterval(() => {
                left.value.style.top = left.value.offsetTop + 5 + "px";
            }, 20);
            break;
    }
};

onMounted(() => {
    document.addEventListener("keydown", move);
    document.addEventListener("keyup", stop);
});
</script>

<style>
body,
#app {
    display: flex;
    justify-content: center;
    align-items: center;
}
.game-container {
    width: 95vmin;
    height: 95vmin;
    background-color: #100101;
    position: relative;
}

#left {
    background: red;
    width: 20px;
    height: 100px;
    position: absolute;
    left: 10px;
    top: 0;
    top: 50%;
    transform: translate(0, -50%);
}

#right {
    background: blue;
    width: 20px;
    height: 100px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
}
</style>
