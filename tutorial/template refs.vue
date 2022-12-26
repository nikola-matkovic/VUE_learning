<script>
export default {
    mounted() {
        this.$refs.p.textContent = "How are you?";
    },
};
</script>

<template>
    <p ref="p">hello</p>
</template>
