<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addRole = !addRole">添加角色</el-button>

    <!-- 添加角色的弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRole">
      <el-form :model="newRole">
        <el-form-item
          label="角色名称"
          :label-width="newRoleFormWidth"
          :required="true"
        >
          <el-input v-model="newRole.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="newRoleFormWidth">
          <el-input v-model="newRole.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRole = false">取 消</el-button>
        <el-button type="primary" @click="sureAddRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="roleList" style="width: 100%" align="center">
      <!-- 下拉列表书写 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="item in scope.row.children"
            :key="item.id"
            type="flex"
            align="middle"
          >
            <span> </span>
            <el-col :span="12">
              <!-- 数据第一层嵌套 -->
              <el-tag @close="handleDelete(scope.row.id, item.id)" closable>
                {{ item.authName }}
              </el-tag>
            </el-col>
            <!-- 数据第二层嵌套 -->

            <el-col :span="12">
              <el-row
                v-for="item2 in item.children"
                :key="item2.id"
                align="middle"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    align="center"
                    @close="handleDelete(scope.row.id, item2.id)"
                    closable
                  >
                    {{ item2.authName }}
                  </el-tag>
                </el-col>

                <el-col class="tagItem3" :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="info"
                    @close="handleDelete(scope.row.id, item3.id)"
                    closable
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- 表格每一列 -->
      <el-table-column type="index" width="180"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="300">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300">
      </el-table-column>
      <!-- 操作的列 -->
      <el-table-column label="操作" width="440">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editBtnClick(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteBtnClick(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-setting"
            @click="assignRoles(scope.row)"
            >分配角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑角色的按钮 -->
    <el-dialog title="编辑角色" :visible.sync="editVisible">
      <el-form :model="editRole">
        <el-form-item label="角色名称" :label-width="newRoleFormWidth">
          <el-input
            v-model="editRole.needEideRoleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="newRoleFormWidth">
          <el-input
            v-model="editRole.needEideRoleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除角色的按钮 -->
    <el-dialog title="提示" :visible.sync="deleteRoleVisible" width="30%">
      <span>是否确定删除该角色？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureDeleteRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出 -->
    <el-dialog :visible.sync="assignRolesVisible" width="30%" @close='closeRolePermission' closed>
      <el-tree
        show-checkbox
        default-expand-all
        :data="permissionList"
        :props="defaultProps"
        ref="roleTree"
        @node-click="handleNodeClick"
        :default-checked-keys="nowRolePermissionListId"
        node-key="id"
        v-if='sss'
        
      ></el-tree>
      <el-button @click="assignRolesVisible = false">返回</el-button>
      <el-button type="primary" @click="sureChangeRolePermission"
        >确定</el-button
      >
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      sss: true,
      roleList: [],
      addRole: false,
      newRole: {
        roleName: "",
        roleDesc: "",
      },
      newRoleFormWidth: "120px",
      editVisible: false,
      editRole: {
        needEideRoleId: "",
        needEideRoleName: "",
        needEideRoleDesc: "",
      },
      deleteRoleVisible: false,
      deleteRole: {
        id: "",
      },
      permissionList: [],
      // 传入树形结构的属性
      defaultProps: {
        children: "children",
        label: "authName",
      },
      assignRolesVisible: false,
      // 当前选中的需要分配权限的项，目前已有的选项
      nowRolePermissionList: [],
      // 默认选中的所有数值id
      nowRolePermissionListId: [],
      // 当前修改权限项的id唯一值
      nowSelectChangePermissionRoleId: "",
    };
  },
  created() {
    this.initMessage();
    this.initPermissionList();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    initMessage() {
      // 获取人员信息及权限
      this.$http.get("/roles").then((res) => {
        this.roleList = res.data.data;
      });
    },
    initPermissionList() {
      // 获取整个权限分配的列表
      this.$http.get("/rights/tree").then((res) => {
        this.permissionList = res.data.data;
      });
    },

    handleDelete(userId, permissionId) {
      let url = "roles/" + userId + "/rights/" + permissionId;
      this.$http.delete(url).then((res) => {
        this.initMessage();
      });
    },
    // 添加角色
    sureAddRole() {
      this.addRole = false;
      this.$http
        .post("/roles", {
          roleName: this.newRole.roleName,
          roleDesc: this.newRole.roleDesc,
        })
        .then((res) => {
          this.initMessage();
          this.newRole.roleName = "";
          this.newRole.roleDesc = "";
        });
    },
    // 点击编辑按钮
    editBtnClick(role) {
      this.editVisible = !this.editVisible;
      // 将被点击的按钮行中的数据与其同步
      this.editRole.id = role.id;
      this.editRole.needEideRoleName = role.roleName;
      this.editRole.needEideRoleDesc = role.roleDesc;
    },
    // 确认修改
    sureEditRole() {
      let url = "/roles/" + this.editRole.id;
      let params = {
        roleName: this.editRole.needEideRoleName,
        roleDesc: this.editRole.needEideRoleDesc,
      };
      this.$http.put(url, params).then((res) => {
        this.editVisible = !this.editVisible;
        if (res.data.meta.msg === "获取成功") {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      });
    },

    // 删除按键
    deleteBtnClick(role) {
      this.deleteRoleVisible = !this.deleteRoleVisible;
      // 保存当前需要删除的id
      this.deleteRole.id = role.id;
    },
    // 确定删除
    sureDeleteRole() {
      const url = "/roles/" + this.deleteRole.id;
      this.$http
        .delete(url)
        .then((res) => {
          if (res.data.meta.msg === "删除成功") {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.initMessage();
            this.initPermissionList();
          }
        })
        .catch((err) => {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        });

      this.deleteRoleVisible = !this.deleteRoleVisible;
    },
    //取消分配 
    cancel() {
    },

    closeRolePermission() {
      this.sss = false
    },

    // 分配角色
    assignRoles(role) {
      this.sss = true;
      //记录当前选中的id
      this.nowSelectChangePermissionRoleId = role.id;
      this.assignRolesVisible = !this.assignRolesVisible;
      this.nowRolePermissionList = role.children;
      this.getNowRolePermissionListId(this.nowRolePermissionList);
    },
    // 取出被选中的权限的id
    getNowRolePermissionListId(arr) {
      this.nowRolePermissionListId = [];
      console.log(this.nowRolePermissionListId);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id) {
          this.nowRolePermissionListId.push(arr[i].id);
        }
        if (arr[i].children) {
          this.getNowRolePermissionListId(arr[i].children);
        }
      }
    },
    // 确定修改权限
    sureChangeRolePermission() {
      const url = "/roles/" + this.nowSelectChangePermissionRoleId + "/rights";
      // 获取所有新选取的选项的id
      //const newSelectPermissionIds = this.$refs.roleTree.getCheckedKeys().join(',');
      const arr = [
        ...this.$refs.roleTree.getHalfCheckedKeys(),
        ...this.$refs.roleTree.getCheckedKeys(),
      ].join(",");
      // console.log( newSelectPermissionIds);
      //  所有的选项需要是字符串，并以，分割。
      this.$http
        .post(url, { rids: arr })
        .then((res) => {
          if ((res.data.meta.msg = "更新成功")) {
            this.$message("更新成功");
            // 更新数据
            this.initMessage();
            this.initPermissionList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // 关闭窗口
      this.assignRolesVisible = false;
    },
  }
};
</script>

<style scoped>
.el-table {
  overflow: hidden;
}

/* .el-col span {
  margin: 0 10px;
} */
.el-col > span,
.el-col > div {
  margin: 10px 0;
}

.tagItem3 {
  display: flex;
}
</style>