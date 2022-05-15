<template>
  <div class="curve">
    <el-form ref="form" :model="form" size="medium">
      <el-row>
        <el-col :span="24">
          <el-form-item label="曲线类型" label-width="75px">
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
      </el-row>
      <el-row v-if="form.value === `cam`">
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="近休止角度 n" label-width="95px">
              <el-input v-model="form.near"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="远休止角度 f" label-width="95px">
              <el-input v-model="form.far"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基圆半径 b" label-width="95px">
              <el-input v-model="form.baseRadius"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推程起点 θ" label-width="95px">
              <el-input v-model="form.beginPoint"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="中心 x" label-width="58px">
              <el-input v-model="form.x"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中心 y" label-width="58px">
              <el-input v-model="form.y"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="旋转 θ" label-width="58px">
              <el-input v-model="form.turnRound"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
                <el-row>
          <el-col :span="8">
            <el-form-item label="行程 h" label-width="58px">
              <el-input v-model="form.h"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-row>
      <el-row v-if="form.value !== `` && form.value !== `cam`">
        <el-row>
          <el-col :span="8">
            <el-form-item label="中心 x" label-width="58px">
              <el-input v-model="form.x"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中心 y" label-width="58px">
              <el-input v-model="form.y"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="旋转 θ" label-width="58px">
              <el-input v-model="form.turnRound"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="8">
          <el-form-item
            label="参数 k"
            label-width="58px"
            v-if="form.value === `power` || form.value === `conic`"
          >
            <el-input v-model="form.k"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="参数 a"
            label-width="58px"
            v-if="form.value !== `cam`"
          >
            <el-input v-model="form.a"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="参数 b"
            label-width="58px"
            v-if="
              form.value !== `heart` &&
              form.value !== `cam` &&
              form.value !== `conic`
            "
          >
            <el-input v-model="form.b"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            :label="this.rangeType"
            label-width="115px"
            v-if="
              form.value !== `` &&
              form.value !== `ellipse` &&
              form.value !== `cam`
            "
          >
            <el-col :span="6">
              <el-input v-model="form.begin"></el-input>
            </el-col>
            <el-col class="line" :span="3">-</el-col>
            <el-col :span="6">
              <el-input v-model="form.end"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-col :span="24">
            <el-button type="primary" @click="onSubmit">创建</el-button>

            <el-button @click="onNext" :disabled="state === `notCreate`"
              >下一步</el-button
            >
          </el-col>
          <!-- <el-button type="primary" @click="onClear">清空界面</el-button> -->
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "curve",
  data() {
    return {
      state: "notCreate",
      rangeType: "",
      form: {
        value: "", //曲线类型
        k: null,
        a: null,
        b: null,
        x: null,
        y: null,
        turnRound: null,
        begin: null,
        end: null,
        near: null,
        far: null,
        beginPoint: null,
        h: null,
        camType: "",
        baseRadius: null,
      },
      options: [
        {
          value: "ellipse",
          label: "椭圆",
        },
        {
          value: "helix",
          label: "螺旋线",
        },
        // {
        //   value: "conic",
        //   label: "抛物线",
        // },
        // {
        //   value: "power",
        //   label: "幂函数",
        // },
        // {
        //   value: "heart",
        //   label: "心脏线",
        // },
        // {
        //   value: "cam",
        //   label: "凸轮",
        // },
      ],
    };
  },
  watch: {
    "form.value": function () {
      if (this.form.value === "conic" || this.form.value === "power")
        this.rangeType = "定义域 (x1,x2)";
      else this.rangeType = "定义域 (θ1,θ2)";
      deep: true;
    },
  },
  methods: {
    onSubmit() {
      if (this.form.value === "") {
        this.$message({
          showClose: true,
          message: "请选择曲线类型！",
          type: "error",
        });
        return;
      }
      if (this.form.value !== "ellipse" && this.form.value !== "helix") {
        this.$message({
          showClose: true,
          message: "该功能还未开发，敬请期待！",
          type: "warning",
        });
        return;
      }
      if (this.confirmTest() && this.commonTest()) {
        this.$message({
          showClose: true,
          message: "曲线生成成功!",
          type: "success",
        });
        //console.log(this.form);
        this.$store.commit("drawSourceCurve", this.form);
        console.log(this.$store.state.drawCurveSignal);
        console.log(this.$store.state.curve);
        this.state = "isCreate";
      } else {
        this.$message({
          showClose: true,
          message: "请输入正确参数！",
          type: "error",
        });
      }
    },
    onNext() {
      if (this.state === "notCreate") {
        this.$message({
          showClose: true,
          message: "请先创建曲线！",
          type: "error",
        });
      } else if (this.state === "isCreate") {
        this.$store.commit("nextPage");
        console.log(this.$store.state.active);
      }
    },
    commonTest() {
      return (
        this.form.x >= -1000 &&
        this.form.x <= 1000 &&
        this.form.y >= -1000 &&
        this.form.y <= 1000 &&
        this.form.turnRound >= 0 &&
        this.form.turnRound < 360
      );
    },
    confirmTest() {
      if (this.form.value === "") return false;
      if (this.form.value === "ellipse")
        return (
          this.form.a > 0 &&
          this.form.a < 1000 &&
          this.form.b > 0 &&
          this.form.b < 1000
        );
      if (this.form.value === "helix")
        return (
          this.form.a > 0 &&
          this.form.a < 1000 &&
          this.form.b > 0 &&
          this.form.b < 1000
        ); //&&this.form.x1>-1000&&this.form.x2<1000&&x1<x2
      if (this.form.value === "conic")
        return (
          this.form.k > 0 &&
          this.form.k < 1000 &&
          this.form.b > 0 &&
          this.form.b < 1000 &&
          this.form.begin > -1000 &&
          this.form.end < 1000 &&
          this.form.begin < this.form.end
        );
      if (this.form.value === "power")
        return (
          this.form.a > 0 &&
          this.form.a < 1000 &&
          this.form.k > 0 &&
          this.form.k < 1000 &&
          this.form.b > 0 &&
          this.form.b < 1000 &&
          this.form.begin > -1000 &&
          this.form.end < 1000 &&
          this.form.begin < this.form.end
        );
      if (this.form.value === "heard")
        return (
          this.form.a > 0 &&
          this.form.a < 1000 &&
          this.form.x1 > -1000 &&
          this.form.x2 < 1000 &&
          this.form.begin < this.form.end
        );
      if (this.form.value === "cam") return false;
    },
  },
};
</script>
<style scoped>
.el-row {
  margin-bottom: 10px;
}
.el-col {
  border-radius: 4px;
}
</style>