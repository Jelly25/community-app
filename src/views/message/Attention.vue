<template>
  <div id="attention">
    <span class="t">关注动态</span>
    <el-collapse v-model="activeName" accordion @change="handleChange">
      <el-collapse-item
        v-for="item in followLists"
        :key="item._id"
        :name="item._id"
      >
        <template slot="title">
          <el-avatar
            shape="square"
            :size="30"
            fit="cover"
            :src="item.avatar"
          ></el-avatar>
          <span style="margin-left: 10px">{{ item.nickname }}</span>
        </template>
        <div v-loading="loading" class="con">
          <el-timeline>
            <el-timeline-item
              :timestamp="item.updatetime"
              placement="top"
              v-for="item in totalProds"
              :key="item._id"
              :icon="
                item.tag
                  ? 'el-icon-picture-outline-round'
                  : 'el-icon-chat-line-square'
              "
              size="large"
              type="primary"
            >
              <div class="card">
                <h4>发表{{ item.tag ? "图片" : "文字" }}动态</h4>
                <i class="card-con">
                  {{ item.tag ? item.desc : item.publishcon }}
                </i>
                <div class="imgbox">
                  <img
                    :src="item"
                    alt=""
                    v-for="(item, index) in item.imgList"
                    :key="index"
                  />
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { request } from "network/request.js";
import axios from "axios";
export default {
  name: "Attention",
  data() {
    return {
      activeName: "",
      followLists: [],
      loading: false,
      totalProds: [],
    };
  },
  activated() {
    request({
      url: `/userfollowLists?id=${this.$store.state.userdata._id}`,
    }).then((res) => {
      this.followLists = res.data;
    });
  },
  methods: {
    handleChange(activeName) {
      this.loading = true;
      axios
        .all([
          request({
            url: `http://127.0.0.1:8081/imgprods?userid=${activeName}`,
          }),
          request({
            url: `http://127.0.0.1:8081/essayprods?userid=${activeName}`,
          }),
        ])
        .then((res) => {
          setTimeout(() => {
            this.loading = false;
            let [res1, res2] = res;
            let totalProds = res1.data.concat(res2.data);
            // 数组对象排序
            if (totalProds.length !== 0) {
              totalProds = totalProds.sort((a, b) => {
                let val1 = +new Date(a.updatetime);
                let val2 = +new Date(b.updatetime);
                return val2 - val1;
              });
            }
            this.totalProds = totalProds;
          }, 1500);
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: "请求出错,请稍后重试！",
            offset: 1,
            type: "warning",
          });
        });
    },
  },
};
</script>

<style scoped>
.con {
  padding-left: 10px;
  padding-top: 5px;
}
.t {
  display: block;
  margin-bottom: 10px;
}
#attention {
  padding: 10px 20px 49px;
}
.card {
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.card-con {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.imgbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.imgbox img {
  width: 33%;
  height: 91px;
  margin-bottom: 1px;
}
</style>
