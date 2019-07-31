<template>
  <div>
    <el-container>
      <el-header style="margin: 10px;height: 30px;">
        <el-button size="medium" type="primary" round>新增</el-button>
        <el-button size="medium" type="danger" round>删除</el-button>
      </el-header>

      <el-main>
        <el-table :data="members" stripe border style="width: 100%" highlight-current-row>
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="memberId" label="编号" width="180" align="center"></el-table-column>
          <el-table-column prop="userName" label="姓名" width="180" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column prop="idcard" label="身份证" align="center"></el-table-column>
          <el-table-column prop="regtime" label="注册时间" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.phone)">查看详情</el-button>
              <el-button @click="modifyUser(scope.row.phone)">修改</el-button>
              <el-button @click="deleteUser(scope.row.phone)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="getList"
          :current-page.sync="query.page"
          :total="total"
        ></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { memberPage } from "@/api/member/member.js";
export default {
  data() {
    return {
      members: [],
      query: {
        page: 1,
        size: 10
      },
      total: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      memberPage(this.query).then(result => {
        this.members = result.data.list;
        this.total = result.data.total;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
