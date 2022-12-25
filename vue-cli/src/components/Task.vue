<template>
    <div :class="[task.reminder ? 'reminder' : '', 'task' ]" :key="task.id">
        <h3>{{task.text}}
            <i class="fas fa-times"></i>
        </h3>
        <p>{{task.day}}</p>
    </div>
</template>


<script>
export default {
    name: 'Task',
    props: {
        task: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>

.task{
    background-color: #f4f4f5;
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
}

.task.reminder{
    border-left:5px solid green;
}

.task h3{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fas {
    color: red;
}

</style>


