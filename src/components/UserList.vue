<template>
  <div>
    <!-- 搜索框 -->
    <div class="search_con">
      <el-input
        placeholder="请输入内容"
        v-model="seachInputVal"
        clearable
        @clear="clearSearch"
        @input='inputChange'
      >
      </el-input>

      <!-- 搜索框 -->
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="seachInput"
      ></el-button>
      <el-button type="primary" @click="addNewUser">添加用户</el-button>

      <!-- 添加用户的弹出框 -->
      <el-dialog title="收货地址" :visible.sync="newUser.isShow">
        <el-form :model="newUser.nowChangeIndex">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            :rules="[{ required: true }]"
          >
            <el-input v-model="newUser.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            :rules="[{ required: true }]"
          >
            <el-input v-model="newUser.pwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="newUser.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="newUser.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newUser.isShow = !newUser.isShow">取 消</el-button>
          <el-button type="primary" @click="sendAddNewUserRequest"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <el-table
      :data="
        showUserList.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%"
    >
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200">
      </el-table-column>
      <el-table-column prop="role_name" label="角色" width="200">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="200">
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="userList[scope.$index]['mg_state']"
            @change="changMgState(scope.$index)"
            active-color="#13ce66"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="changeFormVisible(scope.$index)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUser(scope.$index)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="setUser"
          ></el-button>

          <!-- 修改的弹窗 -->
          <el-dialog title="收货地址" :visible.sync="formVisible">
            <el-form :model="userList[nowChangeIndex]">
              <el-form-item label="id" :label-width="formLabelWidth">
                <el-input
                  v-model="userList[nowChangeIndex].id"
                  autocomplete="off"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item
                label="邮箱"
                :label-width="formLabelWidth"
                :rules="[{ required: true }]"
              >
                <el-input
                  v-model="needBeChangInfo.email"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="手机"
                :label-width="formLabelWidth"
                :rules="[{ required: true }]"
              >
                <el-input
                  v-model="needBeChangInfo.mobile"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="sureChangeFormVisible(scope.$index)"
                >确 定</el-button
              >
            </div>
          </el-dialog>

          <!-- 删除的弹窗 -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部的分页 -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seachInputVal: "",
      userList: [],
      showUserList: [],
      formVisible: false, // 修改的form的显示状态
      formLabelWidth: "120px", // 修改的form的宽度
      nowChangeIndex: 0, // 当前修改显示的组的序号
      currentPage: 1,
      pagesize: 10, //    每页的数据
      total: 0, // 总共的条数
      newUser: {
        username: "",
        pwd: "",
        email: "",
        mobile: "",
        isShow: false,
      },
      needBeChangInfo: {
        // 双向绑定需要改变的值
        email: "",
        mobile: "",
      },
    };
  },
  computed: {
  },
  methods: {
    // 接收数据
    initMsg(nowPage, pages) {
      this.$http
        .get("/users", { params: { pagenum: nowPage, pagesize: pages } })
        .then((res) => {
          let users = res.data.data.users;
          // 处理时间戳
          const newUsers = users.map((item, index) => {
            let newTime = new Date(item["create_time"]).toLocaleString();
            item["create_time"] = newTime;
            return item;
          });
          this.userList = newUsers;
          // 初始化总页数
          this.total = res.data.data.total;
          this.showUserList = this.userList;
        });
    },
    // 筛选
    seachInput() {
      let _search = this.seachInputVal;
      if (_search) {
        this.showUserList = this.userList.filter(function (item) {
          if (item.username === _search) {
            return item;
          }
        });
      } else {
        this.showUserList = this.userList;
      }
    },

    // 清除筛选 
    clearSearch() {
        this.showUserList = this.userList;
    },

    // 筛选,当输入框没有内容,归零
    inputChange() {
      if(!this.seachInputVal) {
        this.clearSearch()
      }
    },

    addNewUser() {
      this.newUser.isShow = true;
    },
    sendAddNewUserRequest() {
      const url = "users";
      this.$http
        .post(url, {
          username: this.newUser.username,
          password: this.newUser.pwd,
          email: this.newUser.email,
          mobile: this.newUser.mobile,
        })
        .then((res) => {
          if (res.data.data) {
            this.newUser.isShow = !this.newUser.isShow;
            this.initMsg(this.currentPage, this.pagesize);
            this.newUser = {
              username: "",
              pwd: "",
              email: "",
              mobile: "",
              isShow: false,
            };
          } else {
            this.$message({
              type: "error",
              message: res.data.meta.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 改变状态的按钮
    changMgState(index) {
      // 获取到当前改变管理状态的项目；
      let nowUserState = this.userList[index].mg_state;
      let nowUserId = this.userList[index].id;
      const url = "users/" + nowUserId + "/state/" + nowUserState;
      this.$http({
        method: "put",
        url,
      });
    },
    // 改变选中用户信息
    changeFormVisible(index) {
      this.needBeChangInfo = {
        ...this.userList[index],
      };
      this.formVisible = !this.formVisible;
    },
    // 确定修改用户信息
    sureChangeFormVisible(index) {
      this.formVisible = !this.formVisible;
      const url = "users/" + this.needBeChangInfo.id;
      this.$http
        .put(url, {
          email: this.needBeChangInfo.email,
          mobile: this.needBeChangInfo.mobile,
        })
        .then((res) => {
          // 更新页面
          this.initMsg(this.currentPage, this.pagesize);
        });
    },
    // 删除当前用户信息
    deleteUser(index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          const url = "users/" + this.userList[index].id;
          this.$http
            .delete(url)
            .then((res) => {
              this.userList.splice(index, 1);
            })
            .then((res) => {
              this.initMsg(this.currentPage, this.pagesize);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分配角色
    setUser() {},
    // 当前
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      this.initMsg(currentPage, this.pagesize);
    },
  },
  created() {
    this.initMsg(1, this.pagesize);
  },
};
</script>

<style>
.search_con {
  width: 600px;
}

.search_con .el-input {
  width: 300px;
  border-radius: 0;
}

.el-table-column {
  text-align: center;
}
</style>