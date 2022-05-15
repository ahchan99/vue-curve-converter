<template>
  <div class="method">
    <el-form ref="form" :model="form" size="medium">
      <el-row>
        <el-col :span="12">
          <el-form-item label="拟合方式" label-width="68px">
            <el-select v-model="form.method" placeholder="请选择">
              <el-option
                v-for="item in method"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="`${
              this.form.method === `equalChord` ? `弦长` : `误差`
            }长度 L`"
            label-width="98px"
          >
            <el-input v-model="form.L"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="刀补方式" label-width="68px">
            <el-select v-model="form.options" placeholder="请选择">
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
          <el-form-item label="刀具半径 D" label-width="98px">
            <el-input v-model="form.D"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="拟合方向" label-width="68px">
            <el-select v-model="form.direction" placeholder="请选择">
              <el-option
                v-for="item in direction"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加工余量 e" label-width="98px">
            <el-input v-model="form.e"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="起点 x" label-width="58px">
            <el-input v-model="form.x"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起点 y" label-width="58px">
            <el-input v-model="form.y"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="显示刀具" label-width="75px">
            <el-switch
              v-model="$store.state.isSlowTool"
              active-color="#409EFF"
              inactive-color="#ff4949"
              :disabled="!isCreate"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="速度 v" label-width="58px">
            <el-input v-model="speed" :disabled="!isCreate"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">&nbsp;</el-col>
        <el-col :span="10">
          <div class="block">
            <el-slider
              v-model="coefficient"
              :format-tooltip="formatTooltip"
              :disabled="!isCreate"
            ></el-slider>
          </div>
        </el-col>
      </el-row>

      <el-row :disabled="!isCreate">
        <el-col :span="10">
          <el-form-item label="时间 t" label-width="58px">
            <el-input v-model="time" :disabled="!isCreate"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-progress
            type="circle"
            :percentage="$store.state.percentage"
            :width="90"
          ></el-progress>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="line" :span="2">&nbsp;</el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-button @click="onPrev">返回</el-button>
          <el-button type="primary" @click="onSolve">拟合</el-button>
          <el-button type="primary" @click="onPlay" :disabled="!(isCreate&&$store.state.isSlowTool)"
            >仿真</el-button
          >
          <el-button @click="onNext" :disabled="!isCreate">下一步</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "method",
  data() {
    return {
      isCreate: false,
      isSimlutation: false,
      start: null,
      time: null,
      coefficient: 100,
      speed: null,
      form: {
        method: "", //拟合方式
        options: "", //刀补方式
        direction: "", //拟合方向
        L: null,
        D: null,
        e: null,
        x: null,
        y: null,
        v: null,
      },
      tool: {
        D: null,
        beginX: null,
        beginY: null,
        x: null,
        y: null,
        v: null,
      },
      method: [
        {
          value: "equalChord",
          label: "等弦长",
        },
        {
          value: "equalError",
          label: "等误差",
        },
      ],
      options: [
        // {
        //   value: "G40",
        //   label: "取消刀补",
        // },
        {
          value: "G41",
          label: "左刀补",
        },
        {
          value: "G42",
          label: "右刀补",
        },
      ],
      direction: [
        {
          value: "clockwise",
          label: "顺时针",
        },
        {
          value: "anit-clockwise",
          label: "逆时针",
        },
      ],
    };
  },
  computed:{
    timer(){
      return this.$store.state.percentage
    },
  },
  watch:{

    timer:function(){
      if(this.start === null){
        let date = new Date()
        this.start = date.getTime()
      }

      if(this.$store.state.percentage === 100)
        this.start = null
      else{
        let date = new Date()
        this.time = parseFloat(date.getTime() - this.start)/ 1000 + 's'
      }
      console.log('开始时间'+this.start)
    },

  },
  methods: {
    formatTooltip(val) {
      return val / 100;
    },
    onSolve() {

    //  if (this.form.method !== "equalError") {
    //     this.$message({
    //       showClose: true,
    //       message: "改功能还未开发，敬请期待！",
    //       type: "warning",
    //     });
    //     return;
    //   }

      if (this.commitTest()) {
        this.$message({
          showClose: true,
          message: "曲线拟合成功!",
          type: "success",
        });
        this.initTool()
        this.$store.commit("solveSourceCurve", this.form);
        this.isCreate = true
      } else {
        this.$message({
          showClose: true,
          message: "请输入正确参数！",
          type: "error",
        });
      }
      console.log(this.form);
    },
    initTool() {
      this.tool.beginX = this.form.x;
      this.tool.beginY = this.form.y;
      this.tool.D = this.form.D;
      this.$store.commit("displayTool", this.tool);
    },
    onPlay(){
        let s = this.coefficient/100 * this.speed
        s = parseFloat(s)
        console.log(s)
        if (s>=1) {
        this.tool.v = s
        this.$message({
          showClose: true,
          message: "开始仿真!",
          type: "success",
        });
        //this.initTool()
        this.$store.commit("simulationTool",this.tool);
        this.isSimlutation = true
      }else {
        this.$message({
          showClose: true,
          message: "请输入正确刀具移动速度！",
          type: "error",
        });
      }
    },
    onPrev() {
      this.$store.commit("prevPage");
      console.log(this.$store.state.active);
    },
    onNext() {
      if (this.isCreate === false||this.isSimlutation == false) {
        this.$message({
          showClose: true,
          message: "请先拟合曲线！",
          type: "error",
        });
      } else {
        this.$store.commit("nextPage");
        console.log(this.$store.state.active);
      }
    },
    //表单校验
    commitTest() {
      return (
        this.form.L >= 0.1 &&
        this.form.L <=50  &&
        this.form.D > 0 &&
        this.form.D <= 50 &&
        this.form.e >= 0 &&
        this.form.e <= 50 &&
        this.form.x >= -1000 &&
        this.form.x <= 1000 &&
        this.form.y >= -1000 &&
        this.form.y <= 1000 &&
        this.form.method !== null &&
        this.form.options !== null &&
        this.form.direction !== null
      );
    },
  },
};
</script>