<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <nav>
        <RouterLink to="/vbind">V-bind</RouterLink>
        <RouterLink to="/modifilers">Modifiers</RouterLink>
    </nav>
    <RouterView />
</template>

<style scoped></style>
