/**
  * 用户 接口的统一出口
  */
import axios from '.././http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块，把请求字段直接映射过来


// 接口请求地址
const api = '/c-api/';

const admin = {
    // 列表
    list (params) {
        return axios.post(api + 'admin/list',params)
    },
    // 添加
    create (params) {
        return axios.post(api + 'admin/create',params)
    },
    // 修改
    editinfo (params) {
        return axios.post(api + 'admin/editinfo',params)
    },
    // 修改个人资料
    selfeditinfo (params) {
        return axios.post(api + 'admin/selfeditinfo',params)
    },
    // 修改状态
    status (params) {
        return axios.post(api + 'admin/status',params)
    },
    // 删除
    remove (params) {
        return axios.post(api + 'admin/remove',params)
    },
    // 修改密码
    editpassword (params) {
        return axios.post(api + 'admin/editpassword',params)
    },
    // 个人修改密码
    selfeditpwd (params) {
        return axios.post(api + 'admin/selfeditpassword',params)
    },
    // 单条信息
    detail (params) {
        return axios.post(api + 'admin/detail',params)
    },
}


// 导出接口
export default admin