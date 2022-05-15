<template>
  <div class="create">
    <el-form ref="form" :model="form" size="medium">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编程方式" label-width="70px">
            <el-select v-model="form.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刀具转速" label-width="78px">
            <el-input v-model="form.roundSpeed"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.value === `G90`">
        <el-col :span="12">
          <el-form-item label="刀具坐标 x" label-width="80px">
            <el-input v-model="form.x"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刀具坐标 y" label-width="87px">
            <el-input v-model="form.y"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-input
            type="textarea"
            size="medium"
            :autosize="{ minRows: 12, maxRows: 12 }"
            placeholder="代码生成区"
            v-model="textarea"
            style="min-height: 280px; height: 280px"
            resize="none"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div style="margin: 10px 0"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button @click="onPrev">返回</el-button>
          <el-button type="primary" @click="onCreate">生成</el-button>
          <el-button type="primary" @click="onDownload" :disabled="!isCreate"
            >下载</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { generator } from "../../lib/generator";
import { saveAs } from "../../lib/download";
export default {
  components: {
    "text-block": Text,
  },
  name: "create",
  data() {
    return {
      //存储打印的字符串
      textarea: "",
      code: null,
      isCreate: false,
      form: {
        value: "", //曲线类型
        roundSpeed: "",
        x: null,
        y: null,
      },
      options: [
        {
          value: "G90",
          label: "绝对式",
        },
        {
          value: "G91",
          label: "相对式",
        },
      ],
    };
  },
  methods: {
    onCreate() {
      if (this.commitTest()) {
        this.$message({
          showClose: true,
          message: "代码生成成功!",
          type: "success",
        });
        this.isCreate = true;
        this.textarea = generator(this.$store.state.tool,this.form,this.$store.state.points)
      } else {
        this.$message({
          showClose: true,
          message: "请输入正确参数!",
          type: "error",
        });
      }
    },

    commitTest() {
      return (
        (this.form.value !== "G91" ||
          (this.form.value !== "G90" &&
            this.form.x >= -1000 &&
            this.form.x <= 1000 &&
            this.form.y >= -1000 &&
            this.form.y <= 1000)) &&
        this.form.roundSpeed > 0 &&
        this.form.roundSpeed <= 1000
      );
    },

    //下载文件
    onDownload() {
      this.$store.commit("nextPage");

      if (typeof module !== "undefined" && module.exports) {
        module.exports.saveAs = saveAs;
      } else if (
        typeof define !== "undefined" &&
        define !== null &&
        define.amd !== null
      ) {
        define("FileSaver.js", function () {
          return saveAs;
        });
      }

      // 引入上边的js后，就可以调用生成文本的方法 另外ie下会有中文乱码的问题
      var blob = new Blob([this.textarea], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "g-code.txt");
    },
    onPrev() {
      this.$store.commit("prevPage");
    },
  },
  mounted() {},
};
</script>