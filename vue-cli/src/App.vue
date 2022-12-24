<template>
  <div class="container">
    <h1>Hello from cli </h1>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
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
