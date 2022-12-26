<script setup>
import { ref } from "vue";

const text = ref("");

function onInput(e) {
    text.value = e.target.value;
}
</script>

<template>
    <input v-model="text" placeholder="Type here" />
    <p>{{ text }}</p>
</template>
