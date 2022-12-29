<template>
    <div id="game">
        <div id="land"></div>
        <div id="player" ref="player"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const player = ref(null);
let jumpTimeout = ref(null);
const gameOver = ref(false);
const firstTime = ref(true);

const jump = () => {
    //allow to jump only once
    if (jumpTimeout.value) {
        return;
    }
    player.value.classList.add("jump");
    jumpTimeout.value = setTimeout(() => {
        player.value.classList.remove("jump");
        jumpTimeout.value = null;
    }, 1000);
};

const createEnemy = () => {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = "800px";
    document.getElementById("game").appendChild(enemy);
    let moveEnemy = setInterval(() => {
        let x = parseInt(enemy.style.left);
        if (x < -60) {
            enemy.remove();
            clearInterval(moveEnemy);
        } else {
            x -= 5;
            enemy.style.left = `${x}px`;
        }
    }, 25);
    if (gameOver.value) {
        clearInterval(moveEnemy);
        return;
    }
    setTimeout(createEnemy, 2000);
};

onMounted(() => {
    // add event listener for keydown event for jumping
    window.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "arrowup") {
            jump();
            if (firstTime.value) {
                createEnemy();
                firstTime.value = false;
            }
        }
    });
});
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
    bottom: 140px;
    width: 50px;
    height: 20px;
    background-color: rgb(175, 0, 0);
    position: absolute;
    bottom: 130px;
}
</style>
