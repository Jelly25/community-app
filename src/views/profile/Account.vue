<template>
  <div id="account">
    <el-form
      ref="form"
      :model="form"
      label-position="right"
      label-width="80px"
      style="width: 80%; margin: 0 auto"
    >
      <el-form-item
        label="修改昵称"
        prop="nickname"
        :rules="[
          {
            pattern: /^\S{2,8}$/,
            message: '用户名由2-8位非空格字符组成',
          },
        ]"
      >
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="保密"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.birthday"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          @blur="birthToAge"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
        :rules="[{ pattern: /^\d{1,2}$/, message: '年龄只能为0-99之间的整数' }]"
      >
        <el-input v-model.number="form.age" :disabled="isdisabled"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <v-distpicker
          @selected="OnSelected"
          @province="getprovince"
          @city="getcity"
          :province="province"
          :city="city"
          :area="area"
        ></v-distpicker>
      </el-form-item>
      <el-form-item
        label="爱好"
        prop="hobby"
        :rules="[
          {
            pattern: /^\S{1,15}$/,
            message: '爱好在15个字符以内,不包含空格',
          },
        ]"
      >
        <el-input v-model="form.hobby"></el-input>
      </el-form-item>
      <el-form-item
        label="个性签名"
        prop="signature"
        :rules="[
          {
            pattern: /^\S{0,20}$/,
            message: '个性签名不能包含空格,不超过20个字符',
          },
        ]"
      >
        <el-input v-model="form.signature"></el-input>
      </el-form-item>
      <el-form-item label="上传头像">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="http://127.0.0.1:8081/uploadAvatar"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeAccount">立即修改</el-button>
        <el-button @click="cancelAccount">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入网络请求
import { request } from "network/request";
// 导入省市区vdistpicker
import VDistpicker from "v-distpicker";
export default {
  name: "Account",
  components: {
    VDistpicker,
  },
  data() {
    return {
      headers: {
        token: localStorage.getItem("token"),
      },
      // 表单值
      form: {
        nickname: this.$store.state.userdata.nickname,
        status: this.$store.state.userdata.status,
        signature: this.$store.state.userdata.signature,
        birthday: this.$store.state.userdata.birthday,
        gender:
          this.$store.state.userdata.gender === -1
            ? "保密"
            : this.$store.state.userdata.gender === 1
            ? "女"
            : "男",
        age: this.$store.state.userdata.age,
        address: this.$store.state.userdata.address,
        hobby: this.$store.state.userdata.hobby,
        avatar: this.$store.state.userdata.avatar,
      },
      temp: "",
      imageUrl: "",
      isdisabled: false,
      province: this.$store.state.userdata.address
        ? this.$store.state.userdata.address.split("-")[0]
        : "",
      city: this.$store.state.userdata.address
        ? this.$store.state.userdata.address.split("-")[1]
        : "",
      area: this.$store.state.userdata.address
        ? this.$store.state.userdata.address.split("-")[2]
        : "",
    };
  },
  methods: {
    // 图片上传成功钩子
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.avatar = "http://127.0.0.1:8081/" + res.data.path;
    },
    // 图片上传前钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error({
          message: "上传头像图片只能是 JPG或PNG 格式!",
          offset: 1,
        });
      }
      if (!isLt2M) {
        this.$message.error({
          message: "上传头像图片大小不能超过 2MB!",
          offset: 1,
        });
      }
      return (isJPG || isPNG) && isLt2M;
    },
    // 设置生日自动生成年龄
    birthToAge() {
      if (this.form.birthday !== null) {
        var birthYear = this.form.birthday.substr(0, 4);
        var curYear = new Date().getFullYear();
        this.form.age = curYear - birthYear;
        this.isdisabled = true;
      } else {
        this.form.age = "";
        this.isdisabled = false;
      }
    },
    // 省
    getprovince(data) {
      if (data.value === "省") {
        this.form.address = null;
        return false;
      }
      this.temp = data.value;
      this.form.address = this.temp;
    },
    // 省+市
    getcity(data) {
      if (data.value === "市") {
        return false;
      }
      this.form.address = this.temp + "-" + data.value;
    },
    // 省市区
    OnSelected(data) {
      if (data.province.value === "省" || data.city.value === "市") {
        return false;
      }
      this.form.address =
        data.province.value + "-" + data.city.value + "-" + data.area.value;
    },
    // 上传修改
    changeAccount() {
      if (this.form.nickname === "") {
        this.form.nickname = this.$store.state.userdata.nickname;
      }
      if (this.form.gender === "男") {
        this.form.gender = 0;
      } else if (this.form.gender === "女") {
        this.form.gender = 1;
      } else {
        this.form.gender = -1;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在上传更新资料",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 2, 0.2)",
      });
      setTimeout(() => {
        request({
          url: "/profile/account",
          method: "post",
          data: {
            id: this.$store.state.userdata._id,
            form: this.form,
          },
        }).then((res) => {
          this.$store.dispatch("asyncupdateUserData", res.data);
          this.$router.back("/profile/main");
        });
        loading.close();
        this.$message({
          message: "修改完成",
          type: "success",
          offset: 1,
        });
      }, 3000);
    },
    // 取消修改
    cancelAccount() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
#account {
  margin-top: 44px;
  padding-top: 20px;
  padding-bottom: 50px;
}
.avatar-uploader {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border: 1px dotted #333;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>