<template>
	<el-container>
		<el-header>
			<el-row style="margin-top: 20px;">
				<el-button size="mini" type="primary" @click="addRegions">添加</el-button>
				<el-button size="mini" type="danger" @click="deleteRegions" :disabled="!formDisable">删除</el-button>
			</el-row>
		</el-header>
		<el-container>
			<el-aside width="200px" style="padding-left: 20px;">
				<el-card shadow="always" style="height: 450px;overflow: auto">
					<el-tree :data="RegionsTree" :props="defaultProps" accordion @node-click="handleNodeClick">
					</el-tree>
				</el-card>
			</el-aside>
			<el-main>
				<el-form size="mini" ref="form" :model="form" label-width="80px">
					<el-form-item label="编号">
						<el-input v-model="form.id" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="上级区域">
						<el-select v-model="form.parentId" filterable placeholder="请选择上级菜单" @change="selectChange">
							<el-option label="顶级区域" :value="0"></el-option>
							<el-option v-for="item in this.options" :label="item.localName" :value="item.id">
								<span :style="'display: inline-block;width:'+ item.levelStr+'px'"></span>
								<span>{{item.localName}}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="区域名称">
						<el-input v-model="form.localName" :disabled="formDisable"></el-input>
					</el-form-item>
					<el-form-item label="区域路径">
						<el-input v-model="form.regionPath" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="邮编">
						<el-input v-model="form.zipcode" :disabled="formDisable"></el-input>
					</el-form-item>
					<el-form-item label="区域负责人">
						<el-input v-model="form.adminUserName" :disabled="true" placeholder="请到用户管理中设置区域负责人"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="setEdit">{{btnTitle}}</el-button>
						<el-button type="primary" @click="onSubmit" :disabled="formDisable">保存</el-button>
					</el-form-item>
				</el-form>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import {
		nav,
		detail,
		saveOrUpdate,
		iconFont,
		regionsDelete
	} from "@/api/system/regions"
	export default {
		data() {
			return {
				options: [],
				level: 0, //计算区域等级
				form: {
					id: null,
					Regionstype: 0,
					regionPath: '',
				},
				formDisable: true,
				btnTitle: '修改',
				RegionsTree: [],
				iconFont: [],
				iconQuery: {
					page: 1,
					size: 200
				},
				iconTotal: 0,
				dialogIconVisible: false,
				defaultProps: {
					children: 'children',
					label: 'localName'
				}
			};
		},
		created() {
			this.getRegionsTree();

		},
		methods: {
			//遍历树
			treeSelect(tree) {
				for (var i = 0; i < tree.length; i++) {
					this.level = (tree[i].regionPath.split(',')).length - 3;
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
			handleNodeClick(data) {
				this.form = data;
			},
			handleCurrentChange() {
				this.getIconFont()
			},
			setEdit() {
				if (this.btnTitle == '修改') {
					this.formDisable = false
					this.btnTitle = '取消';
				} else {
					this.formDisable = true
					this.btnTitle = '修改';
				}
			},
			selectChange(value) {
				for (var i = 0; i < this.options.length; i++) {
					if (value == this.options[i].id) {
						this.form.regionPath = this.options[i].regionPath;
					}
				}
			},
			getRegionsTree() {
				nav().then(res => {
					this.RegionsTree = res.data;
					this.treeSelect(this.RegionsTree);
				})
			},

			chooseIcon() {
				this.dialogIconVisible = true
			},
			setIcon(name) {
				this.form.icon = 'fa ' + name + ' fa-lg';
				this.dialogIconVisible = false
			},
			addRegions() {
				this.form = {};
				this.formDisable = false
			},
			deleteRegions() {
				if (this.form.id != null && this.form.children == null) {
					this.$confirm('您确定要删除"' + this.form.localName + '"吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						regionsDelete(this.form).then(res => {
							this.$message({
								type: 'success',
								message: res.msg
							});
							this.getRegionsTree();
						}).catch(e => {})
					}).catch(e => {

					});
				} else if (this.form.id != null && this.form.children.length != 0) {
					this.$alert('该区域有下级区域，请先删除下级区域', '提示', {
						confirmButtonText: '确定',
					});
				} else {
					this.$alert('请先选择一个要删除的区域', '提示', {
						confirmButtonText: '确定',
					});
				}

			},
			onSubmit() {
				saveOrUpdate(this.form).then(res => {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.formDisable = true
					this.btnTitle = '修改';
					this.getRegionsTree()
				})
			}
		}
	};
</script>

<style>
	.el-dialog__body {
		padding: 0px 15px 30px;
	}
</style>
