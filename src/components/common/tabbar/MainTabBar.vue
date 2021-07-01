<template>
  <tab-bar>
    <tab-bar-item path="/home">
      <img slot="item-icon" src="~assets/img/tabbar/home.svg" alt="" />
      <img
        slot="item-icon-selected"
        src="~assets/img/tabbar/home-selected.svg"
        alt=""
      />
      <span slot="item-text">首页</span>
    </tab-bar-item>
    <tab-bar-item path="/community">
      <img slot="item-icon" src="~assets/img/tabbar/community.svg" alt="" />
      <img
        slot="item-icon-selected"
        src="~assets/img/tabbar/community-selected.svg"
        alt=""
      />
      <div slot="item-text">社区</div>
    </tab-bar-item>
    <tab-bar-item path="/message">
      <img slot="item-icon" src="~assets/img/tabbar/message.svg" alt="" />
      <img
        slot="item-icon-selected"
        src="~assets/img/tabbar/message-selected.svg"
        alt=""
      />
      <div slot="item-text">消息</div>
    </tab-bar-item>
    <tab-bar-item path="/profile">
      <img slot="item-icon" src="~assets/img/tabbar/profile.svg" alt="" />
      <img
        slot="item-icon-selected"
        src="~assets/img/tabbar/profile-selected.svg"
        alt=""
      />
      <div slot="item-text">我的</div>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from "./TabBar";
import TabBarItem from "./TabBarItem";
export default {
  name: "MainTabBar",
  components: {
    TabBar,
    TabBarItem,
  },
};
</script>

<style scoped>
</style>