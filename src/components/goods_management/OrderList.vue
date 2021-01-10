<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <el-input
          v-model="inputVal"
          placeholder="请输入内容"
          class="inputBox"
          @input="filterContentInput"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="filterList"
          ></el-button>
        </el-input>
      </div>

      <el-table :data="filterDataList" style="width: 100%">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="280">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款"> </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              class="el-icon-location-information"
              @click="logisticsInfoeditDelogVisable = true"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 物流信息对话框 -->
      <el-dialog title="物流信息" :visible.sync="logisticsInfoeditDelogVisable">
        <span>无数据</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="logisticsInfoeditDelogVisable = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="logisticsInfoeditDelogVisable = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      inputVal: "",
      listData: [],
      filterDataList: [],
      // 当前请求的页码
      pagenum: 1,
      // 当前
      pagesize: 10,
      // 数据总和
      total: 0,
      // 控制修改的弹出框显示的值
      editDelogVisable: false,
      // 表单内容
      editForm: {
        province: "",
        detailed_address: "",
      },
      // 物流信息的对话框显示
      logisticsInfoeditDelogVisable: false,
      // 物流信息
      logisticsInfo: [],
    };
  },
  created() {
    this.initMessage();
  },
  methods: {
    initMessage() {
      this.$http
        .get("orders", {
          params: { pagenum: this.pagenum, pagesize: this.pagesize },
        })
        .then((res) => {
          this.listData = res.data.data.goods;
          this.filterDataList = res.data.data.goods;
          this.total = res.data.data.total;
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.initMessage();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.initMessage();
    },
    // 筛选事件
    filterList() {
      this.filterDataList = this.listData.filter((item) => {
        return item.order_number.includes(this.inputVal);
      });
    },
    // 监听筛选内容框输入内容
    // 当其为空时展示所有内容
    filterContentInput(val) {
      if (!val) {
        this.filterDataList = this.listData;
      }
    },
  },
};
</script>

<style scoped>
.inputBox {
  width: 260px;
}
.box-card {
  margin-top: 20px;
}
</style>