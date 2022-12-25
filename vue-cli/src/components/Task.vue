<template>
    <div
        @dblclick="$emit('toggle-reminder', task.id)"
        :class="[task.reminder ? 'reminder' : '', 'task']"
        :key="task.id"
    >
        <h3>
            {{ task.text }}
            <i @click="$emit('delete-task', task.id)" class="fas fa-times"></i>
        </h3>
        <p>{{ task.day }}</p>
    </div>
</template>

<script>
export default {
    name: "Task",
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    methods: {
        onDelete(id) {
            this.$emit("delete-task", id);
        },
    },
    emits: ["delete-task", "toggle-reminder"],
};
</script>

<style scoped>
.task {
    background-color: #f4f4f5;
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 10px;
}

.task.reminder {
    border-left: 5px solid green;
}

.task h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fas {
    color: red;
}
</style>
