<template>
  <div id="main">
    <!-- 个人信息卡片图 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-avatar
          style="float: left; background: transparent; border: 1px solid #ccc"
          :src="$store.state.userdata.avatar"
        ></el-avatar>
        <div class="userbox">
          <span class="username">{{ $store.state.userdata.nickname }}</span>
          <span class="signature" v-show="$store.state.isLogin"
            ><strong>个性签名:</strong
            >{{
              $store.state.userdata.signature === ""
                ? "快去设置你的个性签名吧~"
                : $store.state.userdata.signature
            }}</span
          >
        </div>
        <el-button
          @click="login"
          style="float: right; padding: 3px 0；margin-top:12px"
          type="text"
          v-show="!$store.state.isLogin"
          >登录/注册</el-button
        >
      </div>
      <div
        class="text item"
        v-for="(item, index) in settings"
        :key="item"
        @click="settingsClick(index)"
      >
        {{ item }}<span class="el-icon-arrow-right"></span>
      </div>
      <!-- 退出登录按钮 -->
      <div class="exit">
        <el-button
          type="primary"
          round
          v-show="$store.state.userdata.status == 1"
          @click="logout"
          >退出登录</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      settings: ["修改个人资料", "软件声明", "版本号", "关于"],
    };
  },
  computed: {
    isLogin() {
      if (localStorage.getItem("token") && localStorage.getItem("userdata")) {
        this.$store.commit(
          "updateUserData",
          JSON.parse(localStorage.getItem("userdata"))
        );
      } else {
        this.$store.commit("resetUserData");
      }
      return this.$store.state.isLogin;
    },
  },
  methods: {
    // 登录
    login() {
      this.$router.push("/profile/login");
    },
    // 登出
    logout() {
      this.$store.commit("delToken");
      const loading = this.$loading({
        lock: true,
        text: "正在退出账号",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
        this.$store.dispatch("asyncresetUserData");
      }, 2000);
    },
    // 设置项
    settingsClick(index) {
      const h = this.$createElement;
      if (index === 0) {
        if (this.$store.state.userdata._id !== "") {
          this.$router.push("/profile/account");
        } else {
          this.$message.error({
            message: "未登录！",
            offset: 1,
          });
        }
      } else if (index === 1) {
        this.$notify({
          title: "软件声明",
          message: h("i", { style: "color: teal" }, "版权所有，侵权必究！"),
        });
      } else if (index === 2) {
        this.$notify({
          title: "版本号",
          message: h("i", { style: "color: teal" }, "V0.0.1"),
        });
      } else if (index === 3) {
        this.$notify({
          title: "关于",
          message: h(
            "i",
            { style: "color: teal" },
            "本软件是一款在线社区软件,在这里,您可以与其他用户分享您的作品,也可以与好友进行聊天功能。"
          ),
        });
      }
    },
  },
};
</script>

<style scoped>
.text:nth-child(n + 2) {
  border-top: 1px solid #ccc;
}
.text {
  display: flex;
  justify-content: space-between;
  line-height: 35px;
}
.box-card {
  margin-top: 44px;
}
.exit {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 50px;
}
.el-icon-arrow-right {
  width: 36px;
  height: 36px;
  font-size: 20px;
  padding-top: 8px;
  padding-left: 16px;
}
.userbox {
  height: 40px;
  float: left;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  font-size: 14px;
  justify-content: space-between;
}
.username {
  margin-top: 3px;
  font-weight: 700;
}
.signature {
  font-size: 12px;
  color: #555;
}
.el-avatar img {
  width: 100% !important;
  height: 100% !important;
}
</style>
