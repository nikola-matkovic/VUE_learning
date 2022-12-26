<script setup>
import Converter from "./components/Converter.vue";
</script>

<template>
    <Converter />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: inherit;
}

body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Poppins, sans-serif;
}
</style>
