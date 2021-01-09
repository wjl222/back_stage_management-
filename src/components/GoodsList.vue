<template>
  <div v-if="!isAddGoods">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin: 30px 0px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div class="search_con">
      <el-input
        placeholder="请输入内容"
        v-model="seachInputVal"
        clearable
        @clear="clearSearch"
        @input="inputChange"
      >
      </el-input>

      <!-- 搜索框 -->
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="seachInput"
      ></el-button>
      <el-button type="primary" @click="isAddGoods = !isAddGoods"
        >添加商品</el-button
      >
    </div>
    <el-table
      :data="
        showGoodsList.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 100%"
    >
      <el-table-column prop="goods_name" label="商品名称" width="650">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格（元）" width="100">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100">
      </el-table-column>
      <el-table-column prop="upd_time" label="创建时间" width="200">
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

          <!-- 修改的弹窗 -->
          <el-dialog title="修改商品" :visible.sync="formVisible">
            <el-form :model="needBeChangInfo">
              <el-form-item label="商品名称" :label-width="formLabelWidth">
                <el-input
                  v-model="needBeChangInfo.goods_name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品价格（元）"
                :label-width="formLabelWidth"
                :rules="[{ required: true }]"
              >
                <el-input
                  v-model="needBeChangInfo.goods_price"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品重量"
                :label-width="formLabelWidth"
                :rules="[{ required: true }]"
              >
                <el-input
                  v-model="needBeChangInfo.goods_weight"
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

  <div v-else>
    <div>
      <el-container>
        <el-header height="100px">
          <el-alert
            class="top_warning_text"
            title="警告提示的文案"
            type="warning"
            show-icon
          >
          </el-alert>
          <el-steps
            :active="stepsActive"
            finish-status="success"
            class="stepCon"
            :align-center="true"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品信息"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-header>
        <el-main>
          <el-form ref="form" :model="newgood">
            <el-tabs
              tab-position="left"
              @tab-click="goStep"
              :stretch="true"
              :before-leave="tabLeaveEvent"
              v-model="nowSelectTabName"
            >
              <!-- 基本信息 -->
              <el-tab-pane label="基本信息" name="good_basic_info">
                <el-form-item label="商品名称" :required="true">
                  <el-input v-model="newgood.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" :required="true">
                  <el-input v-model="newgood.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" :required="true">
                  <el-input v-model="newgood.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" :required="true">
                  <el-input v-model="newgood.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" :required="true">
                  <el-cascader
                    v-model="newGoodCategories"
                    :options="goodsCategory"
                    :props="defaultParams"
                  ></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <!-- 商品参数 -->
              <el-tab-pane label="商品参数" name="good_params">
                <div
                  v-for="(item, index) in newGoodCategoriesVal.many"
                  :key="index"
                >
                  <h4>{{ item.attr_name }}</h4>
                  <div>
                    <el-checkbox-group v-model="newSelectManyParams[index]">
                      <el-checkbox
                        v-for="(items, index) in item.attr_vals"
                        :label="items"
                        border
                        :key="index"
                      ></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-tab-pane>
              <!-- 商品属性 -->
              <el-tab-pane label="商品属性" name="good_attr">
                <div
                  v-for="(item, index) in newGoodCategoriesVal.only"
                  :key="index"
                >
                  <h3>{{ item.attr_name }}</h3>
                  <el-input v-model="newSelectOnlyParams[index]"> </el-input>
                </div>
              </el-tab-pane>
              <!-- 商品图片 -->
              <el-tab-pane label="商品图片" name="good_img">
                <el-upload
                  class="upload-demo"
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  list-type="picture"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :headers="subHeader"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="good_comment">
                商品内容
                <el-button type="primary" @click="isAddGoods = !isAddGoods">
                  提交商品
                </el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAddGoods: true,
      seachInputVal: "",
      goodsList: [],
      showGoodsList: [],
      formVisible: false, // 修改的form的显示状态
      formLabelWidth: "120px", // 修改的form的宽度
      currentPage: 1,
      pagesize: 10, //    每页的数据
      total: 0, // 总共的条数
      newGoodCategories: [], // 新添加的产品的id数组
      newgood: {
        goods_name: "",
        goods_cat: "", // 以','分割的分类列表
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "", // 上传的图片临时路径（对象）
        attrs: "", // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      needBeChangInfo: {
        // 双向绑定需要改变的值
      },
      stepsActive: 0, // 当前激活的步骤
      goodsCategory: [], // 初始化的分类值
      categories: [], // 当前产品选中的分类值
      defaultParams: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      }, // select的默认选项
      // 当前添加商品进行的步数的name
      nowSelectTabName: "good_basic_info",
      // 新增商品的参数列表,经过处理的数组
      newGoodCategoriesVal: {
        many: [],
        only: [],
      },
      // 新选中的属性的数组
      newSelectManyParams: [],
      newSelectOnlyParams: "",
      subHeader: {
        Authorization: window.sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.initMsg(1, this.pagesize);
    this.initGoodsCategory();
  },
  methods: {
    // 接收数据
    initMsg(nowPage = 1, pages = 10) {
      this.$http
        .get("/goods", { params: { pagenum: nowPage, pagesize: pages } })
        .then((res) => {
          let users = res.data.data.goods;
          // 处理时间戳
          const newUsers = users.map((item, index) => {
            let newTime = new Date(item["upd_time"]).toLocaleString();
            item["upd_time"] = newTime;
            return item;
          });
          this.goodsList = newUsers;
          // 初始化总页数
          this.total = res.data.data.total;
          this.showGoodsList = this.goodsList;
        });
    },
    //接收分类
    initGoodsCategory() {
      this.$http.get("categories").then((res) => {
        this.goodsCategory = res.data.data;
        console.log(res);
      });
    },
    // 筛选
    seachInput() {
      let _search = this.seachInputVal;
      if (_search) {
        this.showGoodsList = this.goodsList.filter(function (item) {
          if (item.goods_name.match(_search)) {
            return item;
          }
        });
      } else {
        this.showGoodsList = this.goodsList;
      }
    },

    // 清除筛选
    clearSearch() {
      this.showGoodsList = this.goodsList;
    },
    // 筛选,当输入框没有内容,归零
    inputChange() {
      if (!this.seachInputVal) {
        this.clearSearch();
      }
    },
    // 改变选中用户信息,未完成。。。。。
    changeFormVisible(index) {
      this.needBeChangInfo = {
        ...this.goodsList[index],
      };
      this.formVisible = !this.formVisible;
    },
    // 确定修改用户信息
    sureChangeFormVisible() {
      this.formVisible = !this.formVisible;
      const url = "goods/" + this.needBeChangInfo.goods_id;
      const {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs,
      } = this.needBeChangInfo;
      const data = {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs,
      };
      this.$http.put(url, data).then((res) => {
        // 更新页面
        console.log(res);
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
          const url = "goods/" + this.goodsList[index].goods_id;
          this.$http
            .delete(url)
            .then((res) => {
              this.initMsg();
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

    // 当前
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      this.initMsg(currentPage, this.pagesize);
    },

    // 条状页面
    goStep(event) {
      if (this.tabLeaveEvent()) {
        this.stepsActive = +event.index;
      }
    },
    // tab栏切换前判断是否分类
    tabLeaveEvent(activeName, oldActiveName) {
      if (!this.newGoodCategories.length) {
        this.$message({
          type: "warning",
          message: "请先选择产品分类",
        });
      } else {
        if (activeName === "good_params") {
          this.$http
            .get("categories/" + this.newGoodCategories[2] + "/attributes", {
              params: { sel: "many" },
            })
            .then((res) => {
              const resData = res.data.data;
              this.newGoodCategoriesVal.many = resData.map((item) => {
                const obj = {};
                obj.attr_name = item.attr_name;
                // 这里的属性val是字符串，我们需要的是数组
                obj.attr_vals = item.attr_vals
                  .split(",")
                  .filter((item) => item != "");
                return obj;
              });
              // 默认全部选中
              this.newSelectManyParams = this.newGoodCategoriesVal.many.map(
                (res) => {
                  return res.attr_vals;
                }
              );
            });
        } else if (activeName === "good_attr") {
          this.$http
            .get("categories/" + this.newGoodCategories[2] + "/attributes", {
              params: { sel: "only" },
            })
            .then((res) => {
              const resData = res.data.data;
              this.newGoodCategoriesVal.only = resData.map((item) => {
                const obj = {};
                obj.attr_name = item.attr_name;
                obj.attr_vals = item.attr_vals;
                return obj;
              });
              this.newSelectOnlyParams = this.newGoodCategoriesVal.only.map(
                (res) => res.attr_vals
              );
            });
        }
      }
      return !!this.newGoodCategories.length;
    },
    // 处理图片移除的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 处理图片放大展示的事件
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>

<style>
.warning.top_warning_text {
  padding: 10px 0;
  width: 100%;
  color: #909399;
  text-align: center;
  background-color: #f2f6fc;
}
.search_con {
  width: 600px;
}

.el-table-column {
  text-align: center;
}

/* 修改step样式 */

.stepCon {
  margin-top: 10px;
  width: 1000px;
  height: 60px;
}

/* 数字 */
.el-step__icon-inner {
  font-weight: 500;
}
/* 圆圈 */
.el-step__icon {
  width: 20px;
  height: 20px;
}
/* 直线 */
.el-step.is-horizontal .el-step__line {
  height: 1px;
}
</style>