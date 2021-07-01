<template>
  <div id="message">
    <menu-item></menu-item>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import MenuItem from "./MenuItem.vue";
export default {
  name: "Message",
  components: {
    MenuItem,
  },
  data() {
    return {
      path: "/message/attention",
    };
  },
  methods: {},
  activated() {
    this.$router.push(this.path);
  },
  beforeRouteLeave(to, from, next) {
    this.path = this.$route.path;
    next();
  },
};
</script>

<style scoped>
.title {
  color: #fff;
}
</style>