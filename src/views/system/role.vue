<template>
  <el-container
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-header>
      <el-row style="margin-top: 10px;">
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="addRole">添加</el-button>
          <el-button size="mini" type="danger" @click="deleteRole">删除</el-button>
        </el-col>
        <el-col :span="8">
          <el-input size="mini" placeholder="请输入内容" v-model="query.search">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        height="400px"
        size="mini"
        ref="RoleTable"
        :data="Role"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column label="编号" width="200">
          <template slot-scope="scope">{{ scope.row.roleId}}</template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名" width="200"></el-table-column>
        <el-table-column prop="regionsName" label="所属区域" width="200"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="authEdit(scope.$index, scope.row)">权限设置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align: right;margin-top: 10px;"
        background
        layout=" sizes,prev, pager, next"
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="query.page"
        :page-size.sync="query.size"
        :total="totals"
        :page-sizes="[1,5,10]"
      ></el-pagination>
    </el-main>
    <el-dialog width="800px" title="权限设置" v-dialogDrag :visible.sync="authDialogVisible">
      <tree-table :data="menuTree" :columns="columns" border height="450" @getAuth="getAuth"></tree-table>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="800px">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="编号">
          <el-input v-model="form.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>

        <el-form-item label="所属区域">
          <el-select
            v-model="form.regionsId"
            filterable
            placeholder="请选择所属区域"
            @change="selectChange"
          >
            <el-option
              v-for="(item,index) in this.options"
              :key="index"
              :label="item.localName"
              :value="item.id"
            >
              <span :style="'display: inline-block;width:'+ item.levelStr+'px'"></span>
              <span>{{item.localName}}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!--  <el-form-item label="权限设置"> 
              <el-input placeholder="输入关键字进行权限过滤" v-model="filterText"></el-input>
               <el-tree
            default-expand-all
            class="filter-tree"
            :check-strictly="state"
            :filter-node-method="filterNode"
            ref="tree2"
            :data="menuTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="this.menuList"
            @check-change="checkMenu"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { getRole, save, remove, getRoleMenu } from "@/api/system/role";
import { nav } from "@/api/system/regions";
import treeTable from "@/components/TreeTableAuthor";

export default {
  components: { treeTable },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      columns: [
        {
          text: "菜单列表",
          value: "name",
          width: 200,
          option: "listMenuButtons"
        },
        {
          text: "功能权限",
          value: "listMenuButtons",
          option: "listMenuButtons",
          act: "act"
        }
      ],
      checkList: ["选中且禁用", "复选框 A"],
      state: true, //控制父子菜单不关联
      filterText: "", //权限过滤
      menuTree: [], //菜单树
      menuList: [], //被选中菜单
      selectRoleId: null, //查询权限时的id
      options: [], //区域树列表
      form: {},
      query: {
        page: 1,
        size: 5,
        search: null
      },
      totals: 0,
      Role: [],
      dialogVisible: false,
      authDialogVisible: false,
      loading: false,
      selectIds: []
    };
  },
  created() {
    this.getList();
    this.getRegionsTree();
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //获取角色菜单
    getMenuTree() {
      this.state = true;
      getRoleMenu({ roleId: this.selectRoleId }).then(res => {
        this.menuTree = res.data;
        // this.menuTreeSelect(this.menuTree); //获取被选中的菜单id

        // console.log(this.menuList);
      });
    },
    //遍历菜单树
    menuTreeSelect(tree) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].isAuth == 1) {
          this.menuList.push(tree[i].id); //获取被选中的菜单id
        }
        if (tree[i] && tree[i].hasOwnProperty("children")) {
          this.menuTreeSelect(tree[i].children);
        }
      }
    },

    //点击多选框改变事件
    checkMenu(data, checked, indeterminate) {
      this.state = true;
      if (checked == false) {
        data.isAuth = 0;
      } else if (checked == true) {
        data.isAuth = 1;
      }
    },

    //遍历区域树
    treeSelect(tree) {
      for (var i = 0; i < tree.length; i++) {
        this.level = tree[i].regionPath.split(",").length - 3;
        this.level *= 20;
        this.options.push({
          id: tree[i].id,
          localName: tree[i].localName,
          regionPath: tree[i].regionPath,
          levelStr: this.level
        });
        this.level = 0;
        if (tree[i].children != null) {
          this.treeSelect(tree[i].children);
        }
      }
    },
    //获取区域树
    getRegionsTree() {
      nav().then(res => {
        this.RegionsTree = res.data;
        this.treeSelect(this.RegionsTree);
      });
    },

    selectChange(value) {},

    handleSelectionChange(e) {
      this.selectIds = e.map(item => item.roleId);
    },
    getList() {
      this.loading = true;
      getRole(this.query).then(res => {
        this.Role = res.data.list;
        this.totals = res.data.total;
        this.loading = false;
      });
    },
    deleteRole() {
      if (this.selectIds <= 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一条要删除的记录！"
        });
        return;
      }
      this.$confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remove(this.selectIds)
          .then(res => {
            this.$message({
              type: "操作成功，注意：有关联用户的角色将不会被删除",
              message: res.msg
            });
            this.getList();
          })
          .catch(() => {
            this.form.isRegionAdmin = 0;
            this.$message({
              type: "info",
              message: "有关联用户的角色将不会被删除"
            });
          });
      });
    },
    addRole() {
      this.dialogVisible = true;
      this.selectRoleId = null;
      this.getMenuTree();
      this.form = {
        state: 0
      };
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.form = row;
      this.selectRoleId = this.form.roleId;
      // this.getMenuTree();
    },
    authEdit(index, row) {
      this.menuTree = [];
      this.authDialogVisible = true;
      this.form = row;
      this.selectRoleId = row.roleId;
      this.getMenuTree();
    },
    saveOrUpdate() {
      // this.menuList = [];
      // this.menuTreeSelect(this.menuTree); //获取被修改选中的菜单id
      save(this.form).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.dialogVisible = false;
        this.authDialogVisible = false;
        this.getList();
      });
    },
    getAuth(data) {
      let opt = [];
      let url = "/admin/menu/tree,/admin/adminuser/info,";
      data.forEach(val => {
        if (val.children) {
          val.children.forEach(el => {
            if (el.selectchecked.length) {
              let flag = false;
              let index = -1;
              opt.forEach((element, i) => {
                if (element.parentId == val.id) {
                  flag = true;
                  index = i;
                }
              });
              if (!flag) {
                // opt.push(val.id);
                let map = { parentId: null, menu: [] };
                map.parentId = val.id;
                map.menu = [{ id: el.id, selectedbutton: el.selectchecked }];
                opt.push(map);
              } else {
                opt[index].menu.push({
                  id: el.id,
                  selectedbutton: el.selectchecked
                });
              }
              el.selectchecked.forEach(checked => {
                el.listMenuButtons.forEach(item => {
                  if (checked == item.iconname) {
                    url += el.permission + item.iconpermission + ",";
                  }
                });
              });
            }
          });
        }
      });
      this.form.authUrl = url.substring(0, url.length - 1);
      this.form.authAction = JSON.stringify(opt);
      this.saveOrUpdate();
    }
  }
};
</script>

<style>
</style>


