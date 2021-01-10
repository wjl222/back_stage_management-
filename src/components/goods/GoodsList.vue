<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
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
      <el-button type="primary" @click="addGoodBtn"
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
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seachInputVal: "",
      goodsList: [],
      showGoodsList: [],
      formVisible: false, // 修改的form的显示状态
      formLabelWidth: "120px", // 修改的form的宽度
      currentPage: 1,
      pagesize: 10, //    每页的数据
      total: 0, // 总共的条数

      needBeChangInfo: {
        // 双向绑定需要改变的值
      }
    };
  },
  created() {
    this.initMsg(1, this.pagesize);
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
    // 添加商品按钮
    addGoodBtn() {
      this.$router.push('/goodslist/addGood');

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
    }
  },
};
</script>

<style scoped>

.search_con {
  width: 600px;
}

.el-table-column {
  text-align: center;
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