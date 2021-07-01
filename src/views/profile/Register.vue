<template>
  <div id="register">
    <el-form
      v-loading.fullscreen.lock="fullscreenLoading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      status-icon
      ><el-form-item label="邮箱" prop="email"
        ><el-input v-model="ruleForm.email"></el-input
      ></el-form-item>
      <div style="display: flex">
        <el-form-item label="验证码" prop="verifycode" style="margin-right: 5%"
          ><el-input v-model="ruleForm.verifycode" autocomplete="off"></el-input
        ></el-form-item>
        <el-form-item label-width="0" style="width: 45%">
          <el-button
            :disabled="isdisabled"
            type="primary"
            style="width: 100%; padding: 12px 0"
            @click="getregisterVerifyCode"
            >{{ btntext }}</el-button
          >
        </el-form-item>
      </div>
      <el-form-item label="昵称" prop="nickname"
        ><el-input v-model="ruleForm.nickname"></el-input
      ></el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input
          type="password"
          v-model="ruleForm.checkPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        ><el-button type="primary" @click="register(ruleForm)">注册</el-button>
        <el-button type="info" plain style="margin-left: 0" @click="login"
          >注册成功,去登录</el-button
        >
      </el-form-item></el-form
    >
  </div>
</template>

<script>
// 时间格式转化
function renderTime() {
  var date = new Date().toJSON();
  return new Date(+new Date(date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
}
// 引入网络请求
import { request } from "network/request.js";
export default {
  name: "Register",
  data() {
    // 密码验证
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPassword !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    // 密码二次验证
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证码校验
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value != this.$store.state.registerVerifyCode) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };
    return {
      fullscreenLoading: false,
      isdisabled: false,
      btntext: "获取验证码",
      count: 60,
      // 表单绑定值
      ruleForm: {
        email: "",
        nickname: "",
        password: "",
        checkPassword: "",
        verifycode: "",
      },
      // 校验规则
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
        verifycode: [
          {
            required: true,
            validator: validateCode,
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: "请输入您的昵称",
            trigger: "blur",
          },
          {
            pattern: /^\S{2,8}$/,
            message: "用户名由2-8位非空格字符组成",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
            message: "密码由8-16位的大小写字母和数字组成",
            trigger: "blur",
          },
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 请求验证码
    getregisterVerifyCode() {
      this.$refs.ruleForm.validateField("email", (err) => {
        if (err === "") {
          let timer = setInterval(() => {
            if (this.count === 1) {
              clearInterval(timer);
              this.count = 60;
              this.isdisabled = false;
              this.btntext = "获取验证码";
            } else {
              this.count--;
              this.isdisabled = true;
              this.btntext = this.count + "s后重试";
            }
          }, 1000);
          request({
            url: "/emailverify",
            method: "post",
            data: {
              email: this.ruleForm.email,
            },
          }).then((res) => {
            this.$store.dispatch(
              "asyncgetregisterVerifyCode",
              res.data.verifycode
            );
          });
        } else {
          this.$message({ message: err, offset: 1 });
        }
      });
    },
    // 注册
    register(data) {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // 发送请求
          request({
            url: "/profile/register",
            method: "post",
            data: {
              email: data.email,
              nickname: data.nickname,
              password: data.password,
              created_time: renderTime(),
            },
          }).then((res) => {
            if (res.err_code === 500) {
              this.fullscreenLoading = true;
              setTimeout(() => {
                this.fullscreenLoading = false;
                this.$notify({
                  title: "Server error",
                  message: "服务器出错，请稍后重试i🤦‍♂️",
                  type: "error",
                });
              }, 2000);
            } else if (res.err_code === 2) {
              this.fullscreenLoading = true;
              setTimeout(() => {
                this.fullscreenLoading = false;
                this.$notify({
                  title: "注册失败",
                  message: "用户名或邮箱被人注册过啦🤦‍♀️",
                  type: "info",
                });
              }, 2000);
            } else {
              this.fullscreenLoading = true;
              setTimeout(() => {
                this.fullscreenLoading = false;
                this.$notify({
                  title: "注册成功",
                  message: "恭喜您完成了注册i✨",
                  type: "success",
                });
              }, 2000);
            }
          });
        } else {
          this.$message.error({
            message: "请完成必填项进行注册",
            offset: 1,
          });
          return false;
        }
      });
    },
    // 跳转登录页
    login() {
      this.$router.push("/profile/login");
    },
  },
};
</script>

<style scoped>
#register {
  margin-top: 44px;
  padding-top: 50px;
}
</style>