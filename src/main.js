import Vue from 'vue'
import formatDate from '.././public/js/date.js'
import router from './router/index'
import VueAxios from 'vue-axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// 各API接口
import api from './api/api' // 导入api接口
// 首页模板
import App from './components/console/App.vue'
// 状态管理
import store from './vuex/store'
// 引入echars
import echarts from 'echarts'
//引入拖拽插件
import VueDND from 'awe-dnd'
import vuedraggable from 'vuedraggable';
// 添加echarts插件
Vue.prototype.$echarts = echarts
Vue.use(iView);
Vue.use(VueDND);
Vue.use(vuedraggable);
Vue.config.productionTip = false
Vue.prototype.$api = api; // 将api挂载到vue的原型上

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')