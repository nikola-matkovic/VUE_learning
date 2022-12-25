<template>
    <button class="btn" :style= "{background: color}" @click="onclick()">
        {{text}}
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        text: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    methods: {
        onclick() {
            this.$emit("toggle-add-task")
        }
    },
    emits: ['toggle-add-task']
}
</script>