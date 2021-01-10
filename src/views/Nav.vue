<template>
  <div>
    <el-row class="tac">
      <el-menu
      :default-active="itemPathId"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="rgb(40, 42, 61)"
        text-color="#fff"
      >
        <div class="collapse_btn" @click="changeCollapse">
          <i class="el-icon-s-fold"></i>
        </div>
        <el-submenu
          :index="String(item.id)"
          v-for="item in navList"
          :key="item.id"
        >
          <template slot="title">
            <i :class="'iconfont ' + iconfontNum[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <el-menu-item
            style="padding-left: 30px"
            v-for="itemChildren in item.children"
            :key="itemChildren.id"
            :index="String(itemChildren.id)"
            @click="toComponentPath(itemChildren)"
          >
            <i class="el-icon-menu"></i>
            {{ itemChildren.authName }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [],
      iconfontNum: {
        125: "icon-icon_user",
        103: "icon-shangpin",
        101: "icon-danju",
        102: "icon-tijikongjian",
        145: "icon-baobiao",
      },
      isCollapse: false,
      // 每个小块对应的component
      pathList: {
        110: "userlist",
        111: "rolelist",
        112: "permissionlist",
        104: "goodslist",
        115: "sortlist",
        121: "goodssort",
        107: "orderlist",
        146: "datalist",
      },
    };
  },
  props: ["navlistitem"],
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("changeCollapse", this.isCollapse);
    },
    toComponentPath(children) {
      this.$emit("nowClickItemId", this.pathList[children.id]);
    },
  },
  watch: {
    // 通过异步传递的props需要监听才能显示
    navlistitem(n, o) {
      this.navList = n;
    },
  },
  computed: {
    itemPathId() {
      for (const item in this.pathList) {
        if (this.$route.path.match(this.pathList[item])) {
          return item+'';
        }
      }
    },
  },
};
</script>

<style scoped>
.el-row {
  color: #fff;
  overflow: hidden;
}

.el-menu {
  border: none;
}

.iconfont {
  padding-right: 10px;
}

.collapse_btn {
  width: 100%;
  padding-left: 5px;
  text-align: center;
}

.el-menu-item {
  padding-right: 5px;
}

.el-menu--collapse {
  width: auto;
}
</style>