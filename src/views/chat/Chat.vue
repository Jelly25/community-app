<template>
  <div id="chat">
    <el-page-header @back="goBack" :content="username" title="" class="bar">
    </el-page-header>
    <!-- 聊天内容 -->
    <div class="chatcon">
      <label v-for="item in chatHis" :key="item.time">
        <div class="chatTime">
          <span>{{ item.time | timeFilters }}</span>
        </div>
        <div class="right" v-if="item.id === $store.state.userdata._id">
          <el-avatar
            shape="square"
            :size="40"
            fit="contain"
            :src="$store.state.userdata.avatar"
          ></el-avatar>
          <div class="self">
            <span class="cont">{{ item.message }}</span>
            <div class="arrow"></div>
          </div>
        </div>
        <div class="left" v-else>
          <el-avatar
            shape="square"
            :size="40"
            fit="contain"
            :src="useravatar"
          ></el-avatar>
          <div class="friend">
            <span class="cont">{{ item.message }}</span>
            <div class="arrow"></div>
          </div>
        </div>
      </label>
    </div>
    <!-- 输入框 -->
    <div class="ipx">
      <el-input
        type="text"
        placeholder="请输入要发送的信息"
        v-model="text"
        maxlength="50"
        size="medium"
        show-word-limit
        style="width: 80%"
      >
      </el-input>
      <el-button type="success" round size="mini" @click="sendMsg"
        >发送</el-button
      >
    </div>
  </div>
</template>

<script>
import { request } from "network/request.js";
export default {
  name: "Chat",
  filters: {
    timeFilters(value) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      let ymd = year + "-" + month + "-" + day;
      if (value.split(" ")[0] !== ymd) {
        let newmon = value.split(" ")[0].split("-")[1];
        let newday = value.split(" ")[0].split("-")[2];
        if (newmon !== month) {
          return value;
        } else if (parseInt(day) - parseInt(newday) === 1) {
          return "昨天 " + value.split(" ")[1];
        } else if (parseInt(day) - parseInt(newday) === 2) {
          return "前天 " + value.split(" ")[1];
        } else {
          return value;
        }
      } else {
        return value.split(" ")[1];
      }
    },
  },
  methods: {
    goBack() {
      this.$router.push("/message/chatlist");
    },
    sendMsg() {
      if (this.text.trim() === "") {
        return this.$message.warning({
          message: "发送内容不能为空",
          offset: 1,
        });
      }
      this.$io.emit("sendMessage", {
        message: this.text,
        time: this.$TF(),
        from: this.$store.state.userdata.nickname,
        to: this.userid,
        fromID: this.$store.state.userdata._id,
      });
      request({
        url: "/chatHis",
        method: "post",
        data: {
          message: this.text,
          time: this.$TF(),
          from: this.$store.state.userdata._id,
          to: this.userid,
        },
      }).then((res) => {
        if (res.err_code === 0) {
          this.getChatHis();
          this.text = "";
        } else {
          this.$message.error({
            message: "服务器出错啦，请稍后重新发送",
            offset: 1,
          });
        }
      });
    },
    // 自动滚动到底部
    scrollBottom() {
      window.scrollTo(0, document.querySelector(".chatcon").offsetHeight);
    },
    // 获取聊天记录
    getChatHis() {
      request({
        url: "/getChatHis",
        params: {
          from: this.$store.state.userdata._id,
          to: this.userid,
        },
      }).then((res) => {
        if (res.err_code === 0) {
          this.chatHis = res.data;
          this.$nextTick(() => {
            this.scrollBottom();
          });
        }
      });
    },
  },
  data() {
    return {
      username: "",
      useravatar: "",
      userid: "",
      text: "",
      chatHis: [],
    };
  },
  // 打开聊天界面调用
  activated() {
    this.username = this.$route.query.name;
    this.useravatar = this.$route.query.avatar;
    this.userid = this.$route.query.id;
    this.getChatHis();
    this.scrollBottom();
  },
  // 侦听器
  // watch: {
  //   chatHis: {
  //     handler(newval, oldval) {
  //       if (newval !== oldval) {
  //         console.log(newval, oldval);
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  mounted() {
    this.$io.on("sendMsg", (data) => {
      if (data.to === this.$store.state.userdata._id) {
        this.chatHis.push({
          id: data.fromID,
          message: data.message,
          time: data.time,
        });
        this.$nextTick(() => {
          this.scrollBottom();
        });
        this.$message.info({
          message: data.from + ":" + data.message,
          offset: 1,
        });
      }
    });
    this.$io.on("sendShare", (data) => {
      if (data.to === this.$store.state.userdata._id) {
        this.chatHis.push({
          id: data.fromID,
          message: data.message,
          time: data.time,
        });
        this.$nextTick(() => {
          this.scrollBottom();
        });
        this.$message.info({
          message: `<div style="margin-bottom:5px">来自好友${data.from}的分享</div><div>${data.message}</div>`,
          offset: 1,
          iconClass: "el-icon-paperclip",
          showClose: true,
          dangerouslyUseHTMLString: true,
        });
      }
    });
  },
};
</script>

<style scoped>
#chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  padding-bottom: 55px;
}
.chatcon {
  flex: 1;
  padding-bottom: 30px;
  padding-top: 50px;
}
.ipx {
  background-color: #fff;
  position: fixed;
  bottom: 49px;
  width: 375px;
  height: 36px;
  display: flex;
  justify-content: space-around;
}
.bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  height: 44px;
  line-height: 44px;
  padding-left: 20px;
  border: 1px solid #e9e9e9;
  background-color: #fff;
  z-index: 999;
}
.cont {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  margin: 5px 0;
}
.left,
.right {
  display: flex;
  width: 375px;
  min-height: 40px;
  padding: 0 10px;
  margin-bottom: 5px;
}
.left {
  justify-content: flex-start;
}
.right {
  flex-direction: row-reverse;
  justify-content: flex-start;
}
.self,
.friend {
  position: relative;
  max-width: 280px;
  min-width: 20px;
  line-height: 25px;
  padding: 0 5px;
  color: #fff;
  border-radius: 8px; /* 圆角 */
}
.self {
  margin-right: 15px;
  margin-top: 5px;
  background: #06bb4b;
}
.friend {
  margin-left: 15px;
  margin-top: 5px;
  background: #c0bba9;
}
.self .arrow,
.friend .arrow {
  position: absolute;
  top: 6px;
  width: 0;
  height: 0;
  font-size: 0;
  border: solid 8px;
}
.self .arrow {
  right: -16px;
  border-color: transparent transparent transparent #06bb4b;
}
.friend .arrow {
  left: -16px;
  border-color: transparent #c0bba9 transparent transparent;
}
.chatTime {
  font-size: 12px;
  margin: 5px auto;
  text-align: center;
}
.chatTime span {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  background-color: #868686;
  color: #fff;
  padding: 0 5px;
  border-radius: 5px;
}
</style>
