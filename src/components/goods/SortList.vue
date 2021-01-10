<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- alert提醒 -->
    <el-alert
      title="注意：只允许第三级分类设置相关参数"
      type="warning"
      show-icon
    >
    </el-alert>
    <div class="selectClassifyCon">
      选择商品分类：
      <el-cascader
        v-model="newSelectGoodCategories"
        :options="goodsCategory"
        :props="defaultParams"
        @change="requestNowSelectParams"
      ></el-cascader>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addParam"
            type="primary"
            :disabled="isAddBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="tabArrMany" style="width: 100%">
            <el-table-column type="expand" width="80">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, index) in tabArrVal[scope.$index]"
                  @close="deleteItemVal(scope.row, scope.$index, index)"
                  :key="index"
                  closable
                >
                  {{ tag }}
                </el-tag>
                <!-- 增加参数的按钮 -->
                <el-input
                  class="addTagValInput"
                  v-if="inputVisible"
                  v-model="addTagVal[scope.$index]"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="addTagValE(scope.row, scope.$index)"
                  @blur="addTagValE(scope.row, scope.$index)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="280">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParam(scope.row)"
                >
                  <i class="el-icon-edit"></i>
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParam(scope.row)"
                >
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addParam"
            type="primary"
            :disabled="isAddBtnDisabled"
            >添加参数</el-button
          >
          <!-- 展示信息的table -->
          <el-table :data="tabArrOnly" style="width: 100%">
            <el-table-column type="expand" width="80">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, index) in tabArrVal[scope.$index]"
                  @close="deleteItemVal(scope.row, scope.$index, index)"
                  :key="index"
                  closable
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="addTagValInput"
                  v-if="inputVisible"
                  v-model="addTagVal[scope.$index]"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="addTagValE(scope.row, scope.$index)"
                  @blur="addTagValE(scope.row, scope.$index)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="280">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParam(scope.row)"
                >
                  <i class="el-icon-edit"></i>
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParam(scope.row)"
                >
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 修改参数的弹窗 -->
    <el-dialog title="修改参数" :visible.sync="editDialogFormVisible">
      <el-form :model="editDialogForm" ref="editDialogForm">
        <el-form-item label="参数名称" label-width="120px" required>
          <el-input v-model="editDialogForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditParam">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加动态属性的弹窗 -->
    <el-dialog title="添加参数" :visible.sync="addDialogFormVisible">
      <el-form :model="addDialogForm" :rules="rules" ref="addDialogForm">
        <el-form-item
          :label="activeName === 'only' ? '静态参数' : '动态参数'"
          label-width="120px"
          required
          porps="paramName"
        >
          <el-input v-model="addDialogForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddParam">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 添加表单验证
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入内容"));
      } else {
        if (this.addDialogForm.name !== "") {
          this.$refs.addDialogForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      activeName: "many",
      // 新选中产品的id数组
      newSelectGoodCategories: [],
      goodsCategory: [],
      // select的默认选项
      defaultParams: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 静态参数的参数值
      tabArrOnly: [],
      // 动态参数展示
      tabArrMany: [],
      tabArrVal: [],
      // 新增tag值
      addTagVal: [],
      addParamVisible: false,
      // 控制tag标签后面的input显示
      inputVisible: false,
      formLabelWidth: "120px",
      // 增加属性的弹出框相关值
      addDialogFormVisible: false,
      addDialogForm: {
        name: "",
      },
      // 表单验证规则
      rules: {
        paramName: [{ validator: validatePass, trigger: "blur" }],
      },
      // 修改参数的弹窗显示
      editDialogFormVisible: false,
      editDialogForm: {
        editParamId: "",
        name: "",
      },
      // 下拉列表的tag内容
      expandContent: [],
    };
  },
  created() {
    this.initGoodsCategory();
  },
  methods: {
    //接收分类，初始化三级选项的数据
    initGoodsCategory() {
      this.$http.get("categories").then((res) => {
        this.goodsCategory = res.data.data;
      });
    },
    // 发送请求当前分类的部分，在选择具体分类时显示
    requestNowSelectParams() {
      // 初始化获取到的信息
      let getInfo;
      const url =
        "categories/" + this.newSelectGoodCategories[2] + "/attributes";

      this.$http.get(url, { params: { sel: this.activeName } }).then((res) => {
        if (this.activeName == "many") {
          this.tabArrMany = res.data.data;
          this.tabArrOnly = [];
          getInfo = this.tabArrMany;
        } else {
          this.tabArrOnly = res.data.data;
          this.tabArrMany = [];
          getInfo = this.tabArrOnly;
        }

        // 初始化Tag中的val，因为其为字符串，展示需要数组。
        const newArr = getInfo.map((item, index) => {
          return item.attr_vals.split(",").filter((items) => {
            return items != "";
          });
        });
        this.tabArrVal = newArr;
      });
    },

    // 处理动态属性和静态属性tab切换的点击事件
    handleTabClick() {
      // 判断是否有商品被选中
      if (this.newSelectGoodCategories) {
        this.requestNowSelectParams();
      }
    },

    // 添加参数按钮，弹出操作框
    addParam() {
      this.addDialogFormVisible = !this.addDialogFormVisible;
    },

    // 添加参数，并发送添加参数请求
    sureAddParam() {
      this.$refs.addDialogForm.validate((valid) => {
        if (valid) {
          this.addDialogFormVisible = false;
          const url =
            "categories/" + this.newSelectGoodCategories[2] + "/attributes";
          const params = {
            attr_name: this.addDialogForm.name,
            attr_sel: this.activeName,
          };
          this.$http.post(url, params).then((res) => {
            if (res.data.meta.status == "201") {
              // 请求成功弹窗
              this.$message({
                message: "添加成功",
                type: "success",
              });
              // 清空input
              this.addDialogForm.name = "";
              // 重新请求
              this.requestNowSelectParams();
            }
          });
        } else {
          this.$message({
            message: "输入错误，请重新输入",
          });
        }
      });
    },

    // 修改参数按钮，弹出操作框
    editParam(item) {
      this.editDialogFormVisible = !this.editDialogFormVisible;
      this.editDialogForm.name = item.attr_name;
      //保存当前选中的id
      this.editDialogForm.editParamId = item.attr_id;
    },
    // 修改参数名称，提交请求
    sureEditParam() {
      const url =
        "categories/" +
        this.newSelectGoodCategories[2] +
        "/attributes/" +
        this.editDialogForm.editParamId;
      const params = {
        attr_name: this.editDialogForm.name,
        attr_sel: this.activeName,
      };
      this.$http.put(url, params).then((res) => {
        this.editDialogFormVisible = false;
        this.requestNowSelectParams();
        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: "更新成功",
          });
        } else {
          this.$message({
            type: "warning",
            message: "更新成功",
          });
        }
      });
    },
    // 删除整个参数的按键
    deleteParam(item) {
      this.$confirm("你将删除该项参数，是否确认？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url =
            "categories/" +
            this.newSelectGoodCategories[2] +
            "/attributes/" +
            item.attr_id;

          this.$http.delete(url).then((res) => {
            if (res.data.meta == 200) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
            }
            // 刷新列表
            this.requestNowSelectParams();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 提交属性的修改，发送网络请求，分贝是新增属性和删除属性
    submitTagValChange(needChangeItem, needChangeItemIndex) {
      const strVal = this.tabArrVal[needChangeItemIndex]
        .reduce((n, p) => {
          return n + p + ",";
        }, "")
        .slice(0, -1);
      const url = `categories/${this.newSelectGoodCategories[2]}/attributes/${needChangeItem.attr_id}`;
      const params = {
        attr_name: needChangeItem.attr_name,
        attr_sel: this.activeName,
        attr_vals: strVal,
      };
      this.$http.put(url, params);
    },
    // 新增属性
    addTagValE(item, index) {
      // 判断新增加内容是否为空
      if (this.addTagVal[index]) {
        // 往当前的数组中增加；
        this.tabArrVal[index].push(this.addTagVal[index]);
        // 发送修改请求
        this.submitTagValChange(item, index);
        this.addTagVal[index] = "";
      }
      this.inputVisible = false;
    },
    // 删除属性 item是当前要删除的具体信息，itemindex是他在整个数组中的序号，tagindex是标签的需要
    deleteItemVal(item, itemIndex, tagIndex) {
      this.tabArrVal[itemIndex].splice(tagIndex, 1);
      this.submitTagValChange(item, itemIndex);
    },
    // 处理tag标签后面的框的事件
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  computed: {
    isAddBtnDisabled() {
      if (this.newSelectGoodCategories.length == 3) {
        return false;
      } else {
        return "disabled";
      }
    },
  },
  filters: {},
};
</script>

<style scoped>
.el-alert {
  font-size: 12px;
  padding: 10px 10px;
  margin-bottom: 20px;
  color: #e6a23c;
  background-color: #e6a23c32;
}

.el-tag {
  margin: 0 10px;
}

.selectClassifyCon {
  margin-bottom: 20px;
}

.addTagValInput {
  width: 130px;
}

.el-table {
  margin-top: 20px;
}
</style>