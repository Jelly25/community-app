<template>
  <div id="seemore">
    <div class="bg">
      <div class="back el-icon-back" @click="back"></div>
      <div
        class="moreOP el-icon-plus"
        v-if="usermessage.nickname !== $store.state.userdata.nickname"
        @click="addFri"
      ></div>
      <div class="avatar">
        <img :src="usermessage.avatar" alt="" />
      </div>
      <div class="nickname">{{ usermessage.nickname }}</div>
      <div class="detail">
        <div class="box prods">
          <span>{{ prodsNum || "--" }}</span>
          <span>作品</span>
        </div>
        <div class="box praise">
          <span>{{ praiseNum || "--" }}</span>
          <span>获赞</span>
        </div>
        <div class="box fans">
          <span>{{ usermessage.fans.length || "--" }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <div class="basic">
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">个性签名</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.signature || "--" }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">爱好</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.hobby || "--" }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">生日</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.birthday || "--" }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">年龄</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.age || "--" }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">邮箱</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.email || "--" }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">性别</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{
              usermessage.gender === 0
                ? "男"
                : usermessage.gender === 1
                ? "女"
                : "保密"
            }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">地址</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            {{ usermessage.address || "--" }}
          </div></el-col
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { request } from "network/request";
export default {
  name: "See",
  data() {
    return {
      usermessage: null,
      prodsNum: 0,
      praiseNum: 0,
    };
  },
  activated() {
    this.$nextTick(() => {
      request({
        url: `/usermessage?userid=${this.$route.query.id}`,
      }).then((res) => {
        this.usermessage = res.data;
      });
      request({
        url: `/userprodsNum?userid=${this.$route.query.id}`,
      }).then((res) => {
        this.prodsNum = res.data;
      });
      request({
        url: `/userpraiseNum?userid=${this.$route.query.id}`,
      }).then((res) => {
        this.praiseNum = res.data;
      });
    });
  },
  methods: {
    back() {
      this.$router.back();
    },
    addFri() {
      request({
        url: `/friReq?userid=${this.$route.query.id}&_id=${this.$store.state.userdata._id}`,
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
                  toId: this.$route.query.id,
                  fromId: this.$store.state.userdata._id,
                  fromName: this.$store.state.userdata.nickname,
                  fromMsg: value,
                },
              }).then((res) => {
                if (res.err_code === 2) {
                  this.$message.info({
                    message: `您和${this.usermessage.nickname}已经是好友了`,
                    offset: 1,
                  });
                } else if (res.err_code === 4) {
                  this.$message.info({
                    message: `${this.usermessage.nickname}` + res.msg,
                    offset: 1,
                  });
                } else if (res.err_code === 5) {
                  this.$message.info({
                    message: `${this.usermessage.nickname}` + res.msg,
                    offset: 1,
                  });
                } else {
                  this.$message.success({
                    message: `已向${this.usermessage.nickname}发起好友请求，等待对方处理。`,
                    offset: 1,
                  });
                  this.$io.emit("sendFriReq", {
                    to: this.usermessage.nickname,
                    from: this.$store.state.userdata.nickname,
                  });
                }
              });
            })
            .catch(() => {});
        }
      });
    },
  },
};
</script>

<style scoped>
.bg {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: tomato;
  background: url("~assets/userbg.jpg") no-repeat center;
  background-size: cover;
}
.back {
  height: 30px;
  line-height: 30px;
  font-size: 30px;
  font-weight: 700;
  margin: 10px 0 0 10px;
  color: #ffffff;
  cursor: pointer;
}
.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.nickname {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  font-weight: 700;
}
.detail {
  display: flex;
  padding: 5px 20px 0;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  justify-content: space-around;
}
.detail .box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  width: 33.33%;
  height: 50px;
}
.prods,
.praise {
  border-right: 3px solid #e9e9e9;
}
.basic {
  margin-top: 20px;
  padding: 0 10px;
  text-align: center;
}
.grid-content {
  padding: 5px 0;
  margin: 5px 0;
  border: 5px double #ccc;
  height: 35px;
}
.moreOP {
  float: right;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin: 10px 10px 0 0;
  font-size: 25px;
  cursor: pointer;
}
</style>
