<template>
    <form class="add-fomr">
        <div class="form-control">
            <label>Task</label>
            <input type="text" placeholder="Add Task" />
        </div>
        <div class="form-control">
            <label>Day & Time</label>
            <input type="text" placeholder="Add Day & Time" />
        </div>
        <div class="form-control form-control-check">
            <label>Set Reminder</label>
            <input type="checkbox" />
        </div>
        <input type="submit" value="Save Task" class="btn btn-block" />
    </form>
</template>

<script>
export default {
    name: 'AddTask'
}
</script>