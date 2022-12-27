<template>
    <form @submit.prevent="hello">
        <input v-model="text" type="text" placeholder="your name" />
        <button>Send</button>
    </form>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");

const hello = () => {
    alert("Hello " + text.value);
};
</script>

<style scoped>
form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 40px;
}
input {
    width: 300px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid black;
    margin: 10px;
}
button {
    width: 300px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid black;
    margin: 10px;
}
</style>
