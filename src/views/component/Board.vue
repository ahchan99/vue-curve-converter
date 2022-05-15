<template>
  <div class="three-js-body">
    <canvas
      id="c"
      class="three-js-item"
      :width="canvasWidth"
      :height="canvasHeight"
    >
    </canvas>
  </div>
</template>
<script type="module">
import * as THREE from "three";
import { OrbitControls } from "../../lib/camera";
import { ObjectFactory } from "../../lib/object";

export default {
  name: "board",
  data() {
    return {
      canvasWidth: 580,
      canvasHeight: 550,
      canvas: null,
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      light: null,
      object: null,
      solution: null,
      objectFactory: null,
      pointsFactory: null,
      tool: null,
      speed: null,
      points: null,
      startTime: null,
      isFinish: false,
      index: 0,
    };
  },
  mounted() {
    this.initCanvas();

    this.objectFactory = new ObjectFactory(this.scene);
  },
  computed: {
    sourceCurve() {
      return this.$store.state.drawCurveSignal;
    },
    solveCurve() {
      return this.$store.state.solveCurveSignal;
    },
    displayTool() {
      return this.$store.state.isSlowTool;
    },
    simulationTool() {
      return this.$store.state.simulationSignal;
    },
  },
  watch: {
    sourceCurve: function () {
      // if(newd - old == 1){
      if (this.object != null) this.scene.remove(this.object);
      console.log("接受");
      this.object = this.objectFactory.create(this.$store.state.curve);
      // }
    },
    solveCurve: function () {
      // if(newd - old == 1){
      if (this.solution != null) this.scene.remove(this.solution);
      console.log("计算");
      this.solution = this.objectFactory.solve(
        this.$store.state.curve,
        this.$store.state.solve
      );
      //刀的位置初始化
      if (this.tool != null) this.scene.remove(this.tool);
      this.tool = this.objectFactory.createTool(this.$store.state.tool);
      this.tool.visible = this.$store.state.isSlowTool;
      // }
    },
    displayTool: function () {
      console.log("刀具");
      if (this.tool !== null) this.tool.visible = this.$store.state.isSlowTool;
    },
    simulationTool: function () {
      console.log("仿真");
      //复位
      this.index = 0;
      this.isFinish = false;
      this.$store.state.tool.v = parseFloat(this.$store.state.tool.v);
      this.$store.commit(
        "reflashPercentage",0);
      this.speed = this.$store.state.tool.v;
      console.log("speed" + this.speed);
      this.points = this.objectFactory.getSimulationMovePoints();
      this.$store.commit('createCode', this.objectFactory.getCodeMovePoints())
    },
  },
  methods: {
    initCanvas: function () {
      let canvas = document.querySelector("#c");
      this.renderer = new THREE.WebGLRenderer({ canvas });
      //设置透视摄像头
      // this.camera = new THREE.PerspectiveCamera(
      //   45,
      //   this.canvasWidth / this.canvasHeight,
      //   0.1,
      //   1000
      // );
      // this.camera.position.set(0, 0, 25);
      // this.camera.up.set(0, 0, 1);

      //正交摄像头
      this.camera = new THREE.OrthographicCamera(
        this.canvasWidth / -2,
        this.canvasWidth / 2,
        this.canvasHeight / 2,
        this.canvasHeight / -2,
        1,
        1000
      );
      this.camera.zoom = 25;
      this.camera.position.set(0, 0, 25);
      this.camera.up.set(0, 0, 1);

      this.scene = new THREE.Scene();
      //设置背景颜色
      this.scene.background = new THREE.Color(0xffffff);
      //this.scene.background = new THREE.Color(0xF0F8FF);
      //this.scene.background = new THREE.Color(0xf5f5dc);
      //设置灯光
      this.light = new THREE.PointLight(0xffffff, 3);
      this.scene.add(this.light);
      //生成网格
      let gridHelper = new THREE.GridHelper(500, 500, 0x000000, 0xdcdcdc);
      gridHelper.setRotationFromEuler(new THREE.Euler(1.57, 0, 0, "XYZ"));
      //防止线重合消失
      gridHelper.position.z -= 0.1;
      this.scene.add(gridHelper);

      //控制摄像机
      const controls = new OrbitControls(this.camera, canvas);
      controls.target.set(0, 0, 0);
      controls.update();
      function resizeRendererToDisplaySize(r) {
        const c = r.domElement;
        const width = c.clientWidth;
        const height = c.clientHeight;
        const needResize = c.width !== width || c.height !== height;
        if (needResize) {
          r.setSize(width, height, false);
        }
        return needResize;
      }
      let _this = this;
      //time 渲染时间搓
      function render(time) {
        time *= 0.05;
        //相机控制
        if (resizeRendererToDisplaySize(_this.renderer)) {
          const c = _this.renderer.domElement;
          _this.camera.aspect = c.clientWidth / c.clientHeight;
          _this.camera.updateProjectionMatrix();
        }

        //先不要时间
        if (_this.points !== null && _this.tool !== null && !_this.isFinish) {
          //移动
          _this.index = _this.index + (1 * _this.speed) / 60;
          //乘上一个速度系数(输入要60到6000)
          let i = parseInt(_this.index);
          if (i >= _this.points.length - 1) {
            _this.isFinish = true;
            _this.tool.position.set(
              _this.points[_this.points.length - 1].x,
              _this.points[_this.points.length - 1].y,
              0
            );
          } else
            _this.tool.position.set(_this.points[i].x, _this.points[i].y, 0);

          _this.$store.commit(
            "reflashPercentage",
            parseInt((100 * i) / (_this.points.length - 1))
          );
        }

        _this.renderer.render(_this.scene, _this.camera);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
      //渲染
      //this.renderer.render(this.scene, this.camera);
      //this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    },
  },
};
</script>

<style scoped>
.three-js-item {
  width: 100%;
  height: 100%;
  display: block;
}
.three-js-body {
  margin: 0;
  height: 100%;
}
</style>