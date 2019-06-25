<template>
  <el-container v-loading="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">

    <!--页面表头-->
    <el-header style="height: 25px;margin-top:10px ;">
      <el-row>
        <el-col :span="4">
          <el-button size="mini " class="margin-10px" type="primary" @click="submitAdd">添加</el-button>
          <el-button size="mini " class="margin-10px" type="danger" @click="cut">删除</el-button>
         <!-- <el-button size="mini " class="margin-10px" type="success" @click="getList">刷新</el-button>-->
        </el-col>
        <el-col :span="8">
          <el-input size="mini" @keydown.enter.native="getList" placeholder="请输入搜索内容" v-model="query.searchName"
                    class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
    </el-header>
    <!--主体表单-->
    <el-main>
      <el-table :data="company" ref="companyTable" tooltip-effect="dark" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="公司代码"></el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="watchClick(scope.row)" type="text" size="small">查看更多</el-button>
            <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>

      </el-table>


      <!--分页-->
      <el-pagination style="float: right;margin-top: 10px" background
                     @current-change="getList"
                     @size-change="getList"
                     layout="sizes,prev, pager, next"
                     :total="total"
                     :page-sizes="[5, 10,20,30]"
                     :current-page.sync="query.page"
                     :page-size.sync="query.size"></el-pagination>
    </el-main>

    <!--添加框-->
    <el-dialog title="添加" :visible.sync="addFrom"  width="25%" style="height: 950px" center>
      <el-row>
        <el-form :model="companyForm" ref="companyForm"  label-width="80px">
        <el-col :span="15">
          <el-form-item label="公司名称" prop="name"   >
            <el-input v-model="companyForm.name" :disabled="onOrOff" label-width="90px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="公司代码" prop="code">
            <el-input v-model="companyForm.code" :disabled="onOrOff" label-width="90px"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      </el-row>

       <div slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" size="mini" @click="resetForm('companyForm')">取 消</el-button>
        <el-button :plain="true" type="info" size="mini" @click="submitForm('companyForm')">确 定</el-button>
      </div>

    </el-dialog>
  </el-container>

</template>

<script>
  import {
  page,
  remove,
  submit,
}
  from '@/api/system/logicompany'
    export default {

      data(){
        return{
          addFrom:false,
          onOrOff:false,
          total: 0,
          query: {
            page: 1,
            size: 10,
            searchName: null
          },
          companyForm:{
            name:null,
            code:null,
          },
          company:[],
          selectIds: []

        }
      },
      methods:{

        submitAdd() {
          this.companyForm = {};
          this.addFrom = true
        },
        /*查看*/
        watchClick(index, row) {
          this.onOrOff=true;
          this.companyForm=index
          console.log(index)
          this.addFrom = true
        },
        editClick(index, row) {
          this.onOrOff=false;
          this.companyForm=index;
          console.log(index);
          this.addFrom = true;
        },

        resetForm(formName) {
          this.$refs[formName].clearValidate();
          this.addFrom = false;
        },

        /*提交*/
        submitForm(res) {
          this.$refs[res].clearValidate();
          this.$refs[res].validate((valid) => {
            if (valid) {
              this.addCompanyForm();
              this.$notify({
                title: '提交成功',
                message: '已经成功添加数据',
                type: 'success'
              });
              this.getList();
              this.addFrom = false;

            } else {
              console.log('error submit!!');
              return false;
            }
            this.getList();
          });
        },
        addCompanyForm(){
          this.companyForm.name=this.companyForm.name;
          submit(this.companyForm);
          console.log(this.companyForm)
          this.companyForm = {};
        },
        cut() {
          if (this.selectIds <= 0) {
            this.$message({
              type: 'warning',
              message: '请至少选择一条要删除的记录！'
            });
            return
          }
          this.$confirm('您确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.selectIds)
            remove(this.selectIds).then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getList()
            })
          });
        },
        getList() {
          this.loading = true;
          page(this.query).then(res => {
            console.log(res);
            this.company = res.data.list;
            this.total = res.data.total;
            this.loading = false
          });

        },
        handleSelectionChange(e) {
          console.log(e);
          this.selects = e;
          this.selectIds = [];
          for (var i = 0; i < e.length; i++) {
            this.selectIds.push(e[i].goodsId)
          }
          console.log(this.selectIds)
        },


      },
      created(){
        this.getList();
      }
    };

</script>


<style scoped>

</style>
