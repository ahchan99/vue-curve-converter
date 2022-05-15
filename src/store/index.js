import Vue from 'vue'
import Vuex from 'vuex'

//全局单例模式

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    points: null,
    active: 0, 
    drawCurveSignal: 1,
    solveCurveSignal: 1,
    simulationSignal: 1,
    isSlowTool: false,
    percentage: 0,
    //生成曲线的JSON
    curve: {
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
      beginPoint:null,
      h: null,
      camType: "",
      baseRadius: null,
    },
    //计算曲线的JSON
    solve: {
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
    //刀具的JSON
    tool: {
      D: 0,
      beginX: 0,
      beginY: 0,
      x: 0,
      y: 0,
      //刀具移动速度
      v: 0,
    }
  },
  mutations: {

    prevPage(state) {
      if (state.active-- <= 0) state.active = 0;
    },
    nextPage(state) {
      if (state.active++ > 2) state.active = 3;
    },

    drawSourceCurve(state, form) {
      state.drawCurveSignal++
      state.curve = form
    },
    solveSourceCurve(state, form) {
      state.solveCurveSignal++
      state.solve = form
    },
    displayTool(state, form) {
      state.tool = form
    },
    simulationTool(state,form){
      state.simulationSignal++
      state.tool = form
    },
    reflashPercentage(state,nums){
      state.percentage = nums>=100?100:nums
    },
    createCode(state,data){
      state.points = data
    }
  },
  getters: {

  },
  actions: {
  },
  modules: {
  }
})
