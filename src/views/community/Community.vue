<template>
  <div id="community">
    <nav-bar><h3 slot="middle" class="title">社区中心</h3></nav-bar>
    <card></card>
    <el-button
      type="warning"
      icon="el-icon-edit"
      class="edit"
      circle
      @click="drawer = true"
    ></el-button>
    <el-drawer
      title="快来和大家畅所欲言吧"
      :visible.sync="drawer"
      direction="btt"
      size="25%"
    >
      <el-form
        v-model="form"
        ref="form"
        label-width="80px"
        style="width: 95%; margin: 0 auto"
        v-loading="loading"
      >
        <el-form-item label="发布内容">
          <el-input type="textarea" resize="none" v-model="form.con"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="publish">发布</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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
import { request } from "network/request";
import NavBar from "components/common/navbar/NavBar.vue";
import Card from "./Card.vue";
export default {
  name: "Community",
  components: {
    NavBar,
    Card,
  },
  data() {
    return {
      loading: false,
      drawer: false,
      form: {
        con: "",
      },
    };
  },
  created() {
    this.updateEssay();
  },
  activated() {
    this.updateEssay();
  },
  methods: {
    // 更新社区内容
    updateEssay() {
      request({
        url: "/community/publishcon",
      }).then((res) => {
        if (res.data) {
          this.$store.dispatch("asyncupdateMoments", res.data.reverse());
        }
      });
    },
    // 社区发布内容
    publish() {
      if (this.form.con.trim() === "") {
        this.$message({
          message: "发布内容不能为空哦!",
          type: "warning",
          offset: 1,
        });
        return false;
      }
      this.loading = true;
      setTimeout(() => {
        request({
          url: "/community/publish",
          method: "post",
          data: {
            userid: this.$store.state.userdata._id,
            username: this.$store.state.userdata.nickname,
            useravatar: this.$store.state.userdata.avatar,
            publishcon: this.form.con,
            updatetime: renderTime(),
          },
        }).then((res) => {
          if (res.err_code === 500) {
            this.$message({
              message: "服务器错误，请稍后重试！",
              type: "error",
              offset: 1,
            });
          } else {
            this.$message({
              message: "发布成功",
              type: "success",
              offset: 1,
            });
            this.drawer = false;
            this.updateEssay();
          }
        });
        this.loading = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.title {
  color: #fff;
}
.edit {
  position: fixed;
  right: 10px;
  bottom: 70px;
  width: 60px;
  height: 60px;
  font-size: 25px;
}
</style>