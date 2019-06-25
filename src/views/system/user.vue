<template>
	<el-container>
		<el-header>
			<el-row style="margin-top: 10px;">
				<el-col :span="4">
					<el-button size="mini" type="primary" @click="addUser">添加</el-button>
					<el-button size="mini" type="danger" @click="deleteUser">删除</el-button>
          <el-button size="mini" type="success">刷新</el-button>
				</el-col>
				<el-col :span="8">
					<el-input size="mini" placeholder="请输入内容" v-model="query.search">
						<el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<el-table height="400px" size="mini" ref="userTable" :data="users" stripe tooltip-effect="dark" style="width: 100%"
			 @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column label="编号" width="120">
					<template slot-scope="scope">{{ scope.row.userid }}</template>
				</el-table-column>
				<el-table-column prop="username" label="用户名" width="120">
				</el-table-column>
				<el-table-column prop="phone" label="电话号码" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="realname" label="真实姓名" show-overflow-tooltip>
				</el-table-column>
        <el-table-column prop="regionsName" label="所属区域" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="isRegionAdmin" label="用户属性" width="200"
                         :filters="[{ text: '普通用户', value: 0 },{ text: '区域负责人', value:1}]"
                         :filter-method="filterTag"
                         filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isRegionAdmin =='0' ? 'primary' : 'success' "
              close-transition>
              <span v-if="scope.row.isRegionAdmin =='0'">普通用户</span>
              <span v-if="scope.row.isRegionAdmin >0">区域负责人</span>
            </el-tag>
          </template>
        </el-table-column>

				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="creatorName" label="创建者" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="state" label="状态" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag :type="scope.row.state === 0 ? 'danger' : 'success'" disable-transitions>{{scope.row.state==1?'启用':'禁用'}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination style="text-align: right;margin-top: 10px;" background layout=" sizes,prev, pager, next"
                                     @size-change="getList"
                                     @current-change="getList" :current-page.sync="query.page" :page-size.sync="query.size" :total="totals":page-sizes="[1,5,10]">
    </el-pagination>
		</el-main>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="800px">
			<el-form ref="form" :model="form" label-width="80px" size="mini">
				<el-form-item label="编号">
					<el-input v-model="form.userid" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="真实姓名">
					<el-input v-model="form.realname"></el-input>
				</el-form-item>

        <el-form-item label="所属区域">
          <el-select v-model="form.regionsId" filterable placeholder="请选择所属区域" @change="selectChange" >
            <el-option
              v-for="item in this.options"
              :label="item.localName"
              :value="item.id">
              <span :style="'display: inline-block;width:'+ item.levelStr+'px'"></span>
              <span>{{item.localName}}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设置区域负责人" :hidden="form.userid==null">
          <el-switch
            v-model="adminState"
            active-color="#13ce66"
            inactive-color="#999999"
            active-text="区域负责人"
            inactive-text="普通用户"
            @change="adminStateChange"
          >
          </el-switch>

        </el-form-item>

				<el-form-item label="状态">
					<el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
					 :active-value="1" :inactive-value="0">
					</el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="mini">取 消</el-button>
				<el-button type="primary" @click="saveOrUpdate" size="mini">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import {
		page,
		save,
		remove,
    findAdminFromRegions,
    changeRegionAdmin
	} from '@/api/system/user'
  import {
    nav
  } from "@/api/system/regions"
	export default {
		data() {
			return {
        options:[],
        preReginoId:-1,//原区域id，更新区域时使用
        level:0,//计算区域等级
        RegionsTree: [],//区域树
        adminState:false,//区域负责人状态
				form: {
					state: 0
				},
				query: {
					page: 1,
					size: 5,
					search: null
				},

				totals: 0,
				users: [],
				dialogVisible: false,
				loading: false,
				selectIds:[]
			}
		},
		created() {
			this.getList();
      this.getRegionsTree();
		},
		methods: {
      //遍历树
      treeSelect(tree){
        for(var i=0;i<tree.length;i++){
          this.level = (tree[i].regionPath.split(',')).length-3;
          this.level*=20;
          this.options.push({id: tree[i].id,localName: tree[i].localName,regionPath:tree[i].regionPath,levelStr:this.level});
          this.level=0;
          if(tree[i].children!=null){
            this.treeSelect(tree[i].children);
          }
        }
      },
      //获取区域树
      getRegionsTree(){
        nav().then(res => {
          this.RegionsTree = res.data;
          this.treeSelect(this.RegionsTree);
        })
      },
      //改变区域负责人状态
      adminStateChange(value){
        console.log(value);
        if(value==false){
          //取消区域负责人（删除该区域负责人id）
          changeRegionAdmin({regionId:this.form.regionsId , userId:null}).then(res=>{
            this.$message({
              type: 'info',
              message: '取消区域负责人成功'
            });
          })
          this.adminState=false;
        }
        //设置区域负责人
        else{
          //先查询该区域有无负责人，如果有，返回负责人
          findAdminFromRegions({regionId:this.form.regionsId}).then(res=>{
            if(res.data.userid!=null){
              this.$confirm('该区域存在负责人, 是否替换?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //修改区域负责人
                changeRegionAdmin({regionId:this.form.regionsId , userId:this.form.userid}).then(res=>{
                  this.$message({
                    type: 'info',
                    message: '修改区域负责人成功'
                  });
                })

              }).catch(() => {
                this.form.isRegionAdmin=0;
                this.$message({
                  type: 'info',
                  message: '已取消设置'
                });
              });
            }
            else{
              //修改区域负责人
              changeRegionAdmin({regionId:this.form.regionsId , userId:this.form.userid}).then(res=>{
                this.$message({
                  type: 'info',
                  message: '修改区域负责人成功'
                });
              })
            }
          })
        }

      },

      filterTag(value, row) {
        if(value==0){
          return row.isRegionAdmin == value;
        }
        else if(value==1) {
          return row.isRegionAdmin !==0;
        }
      },
      selectChange(value) {
        if(this.form.isRegionAdmin>0){//如果是区域负责人
          //（删除该区域负责人id）
          changeRegionAdmin({regionId:this.preReginoId , userId:null})
          this.$message({
            type: 'warning',
            message: '改变区域，区域负责人职位将会被取消，请重新设置区域负责人职位'
          });
          this.adminState=false;
        }

      },

			handleSelectionChange(e) {
				this.selectIds=e.map(item=>item.userid);
			},
			getList() {
				this.loading = true;
				page(this.query).then(res => {
					this.users = res.data.list;
					this.totals = res.data.total;
					this.loading = false
				})
			},
			deleteUser(){
				if(this.selectIds<=0){
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
					remove(this.selectIds).then(res=>{
						this.$message({
							type: 'success',
							message: res.msg
						});
						this.getList()
					})
				});
			},
			addUser() {
				this.dialogVisible = true;
				this.form = {
					state: 0
				}
			},
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form = row;
        this.preReginoId=this.form.regionsId;
				if(this.form.isRegionAdmin==0){//区域负责人为0
				  this.adminState=false;//普通用户
        }
				else {
				  this.adminState=true;//区域负责人
        }
				delete this.form.createTime
			},
			saveOrUpdate() {
				save(this.form).then(res => {
					this.$message({
						type: 'success',
						message: res.msg
					});
					this.dialogVisible = false;
					this.getList()
				});
			}
		}
	}
</script>

<style>
</style>
