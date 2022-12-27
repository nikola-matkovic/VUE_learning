<template>
    <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum,
        incidunt.
    </div>
</template>

<script setup>
import { ref } from "vue";

const redText = ref(true);
const blackBackground = ref(false);
</script>

<style scoped>
.big-font {
    font-size: 2rem;
}
.redText {
    color: red;
}
.blackBackground {
    background-color: black;
}
</style>
