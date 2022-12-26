<template>
    <main v-bind="objectOfBindings">
        <h1>Learning bindings</h1>
        <p>I'm binding multiple attributes</p>
        <div :="objectOfBindings2">
            <p>Binding a class</p>
            <p>Binding a style</p>
        </div>
    </main>
</template>

<script setup>
const objectOfBindings = {
    id: "bindingPage",
    class: "h1",
    style: {
        border: "1px solid black",
    },
};

const objectOfBindings2 = {
    id: "div",
    class: "div",
};
</script>

<style scoped>
#bindingPage {
    background: rgb(224, 95, 95);
    color: white;
}
.h1 {
    font-size: 40px;
}

.div {
    background: blue;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
}

#div {
    border-radius: 50%;
    margin: 40px;
}
</style>
