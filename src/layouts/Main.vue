<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import Logo from './logo/Logo.vue';
// dropdown imports
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import { Icon } from '@iconify/vue';
import NavCollapse from './vertical-sidebar/NavCollapse/NavCollapse.vue';
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer left elevation="0" app class="leftSidebar" width="270" v-model="sDrawer">
        <!---Logo part -->
        <div class="d-flex  mx-3 mt-5">
            <Logo />
            <h2> OneMore Admin</h2>
        </div>

        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
            <perfect-scrollbar class="scrollnavbar">
                <v-list class="pa-4 pt-0">
                    <!---Menu Loop -->
                    <template v-for="(item, i) in sidebarMenu">
                        <!---Item Sub Header -->
                        <NavGroup :item="item" v-if="item.header" :key="item.title" />
                        <NavCollapse class="" :item="item" :level="0" v-else-if="item.children" />
                        <!---Single Item-->
                        <NavItem :item="item" v-else class="leftPadding" />
                        <!---End Single Item-->
                    </template>
                </v-list>
            </perfect-scrollbar>
        </div>
    </v-navigation-drawer>

    <!------Header-------->
    <v-app-bar elevation="0" height="70" class="bg-background top-header">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn class="text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                    <Icon icon="solar:hamburger-menu-outline" height="20"></Icon>
                </v-btn>
                <!-- Notification -->
                <NotificationDD />
            </div>
            <div>
                <!-- User Profile -->
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>
