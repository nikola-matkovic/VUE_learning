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

const jump = () => {
    //allow to jump only once
    if (jumpTimeout.value) {
        return;
    }
    player.value.classList.add("jump");
    jumpTimeout.value = setTimeout(() => {
        player.value.classList.remove("jump");
        jumpTimeout.value = null;
    }, 1500);
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
            x -= 10;
            enemy.style.left = `${x}px`;
        }
    }, 100);
};

onMounted(() => {
    // add event listener for keydown event for jumping
    window.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "arrowup") {
            jump();
        }
    });
    createEnemy();
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
    animation: jump 1.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
}

@keyframes jump {
    0% {
        transform: translateY(0);
    }
    10% {
        transform: translateY(-40px);
    }
    20% {
        transform: translateY(-70px);
    }
    50% {
        transform: translateY(-100px);
    }
    80% {
        transform: translateY(-70px);
    }
    90% {
        transform: translateY(-40px);
    }
    100% {
        transform: translateY(0);
    }
}

#game .enemy {
    bottom: 140px;
    width: 60px;
    height: 60px;
    background-color: #000;
    position: absolute;
    bottom: 140px;
}
</style>
