<template>
  <div class="admin-list">
    <Row>
        <Col :xs="24" :sm="12">
            <Form :model="formItem" ref="formItem" :inline="true" action="javascript:void(0)">
                <FormItem>
                    <Input v-model="formItem.key" placeholder="输入关键词查找..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="renderTable('formItem')">查找</Button>
                </FormItem>
            </Form>
        </Col>
        <Col :xs="24" :sm="12">
            <Button @click="showCreate()" type="success" class="f-r">添加管理员</Button>
        </Col>
    </Row>
    <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="添加管理员" @on-ok="createAdmin('adminCreateValidate')" :loading="loading">
        <Form :model="adminInfo" ref="adminCreateValidate" :rules="adminCreateValidate" action="javascript:void(0)">
            <FormItem label="部门" prop="section_id">
                <Select v-model="adminInfo.section_id">
                    <Option v-for="item in sectionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="角色">
                <CheckboxGroup v-model="adminInfo.roleIds" @on-change="roleCheck">
                    <Checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="用户名" prop="name">
                <Input v-model="adminInfo.name" placeholder="输入用户名..."></Input>
            </FormItem>
            <FormItem label="姓名" prop="realname">
                <Input v-model="adminInfo.realname" placeholder="输入姓名..."></Input>
            </FormItem>
            <FormItem label="手机号">
                <Input v-model="adminInfo.phone" placeholder="输入手机号..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="adminInfo.email" placeholder="输入邮箱..."></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input v-model="adminInfo.password" type="password" placeholder="输入密码..."></Input>
            </FormItem>
            <FormItem label="确认密码">
                <Input v-model="adminInfo.password_confirmation" type="password" placeholder="确认密码..."></Input>
            </FormItem>
        </Form>
    </Modal>
    <!-- 修改资料 -->
    <Modal v-model="showEditInfoStatus" title="修改资料" @on-ok="updateAdmin('adminEditValidate')" :loading="loading">
        <Form :model="adminInfo" ref="adminEditValidate" :rules="adminEditValidate" action="javascript:void(0)">
            <FormItem label="部门" prop="section_id">
                <Select v-model="adminInfo.section_id" clearable>
                    <Option v-for="item in sectionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="角色">
                <CheckboxGroup v-model="adminInfo.roleIds" @on-change="roleCheck">
                    <Checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="用户名" prop="name">
                <Input v-model="adminInfo.name" disabled placeholder="输入用户名..."></Input>
            </FormItem>
            <FormItem label="姓名" prop="realname">
                <Input v-model="adminInfo.realname" placeholder="输入姓名..."></Input>
            </FormItem>
            <FormItem label="手机号">
                <Input v-model="adminInfo.phone" placeholder="输入手机号..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="adminInfo.email" placeholder="输入邮箱..."></Input>
            </FormItem>
        </Form>
    </Modal>
    <!-- 修改密码 -->
    <Modal v-model="showEditPwdStatus" title="修改密码" @on-ok="updatePassword('adminPasswordValidate')" :loading="loading">
        <Form :model="adminPwd" ref="adminPasswordValidate" :rules="adminPasswordValidate" action="javascript:void(0)">
            <FormItem label="密码" prop="password">
                <Input v-model="adminPwd.password" type="password" placeholder="输入密码..."></Input>
            </FormItem>
            <FormItem label="确认密码">
                <Input v-model="adminPwd.password_confirmation" type="password" placeholder="确认密码..."></Input>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
    name: 'admin-list',
    data () {
        return {
            loading: true,
            dataloading: true,
            admin_id:0,
            formItem:{
                'key':'',
            },
             pages:{
                page:1,
                size:2,
                total:0
            },
            list: [
                {
                    title: 'Id',
                    key: 'id',
                    width:80,
                    fixed: 'left'
                },
                {
                    title: '用户名',
                    minWidth:120,
                    key: 'name'
                },
                {
                    title: '姓名',
                    width:100,
                    key: 'realname'
                },
                {
                    title: '电话',
                    width:120,
                    key: 'phone'
                },
                {
                    title: '邮箱',
                    width:120,
                    key: 'email'
                },
                {
                    title: '最后登录时间',
                    width:160,
                    key: 'lasttime',
                    // render: (h,params) => {
                    //     return this.filters.formatDate(params.row.lasttime);
                    // }
                },
                {
                    title: '最后登录IP',
                    width:120,
                    key: 'lastip'
                },
                {
                    title: '状态',
                    key: 'status',
                    width:100,
                    render: (h, params) => {
                      return h('div', [
                          h('i-switch', {
                              props: {
                                value: params.row.status ==1?true:false //控制开关的打开或关闭状态，官网文档属性是value
                              },
                              on: {
                                'on-change': (value) => {
                                    this.changeStatus(params.row.id,value?1:0)
                                }
                              }
                          }, '开关')
                      ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:180,
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                style:{
                                    marginRight:'8px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        this.showEditInfo(params.row.id)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                style:{
                                    marginRight:'8px'
                                },
                                props: {
                                    type: 'warning',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        this.showEditPwd(params.row.id)
                                    }
                                }
                            }, '改密'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index,params.row.id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            tablelist: [],
            roleList:[],
            sectionList:[],
            adminInfo:{
                section_id:2,
                roleIds:[],
                name:'',
                realname:'',
                phone:'',
                email:'',
                password:'',
                password_confirmation:'',
            },
            adminPwd:{
                password:'',
                password_confirmation:'',
            },
            showCreateStatus:false,
            showEditInfoStatus:false,
            showEditPwdStatus:false,
            adminCreateValidate: {
                name: [
                    { required: true, message: '用户名必须填写', trigger: 'blur' },
                    { type: 'string', min: 2, max:15, message: '用户名 3 - 15 位长度', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '姓名必须填写', trigger: 'blur' },
                    { type: 'string', min: 2, max:15, message: '姓名 3 - 15 位长度', trigger: 'blur' }
                ],
                section_id: [
                    { required: true, message: '部门必须选择', trigger: 'change', type:'number'},
                ],
                password: [
                    { required: true, message: '密码必须填写', trigger: 'blur' },
                    { type: 'string', min: 6, max:15, message: '密码 6 - 15 位长度', trigger: 'blur' }
                ],
            },
            adminEditValidate: {
                realname: [
                    { required: true, message: '姓名必须填写', trigger: 'blur' },
                    { type: 'string', min: 2, max:15, message: '姓名 3 - 15 位长度', trigger: 'blur' }
                ],
                section_id: [
                    { required: true, message: '部门必须选择', trigger: 'blur',type:'number' },
                ],
            },
            adminPasswordValidate: {
                password: [
                    { required: true, message: '密码必须填写', trigger: 'blur' },
                    { type: 'string', min: 6, max:15, message: '密码 6 - 15 位长度', trigger: 'blur' }
                ]
            },
            roleIds:[],
        }
    },
    created: function () {
        // 取数据
        this.getTableList();
        this.getSectionRole();
    },
    methods:{
        getTableList:function(){
          this.$api.admin.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
            this.dataloading = false;
            if(res.code == 200)
            {
                this.tablelist = res.data.list;
                this.pages.total = res.data.total;
                this.$Message.success(res.msg);
            }
          });
          return;
        },
        // 获取部门及角色列表
        getSectionRole(){
            this.$api.role.list({"size":999}).then(res=>{
                if(res.code == 200)
                {
                    this.roleList = res.data;
                }
            });
            this.$api.section.list({"size":999}).then(res=>{
                if(res.code == 200)
                {
                    this.sectionList = res.data;
                }
            });
        },
        // 展开添加
        showCreate(){
            this.showCreateStatus = !this.showCreateStatus;
            this.admin_id = 0;
            this.adminInfo = {
                section_id:0,
                roleIds:[],
                name:'',
                realname:'',
                phone:'',
                email:'',
                password:'',
                password_confirmation:'',
            };
        },
        // 选中角色时
        roleCheck(data){
            this.roleIds = data;
        },
        // 添加
        createAdmin(name){
            this.$refs[name].validate((valid) => 
            {
                if (valid) {
                    this.$api.admin.create({section_id:this.adminInfo.section_id,roleIds:this.roleIds,name:this.adminInfo.name,realname:this.adminInfo.realname,phone:this.adminInfo.phone,email:this.adminInfo.email,password:this.adminInfo.password,password_confirmation:this.adminInfo.password_confirmation}).then(res=>{
                        if(res.code == 200)
                        {
                            this.adminInfo.name = '';
                            this.adminInfo.section_id = 0;
                            this.getTableList();
                        }
                        this.loading = false;
                        this.$nextTick(() => {this.loading = true;});
                        this.showCreateStatus = !this.showCreateStatus;
                    });
                } else {
                    this.$Message.error('请检查输入的信息是否正确！');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                }
            })
        },
        // 展开修改
        showEditInfo(value){
            this.admin_id = value;
            this.showEditInfoStatus = !this.showEditInfoStatus;
            // 取信息
            this.$api.admin.detail({id:value}).then(res=>{
                if(res.code == 200)
                {
                    this.adminInfo = res.data;
                    this.$Message.success(res.msg);
                }
                this.loading = false;
                // this.$nextTick(() => {this.loading = true;});
            });
        },
        // 展开修改密码
        showEditPwd(value){
            this.admin_id = value;
            this.showEditPwdStatus = !this.showEditPwdStatus;
        },
        // 修改名称
        updateAdmin:function(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.admin.editinfo({id:this.admin_id,section_id:this.adminInfo.section_id,roleIds:this.roleIds,realname:this.adminInfo.realname,phone:this.adminInfo.phone,email:this.adminInfo.email}).then(res=>{
                        if(res.code == 200)
                        {
                            this.$Message.success(res.msg);
                        }
                        this.loading = false;
                        this.$nextTick(() => {this.loading = true;});
                    });
                    this.showEditInfoStatus = !this.showEditInfoStatus;
                } else {
                    this.$Message.error('请检查输入的信息是否正确！');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                }
            })
        },
        // 修改密码
        updatePassword:function(name){
            this.$refs[name].validate((valid) => {

                if (valid) {
                    if (this.adminPwd.password != this.adminPwd.password_confirmation){
                        this.$Message.error('两次密码不一致！');
                        this.loading = false
                        this.$nextTick(() => {this.loading = true;});
                        return;
                    }
                    this.$api.admin.editpassword({id:this.admin_id,password:this.adminPwd.password,password_confirmation:this.adminPwd.password_confirmation}).then(res=>{
                        if(res.code == 200)
                        {
                            this.$Message.success(res.msg);
                        }
                        this.loading = false;
                        this.$nextTick(() => {this.loading = true;});
                        this.showEditPwdStatus = !this.showEditPwdStatus;
                    });
                } else {
                    this.$Message.error('请检查输入的信息是否正确！');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                }
            })
        },
        // 删除
        remove:function(index,id){
            // 弹出确认框
            this.$Modal.confirm({
                title: '警告',
                content: '<p>此操作不可恢复，三思而后行...</p>',
                onOk: () => {
                    this.$api.admin.remove({id:id}).then(res=>{
                        if(res.code == 200)
                        {
                            this.$Message.success(res.msg);
                            this.tablelist.splice(index, 1);
                        }
                    });
                }
            });
        },
        // 修改状态
        changeStatus:function(index,value){
            this.$api.admin.status({id:index,status:value}).then(res=>{
                if(res.code == 200)
                {
                    this.$Message.success(res.msg);
                }
            });
        },
          // 翻页
        changePage() {
            this.pages.page = this.$refs['listPage'].currentPage;
            this.renderTable(1);
        },
        // 筛选
        renderTable:function(name) {
            this.dataloading = true;
                        if (name !=1){
                this.pages.page = 1;
            }
            var ps = {'name':this.formItem.key,"page":this.pages.page,"size":this.pages.size};
            this.$api.admin.list(ps).then(res=>{
                if(res.code == 200)
                {
                    this.pages.total = res.data.total;
                    this.tablelist = res.data.list;
                    this.$Message.success(res.msg);
                }
                this.dataloading = false;
            });
            return;
        },
        // formatDate (time){
        //     let date = new Date(time);
        //     return formatDate(data,'yyyy-MM-dd');
        // }
    },
}
</script>
