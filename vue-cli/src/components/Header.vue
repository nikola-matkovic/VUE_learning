<template>
    <header>
        <h1>TODO {{title}}</h1>
        <Button text = "Add task" color="green" />
    </header>
</template>


<script>

import Button from './Button.vue'

export default {
    name: 'Header',
    // props: ['title']
    // drugi način za props
    props: {
        title: {
            type: String,
            required: true, 
            default: 'list'
        }
    },

    components: {
        Button,
    }

}
</script>

<style scoped>

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

</style>