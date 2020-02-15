<template>
  <div class="dict-list">
    <!-- <Row>
        <Col :xs="24" :sm="12">
            <Form :model="formItem" ref="formItem" :inline="true" action="javascript:void(0)">
                <FormItem>
                    <Input v-model="formItem.name" placeholder="输入关键词查找..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="renderTable('formItem')">查找</Button>
                </FormItem>
            </Form>
        </Col>
        <Col :xs="24" :sm="12">
            <Button @click="showCreate()" type="success" class="f-r">添加字典</Button>
        </Col>
    </Row> -->
    <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading"></Table>
    <!-- <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div> -->
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="新增" @on-ok="createDictType('dictTypeCreateValidate')" :loading="loading">
        <Form :model="dictTypeInfo" ref="dictTypeCreateValidate" :rules="dictTypeCreateValidate" action="javascript:void(0)">
            <FormItem label="代号" prop="name_EN">
                <Input v-model="dictTypeInfo.name_EN" ></Input>
            </FormItem>
            <FormItem label="名称" prop="name_CN">
                <Input v-model="dictTypeInfo.name_CN" ></Input>
            </FormItem>
            <FormItem label="所属系统模块" prop="system_ID">
                <Input v-model="dictTypeInfo.system_ID" ></Input>
            </FormItem>
            <FormItem label="状态" prop="status">
                <Select v-model="dictTypeInfo.status" clearable>
                    <!-- <Option v-for="item in sectionList" :value="item.id" :key="item.id">{{ item.name }}</Option> -->
                    <Option value="1"  key="1">启用</Option>
                    <Option value="0"  key="0">停用</Option>
                </Select>
            </FormItem>

         
        </Form>
    </Modal>
    <!-- 修改资料 -->
    <Modal v-model="showEditInfoStatus" title="修改字典" @on-ok="updateDictType('dictTypeEditValidate')" :loading="loading">
        <Form :model="dictTypeInfo" ref="dictTypeEditValidate" :rules="dictTypeEditValidate" action="javascript:void(0)">
            <FormItem label="代号" prop="name_EN">
                <Input v-model="dictTypeInfo.name_EN" ></Input>
            </FormItem>
            <FormItem label="名称" prop="name_CN">
                <Input v-model="dictTypeInfo.name_CN" ></Input>
            </FormItem>
            <FormItem label="所属系统模块" prop="system_ID">
                <Input v-model="dictTypeInfo.system_ID" ></Input>
            </FormItem>
             <FormItem label="状态" prop="status">
                <Select v-model="dictTypeInfo.status" clearable>
                    <!-- <Option v-for="item in sectionList" :value="item.id" :key="item.id">{{ item.name }}</Option> -->
                    <Option value="1"  key="1">启用</Option>
                    <Option value="0"  key="0">停用</Option>
                </Select>
            </FormItem>
        </Form>
    </Modal>
    
  </div>
</template>

<script>
export default {
    name: 'dict-list',
    // props:["dictTypeId"],
    data () {
        return {
            loading: true,
            dataloading: true,
            list: [
                {
                    title: '序号',
                    key: 'sort',
                    width:120,
                    // fixed: 'left'
                },
                {
                    title: '标签',
                    width:120,
                    key: 'label'
                },
                {
                    title: '值',
                    width:120,
                    key: 'value'
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
            sectionList:[],
            dictTypeInfo:{
                sort:"",
                label:"",
                value:'',
               
            },
            showCreateStatus:false,
            showEditInfoStatus:false,
            showEditPwdStatus:false,
            dictTypeCreateValidate: {
                name_EN: [
                    { required: true, message: '英文名称必须填写', trigger: 'blur' },
                    { type: 'string', min: 1, max:30, message: '英文名称 1 - 30 位长度', trigger: 'blur' }
                ],
                name_CN: [
                    { required: true, message: '中文名称必须填写', trigger: 'blur' },
                    { type: 'string', min: 1, max:10, message: '中文名称 1 - 10 位长度', trigger: 'blur' }
                ],
                system_ID: [
                    { required: true, message: '所属系统必须选择', trigger: 'change'},
                ],
                status: [
                    { required: true, message: '状态必须选择', trigger: 'change' },
                    
                ],
            },
            dictTypeEditValidate: {
                name_EN: [
                    { required: true, message: '英文名称必须填写', trigger: 'blur' },
                    { type: 'string', min: 1, max:30, message: '英文名称 1 - 30 位长度', trigger: 'blur' }
                ],
                name_CN: [
                    { required: true, message: '中文名称必须填写', trigger: 'blur' },
                    { type: 'string', min: 1, max:10, message: '中文名称 1 - 10 位长度', trigger: 'blur' }
                ],
                system_ID: [
                    { required: true, message: '所属系统必须选择', trigger: 'change'},
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
        // this.getTableList();
        // this.getSectionRole();
    },
    methods:{
        //查询字典类型
        getTableList:function(dictTypeId){
          this.$api.dictType.dictList({"dict_type_id":dictTypeId, id:dictTypeId}).then(res=>{
            this.dataloading = false;
            if(res.code == 200){
                this.tablelist = res.data.list;
                this.$Message.success(res.msg);
            }
          });
          return;
        },
        
        // 展开添加
        showCreate(){
            this.showCreateStatus = !this.showCreateStatus;
            // this.admin_id = 0;
            this.dictTypeInfo = {
                name_EN:'',
                name_CN:'',
                system_ID:'',
                status:1,
            };
        },

        // 添加
        createDictType(name){
            this.$refs[name].validate((valid) => 
            {
                if (valid) {
                    this.$api.dictType.create({
                        name_EN:this.dictTypeInfo.name_EN,
                        name_CN:this.dictTypeInfo.name_CN,
                        system_ID:this.dictTypeInfo.system_ID,
                        status:this.dictTypeInfo.status
                        
                        }).then(res=>{
                        if(res.code == 200){
                            // this.adminInfo.name = '';
                            // this.adminInfo.section_id = 0;
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
            this.id = value;
            this.showEditInfoStatus = !this.showEditInfoStatus;
            // 取信息
            this.$api.dictType.detail({id:value}).then(res=>{
                if(res.code == 200)
                {
                    this.dictTypeInfo = res.data;
                    this.$Message.success(res.msg);
                }
                this.loading = false;
                // this.$nextTick(() => {this.loading = true;});
            });
        },
        // 修改
        updateDictType:function(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.dictType.editinfo({
                        id:this.id,
                        name_EN:this.dictTypeInfo.name_EN,
                        name_CN:this.dictTypeInfo.name_CN,
                        system_ID:this.dictTypeInfo.system_ID,
                        status:this.dictTypeInfo.status
                        }).then(res=>{
                        if(res.code == 200){
                            this.$Message.success(res.msg);
                            this.getTableList();
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

        // 删除
        remove:function(index,id){
            // 弹出确认框
            this.$Modal.confirm({
                title: '警告',
                content: '<p>此操作不可恢复，三思而后行...</p>',
                onOk: () => {
                    this.$api.dictType.remove({id:id}).then(res=>{
                        if(res.code == 200)
                        {
                            this.$Message.success(res.msg);
                            this.tablelist.splice(index, 1);
                        }
                    });
                }
            });
        },
        
    },
    
}
</script>
