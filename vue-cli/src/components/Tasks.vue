<template>
    <div :key="task.id" v-for="task in tasks">
        <h3>{{task.text}}</h3>
        <p>{{task.day}}</p>
    </div>
</template>


<script>
export default {
    name: 'tasks',
    props: {
        tasks: {
            type: Array,
            required: true
        }
    }
}
</script>