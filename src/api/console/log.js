/**
  * 权限菜单 接口的统一出口
  */
import axios from '.././http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块，把请求字段直接映射过来


// 接口请求地址
const api = '/c-api/';

const log = {
    // 列表
    list (params) {
        return axios.post(api + 'log/list',params)
    },
    // 清除
    clear () {
        return axios.post(api + 'log/clear')
    },
}


// 导出接口
export default log