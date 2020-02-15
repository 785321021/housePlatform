/**
  * 用户 接口的统一出口
  */
import axios from '../http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块，把请求字段直接映射过来


// 接口请求地址
const api = '/b-api/';

const building = {
    // 列表
    list (params) {
        return axios.post(api + 'building/list',params)
    },
    // 添加
    create (params) {
        return axios.post(api + 'building/create',params)
    },
    // 修改
    editinfo (params) {
        return axios.post(api + 'building/editinfo',params)
    },
    // 单条信息
    detail (params) {
        return axios.post(api + 'building/detail',params)
    },
    // 删除
    remove (params) {
        return axios.post(api + 'building/remove',params)
    },
    
    
}


// 导出接口
export default building