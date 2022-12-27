<template>
    <div>Persos is {{ isAdult ? "" : "Not" }} Adult</div>
</template>

<script setup>
import { computed, ref } from "vue";

const person = ref({
    name: "Nikola",
    surname: "Matković",
    age: 20,
});

const isAdult = computed(() => {
    return person.value.age >= 18;
});
</script>

<style scoped></style>
