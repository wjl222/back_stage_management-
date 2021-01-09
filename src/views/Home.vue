<template>
  <div class="home">
    <el-container>
      <el-header>
        <h2>Vue商城后台管理系统</h2>
        <el-button type="info" class="login_out" @click="loginOut">退出</el-button>
      </el-header>
      <el-container class="contain">
        <!-- 中间使用了layui布局 -->
        <el-row>
          <el-col class="left_silde" :span="navIsCollapse? 1 : 3">
            <el-aside width="90%">
              <Nav @changeCollapse = 'changeCollapse' @nowClickItemId='nowClickItemId' :navlistitem="navList" />
            </el-aside>
          </el-col>
          <el-col class="right_silde" :span="navIsCollapse ? 23 : 21">
            <el-main>
              <router-view></router-view>
            </el-main>
          </el-col>
        </el-row>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Nav from "./Nav";

export default {
  data() {
    return {
      navList: [],
      navIsCollapse:''
    };
  },

  components: {
    Nav,
  },
  methods: {
    changeCollapse(val) {
      this.navIsCollapse = val
    },
    nowClickItemId(val) {
      this.$router.push('/home/'+val)
    },
    loginOut() {
      window.sessionStorage.removeItem('token');
      this.$router.push('/login')
    }
  },
  created() {
    // 请求nav的数据
    this.$http
      .get("/menus")
      .then((res) => {
        this.navList = res.data.data;
      })
      .catch((err) => {
        console.log("err");
      });
  },
};
</script>

<style scoped>
.home,
.home > .el-container,
.left_silde {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(40, 42, 61);
  color: #fff;
}

.login_out {
  width: 60px;
  height: 30px;
  line-height: 30px;
  padding: 0;
  font-size: 12px;
  color: #000;
  background-color: rgb(194, 194, 194);
}

.el-row {
  width: 100%;
}

.contain {
  height: 100%;
}

.left_silde {
  background-color: rgb(40, 42, 61);
}

.left_silde .el-aside {
  margin: auto;
}
</style>