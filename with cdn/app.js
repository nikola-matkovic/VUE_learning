const data = () => {
    return {
        firstname: 'John',
        lastname: 'Doe',
        email: 'jonh@gmail.com',
        gender: 'male',
        picture: `https://randomuser.me/api/portraits/men/10.jpg`
    }
}

async function getUser (){
    const res = await fetch('https://randomuser.me/api')
    const { results } = await res.json()
    this.firstname = results[0].name.first
    this.lastname = results[0].name.last
    this.email = results[0].email
    this.picture = results[0].picture.large;
    this.gender = results[0].gender
    console.log(this)
}

const methods = {
    getUser,
}

const app = Vue.createApp({
    data,
    methods
})

app.mount('#app')