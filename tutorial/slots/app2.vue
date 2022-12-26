<script setup>
import { ref } from "vue";
import ChildComp from "./ChildComp.vue";

const msg = ref("from parent");
</script>

<template>
    <ChildComp>
        <h1>
            {{ msg }}
        </h1>
    </ChildComp>
</template>
