<template>
    <div class="big-font" :class="{ red: redText, blackBG: blackBackground }">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum,
        incidunt.
    </div>
    <div :class="[red, big]">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum,
        incidunt.
    </div>
</template>

<script setup>
import { ref } from "vue";

const redText = ref(true);
const blackBackground = ref(true);

const red = "red";
const big = "big-font";
</script>

<style scoped>
.big-font {
    font-size: 2rem;
}
.red {
    color: red;
}
.blackBG {
    background-color: black;
}
</style>
