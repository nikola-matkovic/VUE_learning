<template>
    <header>
        <h1>TODO {{ title }}</h1>
        <Button
            @btn-click="$emit('toggle-add-task')"
            :text="showAddTask ? 'Close' : 'Add Task'"
            :color="showAddTask ? 'red' : 'green'"
        />
    </header>
</template>

<script>
import Button from "./Button.vue";

export default {
    name: "Header",
    // props: ['title']
    // drugi način za props
    props: {
        title: {
            type: String,
            required: true,
            default: "list",
        },
        showAddTask: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Button,
    },
    emits: ["toggle-add-task"],
};
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
</style>
