<script>
// give each todo a unique id
let id = 0;

export default {
    data() {
        return {
            newTodo: "",
            todos: [
                { id: id++, text: "Learn HTML" },
                { id: id++, text: "Learn JavaScript" },
                { id: id++, text: "Learn Vue" },
            ],
        };
    },
    methods: {
        addTodo() {
            let temp = { id: id++, text: this.newTodo };
            this.todos.push(temp);
            this.newTodo = "";
        },
        removeTodo(todo) {
            this.todos = this.todos.filter((value) => value !== todo);
        },
    },
};
</script>

<template>
    <form @submit.prevent="addTodo">
        <input v-model="newTodo" />
        <button>Add Todo</button>
    </form>
    <ul>
        <li v-for="todo in todos" :key="todo.id">
            {{ todo.text }}
            <button @click="removeTodo(todo)">X</button>
        </li>
    </ul>
</template>
