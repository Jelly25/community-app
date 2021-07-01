<template>
  <div id="profile">
    <!-- 导航条 -->
    <nav-bar>
      <h3 slot="middle" class="title">{{ title }}</h3>
    </nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  name: "Profile",
  data() {
    return {
      path: "/profile/main",
    };
  },
  computed: {
    title() {
      if (this.$route.path.indexOf("main") !== -1) {
        return "个人中心";
      } else if (this.$route.path.indexOf("login") !== -1) {
        return "个人中心-登录";
      } else if (this.$route.path.indexOf("register") !== -1) {
        return "个人中心-注册";
      } else if (this.$route.path.indexOf("account") !== -1) {
        return "个人中心-修改个人资料";
      }
    },
  },
  components: {
    NavBar,
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
