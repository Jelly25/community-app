<template>
  <div id="menuitem">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通知" name="first"></el-tab-pane>
      <el-tab-pane label="关注" name="second"></el-tab-pane>
      <el-tab-pane label="聊天" name="third"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Attention from "./Attention";
import ChatList from "./ChatList";
import Notification from "./Notification";
export default {
  name: "MenuItem",
  data() {
    return {
      activeName: "second",
    };
  },
  components: {
    Attention,
    ChatList,
    Notification,
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 0) {
        this.$router.push("/message/notification");
      } else if (tab.index == 1) {
        this.$router.push("/message/attention");
      } else if (tab.index == 2) {
        this.$router.push("/message/chatlist");
      }
    },
  },
};
</script>

<style>
.el-tabs__header {
  margin-bottom: 0;
  background-color: #1296db;
  border: 3px solid #1296db;
}
.el-tabs__nav {
  margin-left: 50%;
  transform: translate(-50%) !important;
}
.el-tabs__item.is-active {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
</style>