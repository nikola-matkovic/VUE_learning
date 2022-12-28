<template>
    <div class="game-container">
        <div ref="left" id="left"></div>
        <div ref="right" id="right"></div>
        <div ref="ball" id="ball"></div>
        <div class="score">
            <div class="leftScore">{{ leftScore }}</div>
            <div class="right">{{ rightScore }}</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const left = ref(null);
const right = ref(null);

let moveLeftInterval = ref(0);
let moveRightInterval = ref(0);

let ball = ref(null);
let leftScore = ref(0);
let rightScore = ref(0);

let ballDirection = ref({
    x: 0,
    y: 0,
});

const restartBall = () => {
    ball.value.style.left = "calc(50% - 5px)";
    ball.value.style.top = "calc(50% - 5px)";

    const randomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    ballDirection.value = {
        x: 0,
        y: 0,
    };
    while (ballDirection.value.x <= 0.2 && ballDirection.value.x >= -0.2) {
        const heading = randomNumberBetween(0, 2 * Math.PI);
        ballDirection.value = {
            x: Math.cos(heading),
            y: Math.sin(heading),
        };
    }
    startBall();
};

const speed = ref(10);
const lastKey = ref("");

const startBall = () => {
    let x = ball.value.offsetLeft;
    let y = ball.value.offsetTop;
    ball.value.style.left = x + ballDirection.value.x * speed.value + "px";
    ball.value.style.top = y + ballDirection.value.y * speed.value + "px";
    if (ball.value.offsetTop < 0) {
        ballDirection.value.y = -ballDirection.value.y;
    }
    if (
        ball.value.offsetTop + ball.value.offsetHeight >
        ball.value.parentElement.offsetHeight
    ) {
        ballDirection.value.y = -ballDirection.value.y;
    }
    // check if go left, add score to left
    if (ball.value.offsetLeft < 0) {
        rightScore.value++;
        restartBall();
        return;
    }
    // check if go right, add score to right
    if (
        ball.value.offsetLeft + ball.value.offsetWidth >
        ball.value.parentElement.offsetWidth
    ) {
        leftScore.value++;
        restartBall();
        return;
    }

    setTimeout(startBall, 30);
};

const stop = (e) => {
    let key = e?.key || lastKey.value;
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
                if (right.value.offsetTop < 0) {
                    right.value.style.top = 0;
                    stop();
                    return;
                }
                right.value.style.top = right.value.offsetTop - 5 + "px";
            }, 20);
            break;
        case "ArrowDown":
            if (moveRightInterval.value) clearInterval(moveRightInterval.value);
            moveRightInterval.value = setInterval(() => {
                if (
                    right.value.offsetTop + right.value.offsetHeight >
                    right.value.parentElement.offsetHeight
                ) {
                    right.value.style.bottom = 0;
                    stop();
                    return;
                }
                right.value.style.top = right.value.offsetTop + 5 + "px";
            }, 20);
            break;
        case "w":
            if (moveLeftInterval.value) clearInterval(moveLeftInterval.value);
            moveLeftInterval.value = setInterval(() => {
                if (left.value.offsetTop < 0) {
                    left.value.style.top = 0;
                    stop();
                    return;
                }
                left.value.style.top = left.value.offsetTop - 5 + "px";
            }, 20);
            break;
        case "s":
            if (moveLeftInterval.value) clearInterval(moveLeftInterval.value);
            moveLeftInterval.value = setInterval(() => {
                if (
                    left.value.offsetTop + left.value.offsetHeight >
                    left.value.parentElement.offsetHeight
                ) {
                    left.value.style.bottom = 0;
                    stop();
                    return;
                }
                left.value.style.top = left.value.offsetTop + 5 + "px";
            }, 20);
            break;
    }
};

onMounted(() => {
    const randomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    document.addEventListener("keydown", move);
    document.addEventListener("keyup", stop);
    restartBall();
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
    overflow: hidden;
}

#left {
    background: red;
    width: 20px;
    height: 100px;
    position: absolute;
    left: 10px;
    top: calc(50% - 50px);
}

#right {
    background: blue;
    width: 20px;
    height: 100px;
    position: absolute;
    right: 10px;
    top: calc(50% - 50px);
}

#ball {
    width: 10px;
    aspect-ratio: 1;
    background-color: white;
    position: absolute;
    top: calc(50% - 5px);
    left: calc(50% - 5px);
}
</style>
