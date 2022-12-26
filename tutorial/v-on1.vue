<script>
export default {
    data() {
        return {
            count: 0,
        };
    },
    methods: {
        increment() {
            this.count++;
        },
    },
};
</script>

<template>
    <!-- make this button work -->
    <button @click="increment">count is: {{ count }}</button>
</template>
