import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import './style.css'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import BooksView from './views/BooksView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import { setupRouteGuards } from './router-guards'
import BookDetailView from './views/BookDetailView.vue'
import UserDashboardView from './views/user/UserDashboardView.vue'
import AdminOverview from './views/admin/AdminOverview.vue'
import ManageBooks from './views/admin/ManageBooks.vue'
import ManageUsers from './views/admin/ManageUsers.vue'
import LendingManagement from './views/admin/ManageBorrowing.vue'
import UserLayout from './layouts/UserLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import ui from '@nuxt/ui/vue-plugin'
import ManagePublishers from './views/admin/ManagePublishers.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: HomeView, meta: { layout: UserLayout } },
    
    { path: '/books', component: BooksView, meta: { layout: UserLayout } },
    { path: '/books/:id', component: BookDetailView, meta: { layout: UserLayout } },

    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },

    { path: '/user/:activeTab?', component: UserDashboardView, meta: { layout: UserLayout, protectedRoute: 'reader' } },

    { path: '/admin', component: AdminOverview, meta: { protectedRoute: 'staff', layout: AdminLayout } },
    { path: '/admin/books', component: ManageBooks, meta: { protectedRoute: 'staff', layout: AdminLayout } },
    { path: '/admin/publishers', component: ManagePublishers, meta: { protectedRoute: 'staff', layout: AdminLayout } },
    { path: '/admin/lending', component: LendingManagement, meta: { protectedRoute: 'staff', layout: AdminLayout } },
    { path: '/admin/users', component: ManageUsers, meta: { protectedRoute: 'admin', layout: AdminLayout } }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Initialize the app
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(ui);
app.use(pinia);

// Setup route guards
setupRouteGuards(router);

// Start the app
app.mount('#app');
