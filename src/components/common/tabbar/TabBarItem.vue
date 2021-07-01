<template>
  <div class="tabbar-item" @click="itemClick">
    <slot v-if="!isActive" name="item-icon"> </slot>
    <slot v-else name="item-icon-selected"> </slot>
    <div :style="activeStyle" class="item-text">
      <slot name="item-text"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  data() {
    return {
      dpath: this.path,
    };
  },
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "#1296db",
    },
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.dpath) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor, fontWeight: 700 } : {};
    },
  },
  methods: {
    itemClick() {
      this.$router.push(this.dpath);
    },
  },
};
</script>

<style scoped>
.tabbar-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 49px;
  font-size: 14px;
}
.tabbar-item img {
  width: 24px;
  height: 24px;
}
.tabbar-item .item-text {
  margin-top: 3px;
}
</style>