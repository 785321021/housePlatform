/**
  * 用户 接口的统一出口
  */
import axios from '.././http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块，把请求字段直接映射过来


// 接口请求地址
const api = '/c-api/';

const dictType = {
  // 列表
  list (params) {
      return axios.post(api + 'dictType/list',params)
  },
  // 添加
  create (params) {
    return axios.post(api + 'dictType/create',params)
  },
  // 修改
  editinfo (params) {
      return axios.post(api + 'dictType/editinfo',params)
  },
  // 单条信息
  detail (params) {
    return axios.post(api + 'dictType/detail',params)
  },
  // 删除
  remove (params) {
    return axios.post(api + 'dictType/remove',params)
  },

  // 列表
  dictList (params) {
    return axios.post(api + 'dictType/dictList',params)
  },
  // 添加
  dictCreate (params) {
    return axios.post(api + 'dictType/dictCreate',params)
  },
  // 修改
  dictEditinfo (params) {
      return axios.post(api + 'dictType/dictEditinfo',params)
  },
  // 单条信息
  dictDetail (params) {
    return axios.post(api + 'dictType/dictDetail',params)
  },
  // 删除
  dictRemove (params) {
    return axios.post(api + 'dictType/dictRemove',params)
  },
    
    
}


// 导出接口
export default dictType