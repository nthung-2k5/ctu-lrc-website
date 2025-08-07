import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export function setupRouteGuards(router: Router) {
    router.beforeEach(async (to, _from) => {
        const authStore = useAuthStore();
        if (authStore.isGuest) {
            await authStore.checkAuth();
        }

        if (to.meta.protectedRoute) {
            if (authStore.isGuest) {
                return { path: '/login', query: { redirect: to.fullPath } };
            }

            if (to.meta.protectedRoute === 'admin' && !authStore.isAdmin) {
                return '/';
            }

            if (to.meta.protectedRoute === 'staff' && !authStore.isStaff) {
                return '/';
            }

            if (to.meta.protectedRoute === 'reader' && !authStore.isReader) {
                return '/';
            }
        }

        if (['/login', '/register'].includes(to.path) && !authStore.isGuest) {
            return '/';
        }

        if (authStore.isStaff && !to.path.startsWith('/admin')) {
            return '/admin';
        }
    });
}
