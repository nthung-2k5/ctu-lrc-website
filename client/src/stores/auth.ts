import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthApi, ReaderApi, StaffApi } from '../api';
import type { LoginRequest, ReaderData, Staff } from '../openapi';

export type UserType = 'reader' | 'staff' | 'admin';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<ReaderData | Staff | null>(null);
    const userType = ref<UserType | null>(null);

    const isGuest = computed(() => userType.value === null);
    const isReader = computed(() => userType?.value === 'reader');
    const isStaff = computed(() => userType?.value === 'staff' || userType?.value === 'admin');
    const isAdmin = computed(() => userType?.value === 'admin');

    const profile = computed(() => user.value);

    const setReader = (reader: ReaderData) => {
        user.value = reader;
        userType.value = 'reader';
    };

    const setStaff = (staff: Staff) => {
        user.value = staff;
        userType.value = staff.role;
    };

    const clearAuth = () => {
        user.value = null;
        userType.value = null;
    };

    const loginAsReader = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            const response = await AuthApi.loginAsReader(null, credentials);

            if (response.status === 204) {
                const profile = await ReaderApi.getProfile();
                if (profile.data) {
                    setReader(profile.data);
                    return true;
                }
            }
        }
        catch (err) { }

        return false;
    };

    const loginAsStaff = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            const response = await AuthApi.loginAsStaff(null, credentials);

            if (response.status === 204) {
                const profile = await StaffApi.getProfile();
                if (profile.data) {
                    setStaff(profile.data);
                    return true;
                }
            }
        }
        catch (err) { }

        return false;
    };

    const logout = async (): Promise<void> => {
        try {
            await AuthApi.logout();
        }
        catch (err) {
            console.warn('Logout API call failed:', err);
        }
        finally {
            clearAuth();
        }
    };

    const checkAuth = async (): Promise<void> => {
        clearAuth();

        try {
            const readerProfile = await ReaderApi.getProfile();
            if (readerProfile.data) {
                setReader(readerProfile.data);
                return;
            }
        } catch (err) {}

        try {
            const staffProfile = await StaffApi.getProfile();
            if (staffProfile.data) {
                setStaff(staffProfile.data);
                return;
            }
        } catch (err) {}
    }

    return {
        // Getters
        profile,
        isGuest,
        isReader,
        isStaff,
        isAdmin,

        // Actions
        loginAsReader,
        loginAsStaff,
        logout,
        checkAuth,
        setReader,
    }
})
