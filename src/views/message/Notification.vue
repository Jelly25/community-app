<template>
  <div id="notification">
    <div class="notiCard" v-for="item in friReqFrom" :key="item.reqId">
      <h4>好友验证通知</h4>
      <div class="btm">
        <div class="msg">
          <div class="bseMsg">{{ item.reqName }}请求添加您为好友</div>
          <div class="moreMsg">备注:{{ item.reqMsg }}</div>
        </div>
        <div class="btn">
          <el-button
            round
            size="mini"
            type="primary"
            @click="accept(item.reqId, item.reqName)"
            >同意</el-button
          >
          <el-button
            round
            size="mini"
            @click="reject(item.reqId, item.reqName)"
            style="margin-left: 0"
            >拒绝</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from "network/request";
export default {
  name: "Notification",
  data() {
    return {
      friReqFrom: [],
    };
  },
  methods: {
    updateNotiList() {
      request({
        url: `/friendReqList?id=${this.$store.state.userdata._id}`,
      }).then((res) => {
        this.friReqFrom = res.data;
      });
    },
    accept(reqId, reqName) {
      request({
        url: `/addFriend?reqId=${reqId}&reqName=${reqName}&_id=${this.$store.state.userdata._id}&name=${this.$store.state.userdata.nickname}`,
      }).then((res) => {
        if (res.err_code === 0) {
          this.$message.success({
            message: `您和${reqName}成为好友,可以进行聊天了`,
            offset: 1,
          });
          request({
            url: "/chatHis",
            method: "post",
            data: {
              message: "我们已经成为好友了，快来聊天吧！",
              time: this.$TF(),
              from: this.$store.state.userdata._id,
              to: reqId,
            },
          });
          this.$io.emit("accFriNoti", {
            to: reqName,
            from: this.$store.state.userdata.nickname,
          });
          this.updateNotiList();
        }
      });
    },
    reject(reqId, reqName) {
      request({
        url: `/rmFriReq?reqId=${reqId}&_id=${this.$store.state.userdata._id}`,
      }).then((res) => {
        if (res.err_code === 0) {
          this.$message.warning({
            message: `您拒绝了${reqName}的好友请求`,
            offset: 1,
          });
          this.$io.emit("rejFriNoti", {
            to: reqName,
            from: this.$store.state.userdata.nickname,
          });
          this.updateNotiList();
        }
      });
    },
  },
  activated() {
    this.updateNotiList();
  },
};
</script>

<style scoped>
#notification {
  padding: 10px 10px 44px;
}
.notiCard {
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;
  padding: 10px;
}
.btm {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 30px;
}
.msg {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bseMsg,
.moreMsg {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
