<template>
  <div class="login">
    <div class="login_con">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账户名：" prop="user">
          <el-input v-model="ruleForm.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账户名"));
      } else {
        if (this.ruleForm.pass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var pass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("未输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user: "admin",
        pass: '123456',
      },
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: pass, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$http.post('http://127.0.0.1:8888/api/private/v1/login',{username: this.ruleForm.user,password: this.ruleForm.pass})
          this.$http({
            type: 'post',
            url: '/login',
            params: {username: this.ruleForm.user,password: this.ruleForm.pass}
          })
          .then((res) => {
            // 保存登录状态。
            window.sessionStorage.setItem('token',res.data.data.token);
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.$router.push({path: '/home'})
          }).catch((err) => {
            // 密码错误，弹出警告
            this.$message({
              slowClose: true,
              message: '密码输入错误，请核对账号或密码',
              type: 'error'
            });
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
html {
  background-color: rgb(58, 102, 145);
}

.login {
  position: relative;
  height: 100%;
  width: 100%;
}

.login_con {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 20px;
  background-color: #fff;
}
</style>
