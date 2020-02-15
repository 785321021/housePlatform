/**
  * 片区 接口的统一出口
  */
import axios from '../http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块，把请求字段直接映射过来


// 接口请求地址
const api = '/b-api/';

const town = {
    // 列表
    list (params) {
        return axios.post(api + 'town/list',params)
    },
    // 添加
    create (params) {
        return axios.post(api + 'town/create',params)
    },
    // 修改
    editinfo (params) {
        return axios.post(api + 'town/editinfo',params)
    },
    // 单条信息
    detail (params) {
        return axios.post(api + 'town/detail',params)
    },
    // 删除
    remove (params) {
        return axios.post(api + 'town/remove',params)
    },
    // 省市区
    provinceList(params) {
        return axios.post(api + 'town/provinceList',params)
    },
    //改变省
    changeProvince(params) {
        return axios.post(api + 'town/changeProvince',params)
    },
    //改变市
    changeCity(params) {
        return axios.post(api + 'town/changeCity',params)
    },
    //改变区
    changeCounty(params) {
        return axios.post(api + 'town/changeCounty',params)
    },
    
    
}


// 导出接口
export default town