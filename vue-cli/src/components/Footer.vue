<template>
    <footer class="footer">
        <p>Copyright &copy; {{ new Date().getFullYear() }}</p>
        <a href="/about">About</a>
    </footer>
</template>

<script>
export default {
    name: "Footer",
};
</script>

<style scoped>
.footer {
    text-align: center;
    margin-top: 30px;
}

a {
    color: #000;
}
</style>
