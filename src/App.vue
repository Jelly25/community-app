<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
import MainTabBar from "components/common/tabbar/MainTabBar.vue";
export default {
  name: "App",
  components: {
    MainTabBar,
  },
  mounted() {
    this.$io.on("addFriReq", (data) => {
      if (data.to === this.$store.state.userdata.nickname) {
        this.$message.warning({
          message: `${data.from}请求添加您为好友`,
          offset: 1,
        });
      }
    });
    this.$io.on("accFri", (data) => {
      if (data.to === this.$store.state.userdata.nickname) {
        this.$message.warning({
          message: `${data.from}同意了您的好友请求,快去和对方聊天吧。`,
          offset: 1,
        });
      }
    });
    this.$io.on("rejFri", (data) => {
      if (data.to === this.$store.state.userdata.nickname) {
        this.$message.warning({
          message: `${data.from}拒绝了您的好友请求`,
          offset: 1,
        });
      }
    });
  },
};
</script>

<style>
@import "assets/css/base.css";
body {
  padding-right: 0 !important;
}
.el-message-box {
  width: 350px !important;
}
.el-card__body {
  min-height: 497px;
  overflow-y: auto;
}
.demo-ruleForm {
  width: 318px;
}
#el-drawer__title {
  margin-bottom: 7px !important;
}
.distpicker-address-wrapper select {
  width: 100% !important;
}
.el-tabs__nav is-top {
  margin: 0 auto !important;
}
</style>
