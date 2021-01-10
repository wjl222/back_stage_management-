<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
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
                <el-input
                  v-model="newgood.goods_price"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品重量"
                :required="true"
                oninput="value=value.replace(/[^\d]/g,'')"
              >
                <el-input v-model="newgood.goods_weight"></el-input>
              </el-form-item>
              <el-form-item
                label="商品数量"
                :required="true"
                oninput="value=value.replace(/[^\d]/g,'')"
              >
                <el-input v-model="newgood.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" :required="true">
                <el-cascader
                  @change='initAttr'
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
                  <el-checkbox-group v-model="newSelectManyParams[index].attr_vals">
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
                <el-input v-model="newSelectOnlyParams[index].attr_vals"> </el-input>
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
                :on-success="subSuccess"
              >
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>

              <el-dialog
                title="图片详情"
                :visible.sync="imgDalogVisible"
                width="fit-content"
              >
                <img :src="nowShowImg" alt="" />
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="good_comment">
              <quill-editor
                ref="myQuillEditor"
                v-model="newgood.goods_introduce"
                :options="editorOption"
                height="200px"
              />
              <el-button class="submitAdd" type="primary" @click="sureAddGood">
                提交商品
              </el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newgood: {
        goods_name: "",
        goods_cat: "", // 以','分割的分类列表
        goods_price: '0',
        goods_number: '0',
        goods_weight: '0',
        goods_introduce: "",
        pics: [], // 上传的图片临时路径（对象）
        attrs: "", // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      newGoodCategories: [], // 新添加的产品的id数组
      stepsActive: 0, // 当前激活的步骤
      goodsCategory: [], // 初始化的分类值
      // select的默认选项
      defaultParams: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 当前添加商品进行的步数的name
      nowSelectTabName: "good_basic_info",
      // 新增商品的参数列表,经过处理的数组
      newGoodCategoriesVal: {
        many: [],
        only: [],
      },
      // 新选中的属性的数组
      newSelectManyParams: [],
      newSelectOnlyParams: [],
      // 提交信息的头部
      subHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 控制放大图片弹出框的显示
      imgDalogVisible: false,
      // 当前弹出图片的地址
      nowShowImg: "",
      // 富文本编辑器
      editorOption: {
        // Some Quill options...
      },
    };
  },
  created() {
    this.initGoodsCategory();
  },
  methods: {
      initAttr() {
            // 初始化动态属性
      this.$http
        .get("categories/" + this.newGoodCategories[2] + "/attributes", {
          params: { sel: "many" },
        })
        .then((res) => {
            console.log(res);
          const resData = res.data.data;
          this.newGoodCategoriesVal.many = resData.map((item) => {
            const obj = {};
            obj.attr_name = item.attr_name;
            // 这里的属性val是字符串，我们需要的是数组
            obj.attr_vals = item.attr_vals
              .split(",")
              .filter((item) => item != "");
            obj.attr_id=item.attr_id;
            return obj;
          });
          // 默认全部选中
          this.newSelectManyParams = this.newGoodCategoriesVal.many;
        });
      // 初始化静态属性
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
            obj.attr_id=item.attr_id;
            return obj;
          });
          this.newSelectOnlyParams = this.newGoodCategoriesVal.only;
        });
      },
    //接收分类
    initGoodsCategory() {
      this.$http.get("categories").then((res) => {
        this.goodsCategory = res.data.data;
      })
    },
    // 条状页面
    goStep(event) {
      if (this.tabLeaveEvent()) {
        this.stepsActive = +event.index;
      }
    },
    // tab栏切换前判断是否分类
    tabLeaveEvent(activeName, oldActiveName) {
      // 判断新的商品分类列表是存在
      if (!this.newGoodCategories.length) {
        this.$message({
          type: "warning",
          message: "请先选择产品分类",
        });
      }
      return !!this.newGoodCategories.length;
    },
    // 处理图片移除的事件
    handleRemove(file, fileList) {
      const index = this.newgood.pics.findIndex(
        (item) => item === file.response.data.tmp_path
      );
      this.newgood.pics.splice(index, 1);
    },
    // 处理图片放大展示的事件
    handlePreview(file) {
      this.imgDalogVisible = true;
      this.nowShowImg = file.response.data.url;
    },
    // 处理图片上传后返回的数据
    subSuccess(response, file, fileList) {
      this.newgood.pics = fileList.map((res) => {
        const obj = {};
        obj.pic = res.response.data.tmp_path;
        return obj;
      });
    },
    // 确定添加商品
    sureAddGood() {
        this.newgood.goods_cat = this.newGoodCategories.join(",");
        this.newgood.attrs=[...this.newSelectManyParams,...this.newSelectOnlyParams].map(item => {
          const obj = {};
          obj.attr_id=item.attr_id;

          if(item.attr_vals instanceof Array) {
              obj.attr_value = item.attr_vals.join(',')
          } else {
              obj.attr_value = item.attr_vals
          }
          return obj
      });

      this.$http.post('goods',{...this.newgood}).then(res => {
          if(res.data.meta.status==201) {
              this.$message({
                  type:'success',
                  message: '创建成功'
              })
          }else {
              this.$message({
                  type:'warning',
                  message: res.data.meta.msg
              })
          }
          this.$router.push('/home/goodslist')
      });
    },
  },
};
</script>

<style scoped>
.warning.top_warning_text {
  padding: 10px 0;
  width: 100%;
  color: #909399;
  text-align: center;
  background-color: #f2f6fc;
}

/*三栏布局样式*/
.el-main {
  padding: 0;
}

.el-header {
  padding: 0;
  margin-bottom: 20px;
}

/* 修改step样式 */
.stepCon {
  margin-top: 10px;
  width: 1000px;
  height: 60px;
}

/* 富文本输入框 */
.ql-editor.ql-blank {
  height: 300px;
}
.submitAdd {
  margin-top: 30px;
}
</style>