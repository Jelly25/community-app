<template>
  <div id="home">
    <!-- 返回顶部 -->
    <el-backtop :visibility-height="300" :bottom="80" :right="20">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        UP
      </div>
    </el-backtop>
    <!-- 导航条 -->
    <nav-bar>
      <div slot="left" class="gifBoy">
        <img src="~assets/test.gif" alt="" style="width: 100%; height: 100%" />
      </div>
      <div slot="middle" style="color: #fff">
        <el-autocomplete
          class="inline-input"
          placeholder="通过好友名称或账号查询"
          :fetch-suggestions="querySearch"
          v-model="value"
          size="mini"
          @select="handleSelect"
          :trigger-on-focus="false"
        >
          <template slot-scope="{ item }">
            <div class="usermsg">{{ item.name }}({{ item.email }})</div>
          </template></el-autocomplete
        >
      </div>
      <el-dropdown
        slot="right"
        style="cursor: poineter"
        @command="handleCommand"
        trigger="click"
      >
        <span class="el-dropdown-link">
          <i
            class="el-icon-menu"
            style="font-size: 20px; line-height: 44px; color: #fff"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">发布作品</el-dropdown-item>
          <el-dropdown-item command="b" disabled>扩展功能</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </nav-bar>
    <!-- 轮播图 -->
    <el-carousel
      trigger="click"
      height="150px"
      style="margin-top: 44px; padding: 10px 10px 0"
      arrow="never"
      indicator-position="none"
    >
      <el-carousel-item
        v-for="item in carousel"
        :key="item.path"
        class="carousel"
      >
        <img :src="item.path" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 滚动条 -->
    <div class="scroll-bar">
      <span class="el-icon-s-promotion icon"></span>
      <div class="box">
        <p class="animate">毕业设计作品！毕业设计作品！毕业设计作品！</p>
      </div>
    </div>
    <h1 v-if="prods.length === 0" style="text-align: center">空空如也~</h1>
    <!-- 发表模块 -->
    <div class="os" v-else>
      <div class="card" v-for="item in prods" :key="item._id">
        <div class="tophead">
          <div class="avatar">
            <el-avatar
              :src="item.useravatar"
              style="background-color: transparent"
            ></el-avatar>
          </div>
          <div class="info">
            <div
              class="name"
              :style="
                item.usergender === 0
                  ? { color: 'skyblue' }
                  : item.usergender === 1
                  ? { color: 'pink' }
                  : { color: 'grey' }
              "
            >
              {{ item.username }}
            </div>
            <div class="addr el-icon-map-location">{{ item.location }}</div>
          </div>
          <div class="more">
            <el-dropdown
              trigger="click"
              @command="itemcommand($event, item.userid, item.username)"
            >
              <span class="el-dropdown-link">
                <i class="more el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown" trigger="click">
                <el-dropdown-item
                  command="follow"
                  v-if="item.userid !== $store.state.userdata._id"
                  >关注</el-dropdown-item
                >
                <el-dropdown-item
                  command="cancelfollow"
                  v-if="item.userid !== $store.state.userdata._id"
                  >取消关注</el-dropdown-item
                >
                <el-dropdown-item command="seemore">查看资料</el-dropdown-item>
                <el-dropdown-item
                  command="wantfriend"
                  v-if="item.userid !== $store.state.userdata._id"
                  >加个好友</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="desc" v-if="item.desc">
          <i>"{{ item.desc }}"</i>
        </div>
        <div class="imageBox">
          <div class="img" v-for="src in item.imgList" :key="src">
            <img :src="src" alt="" />
          </div>
        </div>
        <div class="botline">
          <el-tag
            type="success"
            size="medium"
            style="margin-right: 5px"
            v-for="tag in item.tag"
            :key="tag"
            >{{ tag }}</el-tag
          >
        </div>
      </div>
    </div>
    <!-- 好友验证 -->
  </div>
</template>

<script>
// 引入NavBar
import NavBar from "components/common/navbar/NavBar";
// 引入网络请求
import { request } from "network/request";
export default {
  name: "Home",
  components: {
    NavBar,
  },
  data() {
    return {
      carousel: [],
      prods: [],
      users: [],
      value: "",
    };
  },
  methods: {
    querySearch(queryString, cb) {
      if (queryString.trim() === "") {
        return cb(["无查询结果"]);
      }
      let results = [];
      this.users.forEach((ele) => {
        if (
          ele.name.indexOf(queryString) !== -1 ||
          ele.email.indexOf(queryString) !== -1
        ) {
          results.push(ele);
        }
      });
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 选择查询结果
    handleSelect(item) {
      this.$router.push({ path: "/checkout", query: { id: item.id } });
    },
    itemcommand(command, userid, username) {
      // 关注
      if (command === "follow") {
        request({
          url: "/user/follow",
          method: "post",
          data: {
            id: userid,
            fansID: this.$store.state.userdata._id,
          },
        }).then((res) => {
          if (res.err_code === 2) {
            return this.$message({
              message: "你已经关注过他/她了",
              offset: 1,
              type: "info",
            });
          } else if (res.err_code === 3) {
            return this.$message({
              message: "该用户已注销,不能关注了",
              offset: 1,
              type: "info",
            });
          } else if (res.err_code === 500) {
            return this.$message({
              message: "服务器错误,请稍后重试！",
              offset: 1,
              type: "error",
            });
          } else {
            this.$message({
              message: `您已成功关注${username}`,
              offset: 1,
              type: "success",
            });
          }
        });
      }
      // 取消关注
      else if (command === "cancelfollow") {
        request({
          url: "/user/cancelfollow",
          method: "post",
          data: {
            id: userid,
            fansID: this.$store.state.userdata._id,
          },
        }).then((res) => {
          if (res.err_code === 2) {
            return this.$message({
              message: "您已取消关注该用户",
              offset: 1,
              type: "info",
            });
          } else if (res.err_code === 500) {
            return this.$message({
              message: "服务器错误,请稍后重试！",
              offset: 1,
              type: "error",
            });
          } else {
            this.$message({
              message: `取消关注用户--${username}`,
              offset: 1,
              type: "success",
            });
          }
        });
      }
      // 查看资料
      else if (command === "seemore") {
        this.$router.push({ path: "/checkout", query: { id: userid } });
      }
      // 加好友
      else if (command === "wantfriend") {
        request({
          url: `/friReq?userid=${userid}&_id=${this.$store.state.userdata._id}`,
        }).then((res) => {
          if (res.err_code === 1) {
            this.$message.info({
              message: "等待对方处理您的好友请求",
              offset: 1,
            });
          } else {
            this.$prompt("请输入验证信息", "好友请求验证信息", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPattern: /^\S{2,15}$/,
              inputErrorMessage: "验证信息是不包含空格的2-15个字符",
            })
              .then(({ value }) => {
                request({
                  url: "/judgeFriend",
                  method: "post",
                  data: {
                    toId: userid,
                    fromId: this.$store.state.userdata._id,
                    fromName: this.$store.state.userdata.nickname,
                    fromMsg: value,
                  },
                }).then((res) => {
                  if (res.err_code === 2) {
                    this.$message.info({
                      message: `您和${username}已经是好友了`,
                      offset: 1,
                    });
                  } else if (res.err_code === 4) {
                    this.$message.info({
                      message: `${username}` + res.msg,
                      offset: 1,
                    });
                  } else if (res.err_code === 5) {
                    this.$message.info({
                      message: `${username}` + res.msg,
                      offset: 1,
                    });
                  } else {
                    this.$message.success({
                      message: `已向${username}发起好友请求，等待对方处理。`,
                      offset: 1,
                    });
                    this.$io.emit("sendFriReq", {
                      to: username,
                      from: this.$store.state.userdata.nickname,
                    });
                  }
                });
              })
              .catch(() => {});
          }
        });
      }
    },
    // 菜单栏
    handleCommand(command) {
      if (command == "a") {
        this.$router.push("/works");
      }
    },
    // 主页更新
    updateHomepage() {
      request({
        url: "/homepage",
      }).then((res) => {
        this.prods = res.data.reverse();
      });
    },
  },
  // 活跃状态
  activated() {
    this.updateHomepage();
    // 获取所有用户列表
    request({
      url: "/getAllUsers",
    }).then((res) => {
      if (res.err_code === 0) {
        this.users = res.data;
      }
    });
  },
  // 创建钩子
  created() {
    this.updateHomepage();
    request({
      url: "/homepage/slide",
    }).then((res) => {
      this.carousel = res.data;
    });
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 44px;
}
.os {
  width: 375px;
  padding-bottom: 49px;
  overflow-y: auto;
}
.addr {
  font-size: 13px;
}
.card {
  width: 100%;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tophead {
  display: flex;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  margin-left: 5px;
}
.name {
  font-weight: 700;
}
.more {
  line-height: 20px;
  margin-right: 3px;
  font-size: 25px;
}
.desc {
  margin: 5px 0;
  padding-left: 40px;
  color: #ec8525;
}
.imageBox {
  display: flex;
  flex-wrap: wrap;
  width: 315px;
  margin-left: 40px;
  /* border: 1px solid #ccc; */
  margin-top: 5px;
}
.imageBox .img {
  width: 103px;
  height: 103px;
  padding: 10px;
  border: 1px solid #ccc;
}

.img img {
  width: 100%;
  height: 100%;
}
.botline {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.carousel {
  border-radius: 20px;
  overflow: hidden;
}
.carousel img {
  width: 100%;
  height: 100%;
}
.scroll-bar {
  padding-left: 10px;
  display: flex;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 5px;
}
.icon {
  font-size: 20px;
  line-height: 30px;
  margin-right: 5px;
  animation: color 2s linear infinite;
}
.box {
  line-height: 30px;
  font-size: 20px;
  overflow: hidden;
}
.animate {
  padding-left: 40px;
  color: #000;
  display: inline-block;
  white-space: nowrap;
  animation: 10s wordsLoop linear infinite normal;
}

@keyframes wordsLoop {
  0% {
    transform: translateX(200px);
    -webkit-transform: translateX(200px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

@-webkit-keyframes wordsLoop {
  0% {
    transform: translateX(200px);
    -webkit-transform: translateX(200px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}
@keyframes color {
  0% {
    color: #8ed6ec;
  }
  50% {
    color: #3ca2dd;
  }
  100% {
    color: #039cc2;
  }
}
.gifBoy {
  width: 100%;
  height: 100%;
  position: relative;
  left: -40px;
  top: 0;
  z-index: 666;
  animation: running 10s ease-in-out infinite;
}
@keyframes running {
  0% {
  }
  100% {
    left: 355px;
  }
}
.usermsg {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
