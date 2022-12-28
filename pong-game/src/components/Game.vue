<template>
    <div class="game-container">
        <div id="left"></div>
        <div id="right"></div>
    </div>
</template>

<script setup></script>

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
}
</style>
