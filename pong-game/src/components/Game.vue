<template>
    <div ref="container" class="game-container">
        <div ref="left" id="left"></div>
        <div ref="right" id="right"></div>
        <div ref="ball" id="ball"></div>
        <div class="score">
            <div class="leftScore">{{ leftScore }}</div>
            <div>:</div>
            <div class="right">{{ rightScore }}</div>
        </div>
        <div class="mouseEnabler">
            <button @click="enableMouse">
                {{ mouseEnabled ? "Disable" : "Enable" }} Mouse (press space)
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const left = ref(null);
const right = ref(null);
const container = ref(null);

let moveLeftInterval = ref(0);
let moveRightInterval = ref(0);

let ball = ref(null);
let leftScore = ref(0);
let rightScore = ref(0);
const speed = ref(10);
const paddleSpeed = ref(10);
const lastKey = ref("");
const mouseEnabled = ref(false);

let ballDirection = ref({
    x: 0,
    y: 0,
});

const enableMouse = () => {
    mouseEnabled.value = !mouseEnabled.value;
    if (mouseEnabled.value) {
        document.addEventListener("mousemove", mouseMove);
    } else {
        document.removeEventListener("mousemove", mouseMove);
    }
    //hide poiner if is enabled mouse
    container.value.style.cursor = mouseEnabled.value ? "none" : "auto";
};

const mouseMove = (e) => {
    if (!mouseEnabled.value) return;
    if (e.clientY < 0) {
        left.value.style.top = 0;
        return;
    }
    if (
        e.clientY + left.value.offsetHeight >
        left.value.parentElement.offsetHeight
    ) {
        left.value.style.bottom = 0;
        return;
    }
    left.value.style.top = e.clientY + "px";
};

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
        speed.value = 10;
        restartBall();
        return;
    }
    // check if go right, add score to right
    if (
        ball.value.offsetLeft + ball.value.offsetWidth >
        ball.value.parentElement.offsetWidth
    ) {
        leftScore.value++;
        speed.value = 10;
        restartBall();
        return;
    }

    // check if hit left paddle
    if (
        ball.value.offsetLeft <
            left.value.offsetLeft + left.value.offsetWidth &&
        ball.value.offsetLeft + ball.value.offsetWidth >
            left.value.offsetLeft &&
        ball.value.offsetTop < left.value.offsetTop + left.value.offsetHeight &&
        ball.value.offsetTop + ball.value.offsetHeight > left.value.offsetTop
    ) {
        ballDirection.value.x = -ballDirection.value.x;
        speed.value += 1;
    }

    // check if hit right paddle
    if (
        ball.value.offsetLeft <
            right.value.offsetLeft + right.value.offsetWidth &&
        ball.value.offsetLeft + ball.value.offsetWidth >
            right.value.offsetLeft &&
        ball.value.offsetTop <
            right.value.offsetTop + right.value.offsetHeight &&
        ball.value.offsetTop + ball.value.offsetHeight > right.value.offsetTop
    ) {
        ballDirection.value.x = -ballDirection.value.x;
        speed.value += 1;
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
            }, paddleSpeed.value);
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
            }, paddleSpeed.value);
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
            }, paddleSpeed.value);
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
            }, paddleSpeed.value);
            break;
    }
};

watch(speed, (val) => {
    console.log(val);
});

onMounted(() => {
    const randomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    document.addEventListener("keydown", move);
    document.addEventListener("keyup", stop);
    document.addEventListener("keypress", (e) => {
        console.log(e.keyCode);
        if (e.keyCode == 32) {
            enableMouse();
        }
    });
    restartBall();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");
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

.score {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-size: 2rem;
    font-family: "Inter", sans-serif;
}

.mouseEnabler {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
.mouseEnabler button {
    border: none;
    background-color: black;
    color: white;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    outline: none;
    font-size: 1rem;
    padding: 10px 20px;
}
</style>
