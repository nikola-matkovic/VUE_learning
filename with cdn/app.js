const app = Vue.createApp({
    template: `<h1>Hello {{framework}}</h1>`,
    data() {
        return {
            framework: 'Vue!'
        }
    }

})

app.mount('#app')