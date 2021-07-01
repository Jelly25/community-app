<template>
  <div id="work">
    <div id="container"></div>
    <nav-bar>
      <span
        slot="left"
        class="el-icon-back"
        style="font-size: 20px; line-height: 44px"
        @click="back"
      ></span>
      <h3 slot="middle">发布一个你的作品</h3>
      <span
        slot="right"
        class="el-icon-s-promotion"
        style="font-size: 20px; line-height: 44px"
        @click="pub"
      ></span>
    </nav-bar>
    <el-form
      style="margin: 80px auto 0"
      v-loading.fullscreen.lock="fullscreenLoading"
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="50px"
      class="demo-ruleForm"
      ><el-form-item label="标签" prop="tag">
        <el-select
          multiple
          collapse-tags
          v-model="form.tag"
          clearable
          placeholder="给你的作品添加一个或多个标签"
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item label="定位" prop="location">
        <el-input
          placeholder="给你的作品添加一个定位"
          v-model="form.location"
          v-loading="loading"
          disabled
        >
          <i
            slot="suffix"
            class="el-icon-map-location"
            @click="locate"
            style="
              font-size: 20px;
              cursor: pointer;
              margin-right: 5px;
              line-height: 40px;
              color: #000;
              font-weight: 700;
            "
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item label="配文" prop="desc">
        <el-input placeholder="文案在这里~" v-model="form.desc"> </el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgList">
        <el-upload
          ref="upload"
          action="http://127.0.0.1:8081/uploadImg"
          accept="image/jpeg,image/png"
          :headers="headers"
          multiple
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="9"
          class="img-upload"
          :on-exceed="handleLimit"
          :on-success="handleImgSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog title="查看" :visible.sync="dialogVisible" center>
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
// 导入地图
import MapLoader from "@/plugins/amap.js";
import { request } from "network/request.js";
export default {
  name: "Work",
  components: {
    NavBar,
  },
  mounted() {
    MapLoader("20bc5b3fa71cb53da5e6ede456a484f2")
      .then((Amap) => {
        let map = new Amap.Map("container");
        AMap.plugin("AMap.CitySearch", () => {
          this.citySearch = new AMap.CitySearch();
        });
      })
      .catch((err) => {});
  },
  data() {
    var checkImg = (rule, value, callback) => {
      if (this.form.imgFileList.length === 0) {
        callback(new Error("请至少上传一张图片！"));
      } else {
        callback();
      }
    };
    return {
      headers: {
        token: localStorage.getItem("token"),
      },
      dialogImageUrl: "",
      dialogVisible: false,
      citySearch: null,
      loading: false,
      fullscreenLoading: false,
      form: {
        tag: [],
        location: "",
        imgFileList: [],
        desc: "",
      },
      rules: {
        tag: [
          { required: true, message: "请至少选择一个标签", trigger: "blur" },
        ],
        location: [{ required: true, message: "请添加定位", trigger: "blur" }],
        desc: [
          { min: 0, max: 15, message: "文案不能超过15个字符", trigger: "blur" },
        ],
        imgList: [{ required: true, validator: checkImg, trigger: "blur" }],
      },
      options: [
        {
          value: "生活日常",
          label: "生活日常",
        },
        {
          value: "旅游风景",
          label: "旅游风景",
        },
        {
          value: "视觉艺术",
          label: "视觉艺术",
        },
        {
          value: "颜值担当",
          label: "颜值担当",
        },
        {
          value: "可爱萌宠",
          label: "可爱萌宠",
        },
        {
          value: "就是要分享",
          label: "就是要分享",
        },
        {
          value: "一起来斗图",
          label: "一起来斗图",
        },
        {
          value: "自拍",
          label: "自拍",
        },
        {
          value: "明星偶像",
          label: "明星偶像",
        },
      ],
    };
  },
  methods: {
    // 图片上传成功钩子
    handleImgSuccess(res, file, fileList) {
      this.form.imgFileList.push("http://127.0.0.1:8081/" + res.data.path);
    },
    // 上传
    pub() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "上传中...",
            spinner: "el-icon-loading",
            background: "rgba(55, 35, 199, 0.2)",
          });
          setTimeout(() => {
            request({
              url: "/homepage/prod",
              method: "post",
              data: {
                userid: this.$store.state.userdata._id,
                username: this.$store.state.userdata.nickname,
                useravatar: this.$store.state.userdata.avatar,
                usergender: this.$store.state.userdata.gender,
                tag: this.form.tag,
                location: this.form.location,
                desc: this.form.desc,
                imgList: this.form.imgFileList,
                updatetime: this.$TF(),
              },
            }).then((res) => {
              if (res.err_code === 500) {
                this.$message.error({
                  message: "服务器错误,请稍后重试",
                  offset: 1,
                });
              } else {
                this.$router.push("/home");
                this.$message({
                  message: "上传成功",
                  offset: 1,
                  type: "success",
                });
              }
            });
            loading.close();
          }, 3000);
        } else {
          this.$message.error({
            message: "完成必填项才可以上传",
            offset: 1,
          });
          return false;
        }
      });
    },
    // 返回
    back() {
      this.$confirm("您还没有发布,是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.back();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
            offset: 1,
          });
        });
    },
    // 定位
    locate() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.citySearch.getLocalCity((status, result) => {
          if (status === "complete" && result.info === "OK") {
            this.form.location = result.province + result.city;
            this.$message({
              message: "定位成功",
              offset: 1,
              type: "success",
            });
          } else {
            this.$message({
              message: "定位失败,请稍后重试",
              offset: 1,
              type: "error",
            });
          }
        });
      }, 2000);
    },
    // 删除钩子
    handleRemove(file, fileList) {
      this.form.imgFileList = [];
      fileList.forEach((ele) => {
        this.form.imgFileList.push(
          "http://127.0.0.1:8081/" + ele.response.data.path
        );
      });
    },
    // 预览钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 个数钩子
    handleLimit(files, fileList) {
      this.$message({
        message: "最多只能上传9张图片！",
        type: "info",
        offset: 1,
      });
    },
  },
};
</script>

<style>
.img-upload {
  display: flex;
  flex-wrap: wrap;
}
.el-upload-list__item {
  width: 81px !important;
  height: 81px !important;
}
.el-upload-list__item-actions {
  width: 81px !important;
  height: 81px !important;
}
.img-upload img {
  width: 81px !important;
  height: 81px !important;
}
.el-upload--picture-card {
  width: 81px;
  height: 81px;
  line-height: 90px;
}
.el-dialog {
  width: 90%;
}
</style>
