<template>
  <div class="role-list">
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
            <Button @click="showModel()" type="success" class="f-r">添加角色</Button>
        </Col>
    </Row>
    <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showModalStatus" title="添加角色" @on-ok="createRole('roleValidate')" :loading="loading">
        <Form :model="role" ref="roleValidate" :rules="roleValidate" action="javascript:void(0)">
            <FormItem label="角色名称" prop="name">
                <Input v-model="role.name" placeholder="输入角色名称..."></Input>
            </FormItem>
            <FormItem label="角色状态">
                <i-switch v-model="role.status">
                    <span slot="on">正常</span>
                    <span slot="off">禁用</span>
                </i-switch>
            </FormItem>
        </Form>
    </Modal>
    <!-- 权限的弹出 -->
    <Modal v-model="showPrivStatus" title="修改权限" @on-ok="updatePriv" :loading="loading">
        <Tree :data="privTree" ref="privSelect" show-checkbox multiple></Tree>
    </Modal>
  </div>
</template>

<script>
export default {
    name: 'role-list',
    data () {
        return {
            loading: true,
            dataloading: true,
            role_id:0,
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
                    title: '名称',
                    minWidth:300,
                    key: 'name',
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    value: params.row.name,
                                },
                                on: {
                                    'on-enter': (value) => {
                                        this.editName(params.row.id,value.target.value)
                                    }
                                }
                            }, '排序')
                        ]);
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    width:150,
                    render: (h, params) => {
                      return h('div', [
                          h('i-switch', {
                              props: {
                                value: params.row.status ==1 ? true : false  //控制开关的打开或关闭状态，官网文档属性是value
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
                    width:160,
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
                                        this.showPrivModal(params.row.id)
                                    }
                                }
                            }, '权限'),
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
            role:{
                name:'',
                status:true,
            },
            showModalStatus:false,
            showPrivStatus:false,
            roleValidate: {
                name: [
                    { required: true, message: '角色名称必须填写', trigger: 'blur' }
                ]
            },
            privTree:[]
        }
    },
    created: function () {
        // 取数据
        this.getTableList();
    },
    methods:{
        getTableList:function(){

          this.$api.role.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
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
        showModel(){
            this.showModalStatus = !this.showModalStatus;
        },
        showPrivModal(value){
            this.role_id = value;
            this.showPrivStatus = !this.showPrivStatus;
            // 取树形菜单
            this.$api.role.priv({role_id:value}).then(res=>{
                console.log(res)
                if(res.code == 200)
                {
                    this.privTree = res.data;
                    console.log(this.privTree)
                    this.$Message.success(res.msg);
                }
            });
        },
        // 添加
        createRole(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.role.create({name:this.role.name,status:this.role.status?1:0}).then(res=>{
                        if(res.code == 200)
                        {
                            this.showModalStatus = !this.showModalStatus;
                            this.role.name = '';
                            this.getTableList();
                        }
                    });
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                } else {
                    this.$Message.error('请检查输入的信息是否正确！');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                }
            })
        },
        // 修改名称
        editName:function(index,value){
            this.$api.role.edit({id:index,name:value}).then(res=>{
                if(res.code == 200)
                {
                    this.$Message.success(res.msg);
                }
            });
        },
        // 删除
        remove:function(index,id){
            // 弹出确认框
            this.$Modal.confirm({
                title: '警告',
                content: '<p>此操作不可恢复，三思而后行...</p>',
                onOk: () => {
                    this.$api.role.remove({id:id}).then(res=>{
                        if(res.code == 200)
                        {
                            this.$Message.success(res.msg);
                            this.tablelist.splice(index, 1);
                             if (this.tablelist.length == 0 && this.pages.page>1){
                                this.pages.page--;
                                this.getTableList();
                            }
                        }
                    });
                }
            });
        },
        // 修改状态
        changeStatus:function(index,value){
            this.$api.role.status({id:index,status:value}).then(res=>{
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
            this.$api.role.list(ps).then(res=>{
                this.dataloading = false;
                if(res.code == 200)
                {
                    this.pages.total = res.data.total;
                    this.tablelist = res.data.list;
                    this.$Message.success(res.msg);
                }
            });
          return;
        },
        updatePriv:function(){
            var node = this.$refs['privSelect'].getCheckedAndIndeterminateNodes()
            var menu_id = [];
            node.forEach((item,index) =>{
                menu_id.push(item.menu_id)
            });
            // 提交
            this.$api.role.updatepriv({id:this.role_id,menu_id:menu_id}).then(res=>{
                if(res.code == 200)
                {
                    this.role.name = '';
                    this.$Message.success(res.msg);
                }
                this.loading = false
                this.$nextTick(() => {this.loading = true;});
                this.showPrivStatus = !this.showPrivStatus;
            });
        },
    },
}
</script>
