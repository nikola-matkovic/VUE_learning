<template>
    <div class="container">
        <Header
            @toggle-add-task="toggleAddTask"
            title="list"
            :show-add-task="showAddTask"
        />
        <AddTask v-if="showAddTask" @add-task="addTask" />
        <Tasks
            :tasks="tasks"
            @delete-task="deleteTask"
            @toggle-reminder="toggleReminder"
        />
        <router-view></router-view>
        <Footer />
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

import Tasks from "./components/Tasks.vue";
import AddTask from "./components/AddTask.vue";

export default {
    name: "App",
    components: {
        Header,
        Tasks,
        AddTask,
        Footer,
    },
    data() {
        return {
            tasks: [],
            showAddTask: false,
        };
    },
    methods: {
        async toggleReminder(id) {
            const taskToToggle = await this.fetchTask(id);
            const updTask = {
                ...taskToToggle,
                reminder: !taskToToggle.reminder,
            };
            const res = await fetch(`api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(updTask),
            });
            const data = await res.json();
            this.tasks = this.tasks.map((task) =>
                task.id === id ? { ...task, reminder: data.reminder } : task
            );
        },

        async deleteTask(id) {
            const res = await fetch(`api/tasks/${id}`, {
                method: "DELETE",
            });

            res.status === 200
                ? (this.tasks = this.tasks.filter((task) => task.id !== id))
                : alert("Error Deleting This Task");
        },
        async addTask(task) {
            const res = await fetch("api/tasks", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(task),
            });
            const data = await res.json();

            this.tasks = [...this.tasks, data];
        },
        toggleAddTask() {
            this.showAddTask = !this.showAddTask;
        },
        async fetchTasks() {
            const res = await fetch("api/tasks");
            const data = await res.json();
            return data;
        },
        async fetchTask(id) {
            const res = await fetch(`api/tasks/${id}`);
            const data = await res.json();
            return data;
        },
    },
    async created() {
        this.tasks = await this.fetchTasks();
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
