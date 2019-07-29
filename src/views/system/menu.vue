<template>
  <el-container>
    <el-header>
      <el-row style="margin-top: 20px;">
        <el-button size="mini" type="primary" @click="addMenu">添加</el-button>
        <el-button size="mini" type="danger" @click="deleteMenu" :disabled="!formDisable">删除</el-button>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" style="padding-left: 20px;">
        <el-card shadow="always" style="height: 450px;">
          <el-tree :data="menuTree" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
        </el-card>
      </el-aside>
      <el-main>
        <el-form size="mini" ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单编号">
                <el-input v-model="form.id" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="上级菜单">
                <el-select
                  v-model="form.pid"
                  placeholder="请选择上级菜单"
                  @change="selectChange"
                  :disabled="formDisable"
                >
                  <el-option label="顶级菜单" :value="0"></el-option>
                  <el-option
                    v-for="(menu,index) in menuTree"
                    :label="menu.name"
                    :value="menu.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="菜单名称">
                <el-input v-model="form.title" :disabled="formDisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单地址">
                <el-input v-model="form.url" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标">
                <div>
                  <span :class="form.icon"></span>
                  <el-button
                    type="warning"
                    style="margin-left: 30px;"
                    @click="chooseIcon"
                    :disabled="formDisable"
                  >选择</el-button>
                </div>
              </el-form-item>
              <el-form-item label="菜单排序">
                <el-input v-model="form.sorder" :disabled="formDisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="url" v-if="form.pid>0">
              <el-input v-model="form.permission" :disabled="formDisable"></el-input>
            </el-form-item>
            <el-form-item v-if="form.pid>0" label="功能权限">
              <el-table :data="checkedMenuButtons" size="mini" style="width: 100%" max-height="250">
                <el-table-column label="名称" width="150">
                  <template scope="scope">
                    <el-input
                      :disabled="formDisable"
                      size="mini"
                      v-model="scope.row.iconname"
                      placeholder="请输入内容"
                      @change="updateicon(scope.$index, scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="权限" width="120">
                  <template scope="scope">
                    <el-input
                      :disabled="formDisable"
                      size="mini"
                      v-model="scope.row.iconpermission"
                      placeholder="请输入内容"
                      @change="updateicon(scope.$index, scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteicon(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      :disabled="formDisable"
                    >移除</el-button>
                    <el-button
                      @click.native.prevent="inserticon(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      :disabled="formDisable"
                    >添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="setEdit">{{btnTitle}}</el-button>
              <el-button type="primary" @click="onSubmit" :disabled="formDisable">保存</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-main>
    </el-container>

    <el-dialog title="图标选择" :visible.sync="dialogIconVisible" width="800px">
      <span
        @click="setIcon(icon.name)"
        style="margin: 10px;font-size: 18px;cursor: pointer;"
        v-for="(icon,index) in iconFont"
        :key="index"
        :class="'fa '+icon.name "
      ></span>
      <el-pagination
        style="text-align: right;"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="iconQuery.page"
        :page-size="iconQuery.size"
        :total="iconTotal"
      ></el-pagination>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  nav,
  detail,
  saveOrUpdate,
  iconFont,
  menuDelete
} from "@/api/system/menu";
export default {
  data() {
    return {
      form: {
        id: null,
        menutype: 0,
        menuButtons: null
      },
      checkedMenuButtons: [],
      tableData: [
        {
          iconname: "新增",
          iconpermission: "/submit",
          type: 2,
          checked: false
        },
        {
          iconname: "修改",
          iconpermission: "/submit",
          type: 2,
          checked: false
        },
        {
          iconname: "查询全部",
          iconpermission: "/page",
          type: 2,
          checked: false
        },
        {
          iconname: "查询单条",
          iconpermission: "/detail",
          type: 2,
          checked: false
        },
        {
          iconname: "删除",
          iconpermission: "/remove",
          type: 2,
          checked: false
        }
      ],
      formDisable: true,
      btnTitle: "修改",
      menuTree: [],
      iconFont: [],
      iconQuery: {
        page: 1,
        size: 200
      },
      iconTotal: 0,
      dialogIconVisible: false,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getMenuTree();
    this.getIconFont();
  },
  methods: {
    deleteicon(index, rows) {
      this.checkedMenuButtons.splice(index, 1);
    },
    updateicon(index, rows) {
      console.log(rows);
    },
    inserticon(index) {
      var newicon = {
        iconname: "",
        iconpermission: "",
        type: 2,
        checked: false
      };
      this.checkedMenuButtons.push(newicon);
      //   rows.splice(index, 1);
    },
    handleNodeClick(data) {
      this.getDetail(data.id);
    },
    handleCurrentChange() {
      this.getIconFont();
    },
    setEdit() {
      if (this.btnTitle == "修改") {
        this.formDisable = false;
        this.btnTitle = "取消";
      } else {
        this.formDisable = true;
        this.btnTitle = "修改";
      }
    },
    selectChange(value) {
      this.form.menutype = value > 0 ? 1 : 0;
      if (value == 1) {
        this.checkedMenuButtons = this.tableData;
      }
    },
    getMenuTree() {
      nav().then(res => {
        this.menuTree = res.data;
        this.getDetail(res.data[0].id);
      });
    },
    getIconFont() {
      iconFont(this.iconQuery).then(res => {
        this.iconFont = res.data.list;
        this.iconTotal = res.data.total;
        console.log(res);
      });
    },
    getDetail(id) {
      detail({
        id: id
      }).then(res => {
        if (res.data.pid != 0) {
          this.checkedMenuButtons = JSON.parse(res.data.menuButtons);
        } else {
          this.checkedMenuButtons = [];
        }
        this.form = res.data;
      });
    },
    chooseIcon() {
      this.dialogIconVisible = true;
    },
    setIcon(name) {
      this.form.icon = "fa " + name + " fa-lg";
      this.dialogIconVisible = false;
    },
    addMenu() {
      this.form = {};
      this.checkedMenuButtons = this.tableData;
      this.formDisable = false;
    },
    deleteMenu() {
      this.$confirm('您确定要删除"' + this.form.title + '"吗?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        menuDelete(this.form.id).then(res => {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.getMenuTree();
        });
      });
    },
    onSubmit() {
      if (
        this.form.pid > 0 &&
        (this.checkedMenuButtons == null || this.checkedMenuButtons.length < 0)
      ) {
        this.$message({
          message: "二级菜单权限不能为空",
          type: "error"
        });
        return;
      } else {
        this.form.menuButtons = JSON.stringify(this.checkedMenuButtons);
      }
      this.form.meunList = this.checkedCities;
      saveOrUpdate(this.form).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.formDisable = true;
        this.btnTitle = "修改";
        this.getMenuTree();
      });
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding: 0px 15px 30px;
}
.el-table__header th {
  padding: 0;
  height: 10px;
}
</style>
