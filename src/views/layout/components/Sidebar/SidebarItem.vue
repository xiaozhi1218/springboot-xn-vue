<template>
  <div class="menu-wrapper">
    <template v-for="(node,index) in nodes" v-if="!node.hidden">
      <el-submenu :key="index" :index="index+''" v-if="node.type==0">
        <template slot="title">
          <i :class="node.icon"></i>
          <span slot="title" style="margin-left: 10px;">{{ node.name }}</span>
        </template>
        <sidebar-item :nodes="node.children"></sidebar-item>
      </el-submenu>
      <!-- 考虑到没有子节点，根节点处理点击跳转 -->
      <router-link v-else :to="'/'+node.path" :key="index">
        <el-menu-item v-if="node.type==1" :index="node.path" style="font-size: 12px;">
          <i :class="node.icon"></i><span style="margin-left: 10px;">{{ node.name }}</span>
        </el-menu-item>
      </router-link>
      <!--<el-menu-item v-if="node.type==1 && node.list.length > 0" :index="node.children[0].path" :route="{name:node.children[0].name}">
        <i :class="node.iconCls"></i>{{ node.children[0].name }}
      </el-menu-item>-->
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      nodes: {
        required: true
      }
    }
  }
</script>
