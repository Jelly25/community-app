<template>
  <div id="card">
    <el-dialog title="好友列表" width="100%" :visible.sync="dialogVisible">
      <el-radio-group
        v-model="radio"
        class="list"
        @change="handleRadioChange"
        v-loading="loading"
        v-if="this.friendLists.length !== 0"
      >
        <label v-for="item in friendLists" :key="item._id">
          <el-radio :label="item._id">{{ item.nickname }}</el-radio>
        </label>
      </el-radio-group>
      <div v-else style="padding-bottom: 10px">你暂时还没有好友哦~</div>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="this.friendLists.length !== 0"
      >
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleShare"
          >分享</el-button
        >
      </span>
    </el-dialog>
    <h2 class="empty" v-if="$store.state.moments.length == 0 ? true : false">
      社区里空荡荡的，快来发表文章吧~
    </h2>
    <div
      class="card-item"
      v-for="(item, index) in $store.state.moments"
      :key="item._id"
      v-else
    >
      <div class="item-top">
        <div class="top-left">
          <el-avatar :src="item.useravatar"></el-avatar>
        </div>
        <div class="top-center">
          <div class="username">{{ item.username }}</div>
          <div class="updatetime">{{ item.updatetime }}</div>
        </div>
      </div>
      <div class="item-con">{{ item.publishcon }}</div>
      <div class="item-bot">
        <div class="prefer">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-star-off"
            @click="prefer(item._id, item.prefer, index)"
            >{{ item.prefer }}</el-button
          >
        </div>
        <div class="comments">
          <el-button
            type="info"
            size="mini"
            class="el-icon-edit-outline"
            @click="comments(item._id)"
            >评论</el-button
          >
        </div>
        <div class="share">
          <el-button
            type="success"
            size="mini"
            class="el-icon-position"
            @click="share(item.username, item.publishcon, item.updatetime)"
            >分享</el-button
          >
        </div>
        <el-drawer
          :title="'评论(共' + $store.state.commentsList.length + '条)'"
          :visible.sync="drawer"
          direction="btt"
          size="400px"
        >
          <h3
            v-if="$store.state.commentsList.length == 0 ? true : false"
            style="
              width: 95%;
              margin: 0 auto;
              text-align: center;
              height: 311px;
              line-height: 311px;
            "
          >
            暂时还没有人发表评论，快来抢沙发吧~
          </h3>
          <div class="comment_box" v-else>
            <div
              class="comment"
              v-for="item in $store.state.commentsList"
              :key="item.commentstime"
            >
              <div class="left">
                <el-avatar :src="item.cuseravatar"></el-avatar>
              </div>
              <div class="right">
                <div class="cusername">{{ item.cusername }}</div>
                <div class="cusercomment">{{ item.cusercomments }}</div>
                <div class="commenttime">{{ item.commentstime }}</div>
              </div>
            </div>
          </div>
          <div class="editcomment">
            <el-input
              size="small"
              style="margin: 4px 10px 0 0"
              placeholder="在这里发表你的评论"
              v-model="comment"
            >
            </el-input>
            <el-button
              style="height: 30px; margin-top: 5px"
              class="el-icon-edit"
              type="primary"
              round
              size="mini"
              @click="discuss"
              >发表</el-button
            >
          </div>
        </el-drawer>
      </div>
    </div>
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
export default {
  name: "Card",
  data() {
    return {
      isloading: true,
      id: "",
      comment: "",
      drawer: false,
      dialogVisible: false,
      radio: "",
      friendLists: [],
      loading: false,
      currentCon: "",
    };
  },
  methods: {
    // 发表评论
    discuss() {
      if (this.comment.trim() !== "") {
        const loading = this.$loading({
          lock: true,
          text: "发表中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        setTimeout(() => {
          loading.close();
          request({
            url: "/community/updateComments",
            method: "post",
            data: {
              id: this.id,
              comments: {
                cuserid: this.$store.state.userdata._id,
                cusername: this.$store.state.userdata.nickname,
                cusercomments: this.comment,
                cuseravatar: this.$store.state.userdata.avatar,
                commentstime: renderTime(),
              },
            },
          }).then((res) => {
            if (res.err_code === 500) {
              this.$message({
                message: "服务器错误",
                offset: 1,
              });
            } else {
              this.$message({
                message: "发表成功",
                type: "success",
                offset: 1,
              });
              this.comment = "";
              this.comments(this.id);
            }
          });
        }, 2000);
      } else {
        this.$message({
          message: "评论不能为空哟！",
          offset: 1,
        });
      }
    },
    // 点赞
    prefer(id, prefer, index) {
      request({
        url: "/community/prefer",
        params: { id, prefer },
      }).then((res) => {
        if (!res.data) {
          return false;
        }
        if (this.$store.state.userdata._id === res.data.userid) {
          this.$message({
            message: "不能给自己点赞！",
            offset: 1,
          });
        } else {
          this.$store.state.moments[index].prefer += 1;
          prefer += 1;
          request({
            url: "/community/prefer",
            params: { id, prefer },
          });
        }
      });
    },
    // 更新评论
    comments(id) {
      this.drawer = true;
      this.id = id;
      request({
        url: "/community/comments",
        params: id,
      }).then((res) => {
        if (res.err_code === 500) {
          this.$message({
            message: "服务器错误",
            offset: 1,
          });
        } else {
          this.$store.dispatch("asyncupdateCommentsList", res.data.reverse());
        }
      });
    },
    // 分享
    share(username, publishcon, updatetime) {
      this.currentCon = `@${username}==>${publishcon}(更新于${updatetime})`;
      this.dialogVisible = true;
      this.loading = true;
      request({
        url: `/friendList?id=${this.$store.state.userdata._id}`,
      }).then((res) => {
        this.friendLists = res.data;
        // console.log(this.friendLists);
        this.loading = false;
      });
    },
    handleRadioChange() {
      // console.log(this.radio);
    },
    // 分享
    handleShare() {
      if (this.radio === "") {
        return this.$message.warning({
          message: "请先选择您要分享的好友！",
          offset: 1,
        });
      }
      request({
        url: "/chatHis",
        method: "post",
        data: {
          message: this.currentCon,
          time: this.$TF(),
          from: this.$store.state.userdata._id,
          to: this.radio,
        },
      }).then((res) => {
        if (res.err_code === 0) {
          this.dialogVisible = false;
          this.$message.success({
            message: "分享成功",
            offset: 1,
          });
          this.$io.emit("comShare", {
            message: this.currentCon,
            time: this.$TF(),
            from: this.$store.state.userdata.nickname,
            to: this.radio,
            fromID: this.$store.state.userdata._id,
          });
        } else {
          this.$message.error({
            message: "服务器出错啦，请稍后重新分享...",
            offset: 1,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.list {
  margin: 0 0 10px;
  width: 100%;
}
.list .el-radio {
  width: 100%;
  display: flex;
  padding-right: 10px;
  height: 30px;
  line-height: 30px;
  flex-direction: row-reverse;
  justify-content: space-between;
}
#card >>> .el-radio__label {
  padding-left: 0 !important;
}
#card >>> .el-radio__input {
  line-height: 35px;
}
#card >>> .el-dialog__headerbtn {
  top: 12px;
}
#card >>> .el-dialog {
  margin-top: 25vh !important;
}
#card >>> .el-dialog__wrapper {
  width: 80%;
  margin: 0 auto;
}
#card >>> .el-dialog__header {
  padding: 10px;
  line-height: 20px;
}
#card >>> .el-dialog__body {
  max-height: 240px;
  padding: 0 10px;
  overflow-y: auto;
}
#card >>> .el-dialog__footer {
  padding: 3px 20px 6px;
}
.empty {
  width: 80%;
  text-align: center;
  margin: 150px auto;
}
#card {
  margin-top: 44px;
  padding-bottom: 45px;
}
.card-item {
  padding: 20px;
  border-bottom: 1px solid #999;
}
.item-top {
  display: flex;
  justify-content: space-between;
  height: 44px;
}
.item-top .top-center {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  padding-left: 5px;
}
.item-top .top-center .username {
  font-size: 16px;
}
.item-top .top-center .updatetime {
  font-size: 12px;
  color: #999;
}
.item-con {
  padding: 5px 0 0 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 50;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
}
.messageCon {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  color: teal !important;
}
.item-bot {
  padding: 5px 0 0 40px;
  display: flex;
  justify-content: space-between;
}
.comment_box {
  height: 311px;
  overflow-y: auto;
}
.comment {
  display: flex;
  width: 95%;
  margin: 0 auto 5px;
}
.comment .right {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  padding-top: 5px;
}
.comment .right .cusername {
  font-weight: 700;
}
.comment .right .cusercomment {
  margin: 3px 0;
}
.comment .right .commenttime {
  font-size: 12px;
  color: #999;
}
.editcomment {
  display: flex;
  height: 40px;
  padding: 0 10px;
}
</style>
