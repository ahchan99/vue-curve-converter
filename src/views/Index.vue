<template>
  <div class="index">
    <el-row>
      <el-col :span="24">
        <h2><i class="el-icon-upload"></i> 面向非圆曲线的指令生成器</h2>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-card shadow="always" class="canvas-card">
          <three-js-board></three-js-board>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <el-steps
            :active="parseFloat($store.state.active)"
            finish-status="success"
            :align-center="true"
          >
            <el-step title="曲线输入" icon="el-icon-edit"></el-step>
            <el-step title="拟合方式" icon="el-icon-setting"></el-step>
            <el-step title="指令生成" icon="el-icon-document-checked"></el-step>
          </el-steps>
          <el-divider></el-divider>

          <curve-form v-if="this.$store.state.active === 0"></curve-form>
          <method-form v-else-if="this.$store.state.active === 1"></method-form>
          <create-form v-else-if="this.$store.state.active === 2 || this.$store.state.active === 3"></create-form>


          <!--中心控制板 有清屏幕 上一步下一步-->
          <el-row class="buttonCenter">
            <!-- <el-divider></el-divider> -->
            <!-- <el-button type="primary"  icon="el-icon-edit" circle></el-button>
            <el-button type="primary"  icon="el-icon-search" circle></el-button> -->
            <!-- <el-button type="primary" icon="el-icon-back" circle @click="prev"></el-button>
            <el-button type="primary" icon="el-icon-right" circle @click="next"></el-button> -->
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
.buttonCenter {
  text-align: center;
  position: fixed;
  left: 850px;
  right: 0;
  bottom: 30px;
}
.el-row {
  text-align: center;
  border-radius: 5px;
  margin-bottom: 15px;
}
.el-col {
  border-radius: 5px;
}
.el-card {
  min-height: 100%;
  height: 100%;
}
.el-steps {
  width: 100%;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
}
</style>

<script>
import Board from "./component/Board.vue";
import Curve from "./form/Curve.vue";
import Method from "./form/Method.vue";
import Create from "./form/Create.vue";
export default {
  name: "index",
  components: {
    "three-js-board": Board,
    "curve-form": Curve,
    "create-form": Create,
    "method-form": Method,
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    prev() {
      if (this.active-- <= 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 3;
    },
  },
};
</script>
