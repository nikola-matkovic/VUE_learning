<template>
    <div>Persos is {{ isAdult ? "" : "Not" }} Adult</div>
    <button @click="changeName">Change name</button>
    <p>{{ fullName }}</p>
</template>

<script setup>
import { computed, ref } from "vue";

const person = ref({
    name: "Nikola",
    surname: "Matković",
    age: 20,
});

const firstName = ref("Jovana");
const lastName = ref("Jovanović");

const fullName = computed({
    get() {
        return firstName.value + " " + lastName.value;
    },
    set(newValue) {
        [firstName.value, lastName.value] = newValue.split(" ");
    },
});

const isAdult = computed(() => {
    return person.value.age >= 18;
});

function changeName() {
    fullName.value = "Jovana Matković";
}
</script>

<style scoped></style>
