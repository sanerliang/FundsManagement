<template>
    <div class="index">
        <head-nav></head-nav>
        <left-menu></left-menu>
        <div class="rightContainer">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import headNav from '../components/HeadNav'
    import leftMenu from '../components/LeftMenu'
    export default {
        name: "index",
        components: { 
            headNav, 
            leftMenu 
        }
    };
</script>

<style>
    .index {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .rightContainer {
        position: relative;
        top: 0;
        left: 180px;
        width: calc(100% - 180px);
        height: calc(100% - 71px);
        overflow: auto;
    }
</style>
