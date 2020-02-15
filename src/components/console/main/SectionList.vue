<template>
  <div class="section-list">
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
            <Button @click="showModel()" type="success" class="f-r">添加部门</Button>
        </Col>
    </Row>
    <Table :columns="list" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showModalStatus" title="添加部门" @on-ok="createSection('sectionValidate')" :loading="loading">
        <Form :model="section" ref="sectionValidate" :rules="sectionValidate" action="javascript:void(0)">
            <FormItem label="部门名称" prop="name">
                <Input v-model="section.name" placeholder="输入部门名称..."></Input>
            </FormItem>
            <FormItem label="部门状态">
                <i-switch v-model="section.status">
                    <span slot="on">正常</span>
                    <span slot="off">禁用</span>
                </i-switch>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
    name: 'section-list',
    data () {
        return {
            loading: true,
            dataloading: true,
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
                    width:80,
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
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
            section:{
                name:'',
                status:true,
            },
            showModalStatus:false,
            sectionValidate: {
                name: [
                    { required: true, message: '部门名称必须填写', trigger: 'blur' }
                ]
            },
        }
    },
    created: function () {
        // 取数据
        this.getTableList();
    },
    methods:{
        getTableList:function(){
          this.$api.section.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
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
        // 添加
        createSection(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.section.create({name:this.section.name,status:this.section.status?1:0}).then(res=>{
                        if(res.code == 200)
                        {
                            this.section.name = '';
                            this.getTableList();
                        }
                        this.loading = false;
                        this.$nextTick(()=>{this.loading = true;});
                        this.showModalStatus = !this.showModalStatus;
                    });
                } else {
                    this.$Message.error('请检查输入的信息是否正确！');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                }
            })
        },
        // 修改名称
        editName:function(index,value){
            this.$api.section.edit({id:index,name:value}).then(res=>{
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
                    this.$api.section.remove({id:id}).then(res=>{
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
            this.$api.section.status({id:index,status:value}).then(res=>{
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
             if (name !=1){
                this.pages.page = 1;
             }
            this.dataloading = true;
            var ps = {'name':this.formItem.key,"page":this.pages.page,"size":this.pages.size};
            this.$api.section.list(ps).then(res=>{
                this.dataloading = false;
                if(res.code == 200)
                {
                    this.pages.total = res.data.total;
                    this.tablelist = res.data.list;
                    this.$Message.success(res.msg);
                }
            });
            return;
        }
    },
}
</script>
