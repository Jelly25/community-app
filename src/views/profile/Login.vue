<template>
  <div id="login">
    <el-form
      v-loading.fullscreen.lock="fullscreenLoading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      ><el-form-item label="邮箱" prop="email"
        ><el-input v-model="ruleForm.email"></el-input></el-form-item
      ><el-form-item label="密码" prop="password"
        ><el-input
          v-model="ruleForm.password"
          show-password
        ></el-input></el-form-item
      ><el-form-item
        ><el-button type="primary" @click.native="login(ruleForm)"
          >登录</el-button
        >
        <el-button
          type="info"
          plain
          style="margin-left: 0"
          @click.native="register"
          >没有账号?去创建</el-button
        >
      </el-form-item></el-form
    >
  </div>
</template>

<script>
// 导入网络请求
import { request } from "network/request";
export default {
  name: "Login",
  data() {
    return {
      count: "",
      fullscreenLoading: false,
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur",
          },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "邮箱格式错误",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
            message: "密码由8-16位的大小写字母和数字组成",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    login(data) {
      request({
        url: "/profile/login",
        method: "post",
        data: {
          email: data.email,
          password: data.password,
        },
      }).then((res) => {
        if (res.err_code === 500) {
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message.error({
              message: "服务器错误，请稍后重试",
              offset: 1,
            });
          }, 2000);
        } else if (res.err_code === 2) {
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message.error({
              message: "账号不存在",
              offset: 1,
            });
          }, 2000);
        } else {
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message({
              message: "欢迎您，" + res.data.user.nickname,
              type: "success",
              offset: 1,
            });
            res.data.user.status = 1;
            // this.$store.dispatch("asyncupdateUserData", res.data.user);
            this.$store.commit("updateUserData", res.data.user);
            // localStorage.setItem("userdata", JSON.stringify(res.data.user));
            this.$store.dispatch("asyncgetToken", res.data.token);
            this.$router.push("/profile/main");
            let tokende = JSON.parse(
              decodeURIComponent(
                escape(window.atob(res.data.token.split(".")[1]))
              )
            );
            let count = tokende.exp - tokende.iat;
            this.count = count;
            let timer = setInterval(() => {
              if (count === 0) {
                this.$store.commit("delToken");
                this.$router.push("/profile/login");
                this.$message({
                  message: "token已失效，请您重新登录！",
                  type: "warning",
                  offset: 1,
                });
                clearInterval(timer);
              } else {
                count--;
              }
            }, 1000);
          }, 2000);
        }
      });
    },
    // 跳转到注册页
    register() {
      this.$router.push("/profile/register");
    },
  },
};
</script>

<style scoped>
#login {
  margin-top: 44px;
  padding-top: 50px;
}
.demo-ruleForm {
  margin-left: 10px;
}
</style>
