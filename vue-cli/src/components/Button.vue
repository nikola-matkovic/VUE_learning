<template>
    <button class="btn" :style= "{background: color}" @click="onclikck()">
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
        onclikck() {
            console.log('onclikck')
        }
    }
}
</script>