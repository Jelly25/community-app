<template>
  <div id="chatlist">
    <div
      class="item"
      @click="toChat(item._id, item.nickname, item.avatar)"
      v-for="item in friends"
      :key="item._id"
    >
      <div class="left">
        <el-avatar
          style="width: 100%; background: transparent; border: 1px solid #ccc"
          :src="item.avatar"
        ></el-avatar>
      </div>
      <div class="middle">
        <div class="name">{{ item.nickname }}</div>
        <div class="chatcon">{{ xxx }}</div>
      </div>
      <span class="right el-icon-chat-dot-square"></span>
    </div>
  </div>
</template>

<script>
import { request } from "network/request";
export default {
  name: "ChatList",
  data() {
    return {
      friends: [],
    };
  },
  computed: {
    xxx() {
      let re = "";
      this.friends.forEach((ele) => {
        ele.friends.forEach((el) => {
          if (el.friendId == this.$store.state.userdata._id) {
            re = el.chatHis.pop().message;
          }
        });
      });

      return re;
    },
  },
  methods: {
    toChat(userid, username, useravatar) {
      this.$router.push({
        path: "/chat",
        query: { id: userid, name: username, avatar: useravatar },
      });
    },
  },
  activated() {
    request({
      url: `/friendList?id=${this.$store.state.userdata._id}`,
    }).then((res) => {
      this.friends = res.data;
    });
  },
};
</script>

<style scoped>
.item {
  padding: 10px 10px;
  display: flex;
  border-bottom: 2px solid #ccc;
}
.left {
  width: 40px;
  height: 40px;
}
.middle {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
}
.chatcon {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right {
  font-size: 30px;
  line-height: 40px;
}
</style>
