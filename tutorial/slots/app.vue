<script>
import ChildComp from "./ChildComp.vue";

export default {
    components: {
        ChildComp,
    },
    data() {
        return {
            msg: "from parent",
        };
    },
};
</script>

<template>
    <ChildComp>
        <h1>
            {{ msg }}
        </h1>
    </ChildComp>
</template>
