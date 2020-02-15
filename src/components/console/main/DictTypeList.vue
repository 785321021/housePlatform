<template>
  <div class="dictType-list">
    <Row>
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
    </Row>
    <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="新增字典" @on-ok="createDictType('dictTypeCreateValidate')" :loading="loading">
        <Form :model="dictTypeInfo" ref="dictTypeCreateValidate" :rules="dictTypeCreateValidate" action="javascript:void(0)">
            <FormItem label="代号" prop="name_EN">
                <Input v-model="dictTypeInfo.name_EN" ></Input>
            </FormItem>
            <FormItem label="名称" prop="name_CN">
                <Input v-model="dictTypeInfo.name_CN" ></Input>
            </FormItem>
            <FormItem label="所属系统模块" prop="system_ID">
                <Input v-model="dictTypeInfo.system_ID" />
            </FormItem>
            <FormItem label="状态" prop="status">
                <Select v-model="dictTypeInfo.status" >
                    <Option v-for="item in DictStatue" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Select v-model="dictTypeInfo.status" >
                    <Option v-for="item in DictStatue" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
        <dictList  ref="myDictList">  </dictList>
    </Modal>
    
  </div>
</template>

<script>
import DictList from './DictList.vue'
export default {
    name: 'dictType-list',
    data () {
        return {
            DictStatue:[],
            dictTypeInfo:{
                name_EN:"",
                name_CN:"",
                system_ID:"",
                status:'1',
            },
           
            loading: true,
            dataloading: true,
            id:"",
            formItem:{
                'name':'',
                'status':1,
            },
             pages:{
                page:1,
                size:10,
                total:0
            },
            list: [
                {
                    title: '代号',
                    key: 'name_EN',
                    width:120,
                    // fixed: 'left'
                },
                {
                    title: '名称',
                    width:120,
                    key: 'name_CN'
                },
                {
                    title: '所属系统模块',
                    width:120,
                    key: 'system_ID'
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
            DictTypeIdList:["11111111111"],
            DictTypefoList:[],
            
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
            // couponSelected: 1
        }
        
    },
    created: function () {
        // 取数据
        this.getTableList();
        // 查询数据字典
        this.getDictInfo();

        // this.couponSelected = 1;
        // this.dictTypeInfo.status=1
        
    },
    methods:{
        //查询字典类型
        getTableList:function(){
          this.$api.dictType.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
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
        
        // 展开添加
        showCreate(){
            this.showCreateStatus = !this.showCreateStatus;
            // this.admin_id = 0;dictTypeInfo.status
            this.dictTypeInfo = {
                name_EN:"",
                name_CN:"",
                system_ID:"",
                status:'1',
            };
        },

        // 添加
        createDictType(name){
            this.$refs[name].validate((valid) => {
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
                if(res.code == 200){
                    this.dictTypeInfo = res.data;
                    debugger
                    this.$Message.success(res.msg);
                    this.$refs.myDictList.getTableList(res.data.id);
                    
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

          // 翻页
        changePage() {
            this.pages.page = this.$refs['listPage'].currentPage;
            this.renderTable(1);
        },
        // 条件查询
        renderTable:function(name) {
            this.dataloading = true;
            if (name !=1){
                this.pages.page = 1;
            }
            var ps = {'name':this.formItem.name,"page":this.pages.page,"size":this.pages.size};
            this.$api.dictType.list(ps).then(res=>{
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

        //查询本模块所需要的全部数据字典
        getDictInfo:function(){
            // alert(this.DictTypeIdList)
            this.$api.dictType.dictList({"dict_type_id_list":this.DictTypeIdList}).then(res=>{
                if(res.code == 200){
                    this.DictStatue = res.data.statue;
                    // alert(this.DictStatue)
                }
            });
        }
        
    },

    components:{
        "dictList":DictList
    }
    
}
</script>
