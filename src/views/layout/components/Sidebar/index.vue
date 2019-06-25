
<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :nodes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem},
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$store.getters.menus
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
