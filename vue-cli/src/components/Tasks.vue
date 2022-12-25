<template>
    <div>
        <Task @toggle-reminder="$emit('toggle-reminder', task.id)" v-for="task in tasks" :key="task.id" :task="task"
            @delete-task="$emit('delete-task', task.id)"
        />
    </div>
</template>


<script>
import Task from './Task.vue'

export default {
    name: 'tasks',
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    components: {
        Task
    },
    emits: ['delete-task', 'toggle-reminder']
}
</script>