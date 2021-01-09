<template>
  <div>
    <el-button type="primary" @click="addDialogVisible = true"> 添加商品分类 </el-button>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible">
      <el-form :model="newCategory">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          :required="true"
        >
          <el-input
            v-model="newCategory.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类"
          :label-width="formLabelWidth"
          :required="true"
        >
          <el-cascader
            v-model="newSelectGoodCategories"
            :options="goodsCategory"
            :props="defaultParams"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddGoodCategory">确 定</el-button>
      </div>
    </el-dialog>

    <tree
      :data="permissionList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      index-text="#"
      border
    >
      <!-- 排序模板 -->
      <template slot="levelss" slot-scope="scope">
        <el-button>点击我把</el-button>
        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
        <el-tag v-if="scope.row.level == '1'" type="success">二级</el-tag>
        <el-tag v-if="scope.row.level == '2'" type="warning">三级</el-tag>
      </template>

      <!-- 是否有效 -->
      <template slot="isEnabled" slot-scope="scope">
        <i class="el-icon-success"></i>
      </template>

      <!-- 操作 -->
      <template slot="handle" slot-scope="scope">
        <el-button
          icon="el-icon-edit"
          type="primary"
          @click="editBtn(scope.row)"
          >编辑</el-button
        >
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="deleteBtn(scope.row)"
          >删除</el-button
        >
      </template>

      <!-- 排序 -->
      <template slot="sort" slot-scope="scope">
        <el-tag
          :type="
            scope.row.cat_level === 0
              ? ''
              : scope.row.cat_level === 1
              ? 'success'
              : 'info'
          "
          >{{
            scope.row.cat_level === 0
              ? "等级一"
              : scope.row.cat_level === 1
              ? "等级二"
              : "等级三"
          }}</el-tag
        >
      </template>
    </tree>

    <el-dialog title="编辑" :visible.sync="editDialogVisible">
      <el-form :model="needEditInfo">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input
            v-model="needEditInfo.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.initMsg();
    this.initGoodsCategory();
  },
  data() {
    return {
      permissionList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isEnabled",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "handle",
        },
      ],
      editDialogVisible: false,
      needEditInfo: {},
      formLabelWidth: "120px",
      nowEidtItem: {},
      // 选择属性的下拉
      addDialogVisible: false,
      newSelectGoodCategories: [], // 新选中产品的id数组
      goodsCategory: [],
      defaultParams: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true,
      }, // select的默认选项
        newCategory: {
            cat_name: ''
        }
    };
  },
  methods: {
          //接收分类
    initGoodsCategory() {
      this.$http.get("categories").then((res) => {
        this.goodsCategory = res.data.data;
      });
    },
    initMsg() {
      this.$http.get("categories").then((res) => {
        this.permissionList = res.data.data;
      });
    },
    editBtn(item) {
      this.needEditInfo = item;
      this.editDialogVisible = true;
    },
    sureEdit() {
      const url = "categories/" + this.needEditInfo.cat_id;
      const params = {
        cat_name: this.needEditInfo.cat_name,
      };
      this.$http.put(url, params).then((res) => {
        console.log(res);
        if (res.data.meta.msg === "更新成功") {
          this.$message("更新成功");
          this.editDialogVisible = false;
          this.initMsg();
        }
      });
    },
    deleteBtn(item) {
      console.log(item);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = "/categories/" + item.cat_id;
          this.$http.delete(url).then((res) => {
            if (res.data.meta.msg == "删除成功") {
              this.initMsg();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 确认添加参数
    sureAddGoodCategory() {
        const url = 'categories';
        const newSelectGoodCategoriesLength = this.newSelectGoodCategories.length;
        let params = null;
        // 判断是否为第一层级
        if(newSelectGoodCategoriesLength >= 1) {
            params = {
                cat_pid : this.newSelectGoodCategories[newSelectGoodCategoriesLength-2],
                cat_name : this.newCategory.cat_name,
                cat_level: newSelectGoodCategoriesLength
            }
            console.log(params);
        } else {
            params = {
                cat_pid : 0,
                cat_name : this.newCategory.cat_name,
                cat_level: 0
            }
        }
        this.$http.post(url, params).then(res => {
            if(res.data.meta.msg === '创建成功') {
                this.$message({
                    type: 'success',
                    message: '创建成功',
                    showClose: true,
                })
                this.addDialogVisible = !this.addDialogVisible;
                this.initMsg();
                this.initGoodsCategory();
            }
        })

    }
  },
  computed: {},
};
</script>

<style scoped>
.el-icon-success {
  color: #67c23a;
}
</style>