<template>
  <div class="container">
    <Header title="list" />
	<Tasks :tasks="tasks" @delete-task="deleteTask" @toggle-reminder="toggleReminder"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Tasks from './components/Tasks.vue'

export default {
  name: 'App',
  components: {
    Header,
    Tasks
  },
  data() {
    return {
      tasks : []
    }
  },
  methods: {
    deleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id)
    },
    toggleReminder(id) {
      this.tasks = this.tasks
      .map((task) => task.id === id ? {...task, reminder: !task.reminder} : task)
    }
  },
  created(){
    this.tasks = [{
      id: 1,
      text: 'Learn Vue',
      day: 'May 5th at 2:30pm',
      reminder: true
    },
    {
      id: 2,
      text: 'Learn React',
      day: 'May 6th at 2:30pm',
      reminder: true
    },
    {
      id: 3,
      text: 'Learn Angular',
      day: 'May 7th at 2:30pm',
      reminder: true
    }]
  },

}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body{
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: hidden;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}

h1{
  font-weight: normal;
}


.btn{
  display: inline-block;
  bottom: #000;
  color: white;
  border: 0;
  padding:10px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus{
  outline: none;
}

.btn:active{
  transform: scale(0.98);
}

.btn-block{
  display: block;
  width: 100%;
}

</style>
