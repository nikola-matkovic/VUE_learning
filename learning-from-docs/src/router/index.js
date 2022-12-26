import { createRouter, createWebHistory } from "vue-router";
import vBind from "../views/vBindView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "vBind",
            component: vBind,
        },
        {
            path: "/VBind",
            name: "vBind",
            component: vBind,
        },
    ],
});

export default router;
