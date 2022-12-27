import { createRouter, createWebHistory } from "vue-router";
import vBind from "../views/vBindView.vue";
import Modifilers from "../views/ModifiersView.vue";
import ComputedView from "../views/ComputedView.vue";

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
        {
            path: "/modifilers",
            name: "modifilers",
            component: Modifilers,
        },
        {
            path: "/computed",
            name: "computed",
            component: ComputedView,
        },
    ],
});

export default router;
