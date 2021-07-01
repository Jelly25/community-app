<template>
  <div class="nav-bar">
    <div class="nav-left"><slot name="left"></slot></div>
    <div class="nav-middle"><slot name="middle"></slot></div>
    <div class="nav-right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  width: 375px;
  height: 44px;
  line-height: 44px;
  background-color: #118ac6;
  z-index: 999;
  overflow: hidden;
}
.nav-left,
.nav-right {
  text-align: center;
  width: 60px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.nav-middle {
  flex: 1;
  text-align: center;
  color: #fff;
}
</style>
