<template>
    <div class="container">
        <Header
            @toggle-add-task="toggleAddTask"
            title="list"
            :show-add-task="showAddTask"
        />

        <router-view :showAddTask="showAddTask"></router-view>
        <Footer />
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
    name: "App",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            tasks: [],
            showAddTask: false,
        };
    },
    methods: {
        toggleAddTask() {
            this.showAddTask = !this.showAddTask;
        },
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

body {
    font-family: "Poppins", sans-serif;
}

.container {
    max-width: 500px;
    margin: 30px auto;
    overflow: hidden;
    min-height: 300px;
    border: 1px solid steelblue;
    padding: 30px;
    border-radius: 5px;
}

h1 {
    font-weight: normal;
}

.btn {
    display: inline-block;
    background: #000;
    color: white;
    border: 0;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    font-size: 15px;
    font-family: inherit;
}

.btn:focus {
    outline: none;
}

.btn:active {
    transform: scale(0.98);
}

.btn-block {
    display: block;
    width: 100%;
}
</style>
