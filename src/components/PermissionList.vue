<template>
  <el-table :data="permissionList" stripe style="width: 100%" align="center">
    <el-table-column type="index" width="80"> </el-table-column>
    <el-table-column prop="authName" label="权限名称" width="400">
    </el-table-column>
    <el-table-column prop="path" label="路径" width="400"> </el-table-column>
    <el-table-column prop="level" label="权限等级" width="400">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.level == 1 ? 'success' : (scope.row.level == 2 ? 'info' : '')"
          disable-transitions
          >
          {{scope.row.level == 1 ? '等级二' : (scope.row.level == 2 ? '等级三' : '等级一')}}
          </el-tag
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      permissionList: [],
    };
  },
  computed: {
      ccc(val) {
          if(val == 0) {
              return ''
          } else if (val == 1) {
              return 'success'
          } else {
              return 'info'
          }
      }
  },
  created() {
    this.$http.get("/rights/list").then((res) => {
      this.permissionList = res.data.data;
    });
  },
};
</script>

<style scoped>
</style>