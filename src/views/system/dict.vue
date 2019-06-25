<template>
	<el-row :gutter="50" style="padding-left: 10px;">
		<el-col :span="5">
			<el-row style="margin-top: 10px;">
				<el-row>
					<el-button type="primary" icon="el-icon-plus" size="mini" @click="addDict">添加字典</el-button>
					<el-dropdown style="float: right;" @command="handleCommand">
						<el-button type="default" size="mini">
							更多操作<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="edit">编辑字典</el-dropdown-item>
							<el-dropdown-item command="delete">删除字典</el-dropdown-item>
							<el-dropdown-item command="flush">刷新</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-row>
				<el-row>
					<el-input style="margin-top: 10px;" size="mini" placeholder="输入搜索字典" prefix-icon="el-icon-search" v-model="searchDict">
					</el-input>
				</el-row>
			</el-row>
			<el-row style="margin-top: 20px;">
				<el-tree :data="dictList" :props="defaultProps" @node-click="changeNode">
				</el-tree>
			</el-row>
		</el-col>
		<el-col :span="19">
			<el-row style="margin-top: 10px;">
				<el-col :span="8">
					<el-button size="mini" icon="el-icon-plus" type="primary">添加数据</el-button>
					<el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
					<el-button size="mini" icon="el-icon-refresh" type="default">刷新</el-button>
				</el-col>
				<el-col :span="8">
					<el-input size="mini" placeholder="请输入内容" v-model="query.search">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<el-row style="margin-top: 20px;">
				<el-table :data="dictData" stripe size="mini" style="width: 100%">
					<el-table-column prop="id" label="id" width="180">
					</el-table-column>
					<el-table-column prop="title" label="名称" width="180">
					</el-table-column>
					<el-table-column prop="value" label="值">
					</el-table-column>
					<el-table-column prop="createBy" label="值">
					</el-table-column>
					<el-table-column prop="createTime" label="值">
					</el-table-column>
				</el-table>
			</el-row>
		</el-col>

		<el-dialog :title="dictTitle" :visible.sync="dictDialogVisible" width="30%">
			<el-form ref="form" :model="dict" label-width="80px" size="mini">
				<el-form-item label="编号">
					<el-input v-model="dict.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="dict.title"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-input v-model="dict.type"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input v-model="dict.sortOrder"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="dictSave">保存</el-button>
					<el-button @click="dictDialogVisible=false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</el-row>
</template>

<script>
	import {
		dicts,
		dictData
	} from "@/api/system/dict"
	export default {
		data() {
			return {
				query: {
					page: 1,
					size: 5,
					search: null
				},
				dictList: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				searchDict: '',
				dictData: [],
				dictTitle: "添加字典",
				dictDialogVisible: false,
				dict:{}
			}
		},
		created() {
			this.getDicts()
		},
		methods: {
			getDicts() {
				dicts().then(res => {
					this.dictList = res.data;
					this.getDictData(res.data[0].id)
				})
			},
			getDictData(id) {
				this.query.id = id;
				dictData(this.query).then(res => {
					this.dictData = res.data.list
				});
			},
			changeNode(val) {
				this.dict=val;
				this.getDictData(val.id)
			},
			addDict() {
				this.dict={}
				this.dictDialogVisible = true
			},
			handleCommand(e){
				switch(e){
					case 'edit':
						if(this.dict.id==null){
							this.$message({
								type: 'warning',
								message: '请选择要修改的记录！'
							});
							return
						}
						this.dictTitle='修改字典'
						this.dictDialogVisible=true
						break;
					case 'delete':
						if(this.dict.id==null){
							this.$message({
								type: 'warning',
								message: '请选择要删除的记录！'
							});
							return
						}
						this.$confirm('您确定要删除吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							//
						});
						break;
					case 'flush':
						this.getDicts()
						break;
				}
			},
			dictSave(){
				
			}
		}
	}
</script>

<style>
</style>
