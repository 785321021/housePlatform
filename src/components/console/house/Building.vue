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
            <Button @click="showCreate()" type="success" class="f-r">添加楼盘信息</Button>
        </Col>
    </Row>
    <Table :columns="list" ref="buildingList" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="新增楼盘" @on-ok="createDictType('buildingCreateValidate')" :loading="loading" 
    :styles="{ width:'50%'}">      
        <Form :model="buildingInfo" ref="buildingCreateValidate" :rules="buildingCreateValidate" action="javascript:void(0)" inline>  
            <Row>
                <Col span="12">
                    <FormItem label="楼盘名称：" label-position="right " :label-width="80" prop="name" style="width:100%">
                        <Input v-model="buildingInfo.name"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="开发商：" label-position="right " :label-width="80" prop="developer" style="width:100%">
                        <Input v-model="buildingInfo.developer"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <!-- <Col span="8">
                    <FormItem label="市：" label-position="right " :label-width="80" prop="city" style="width:100%">
                        <Select v-model="city" >
                            <Option v-for="item in city" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="区县：" label-position="right " :label-width="80" prop="county" style="width:100%">
                        <Select v-model="county" >
                            <Option v-for="item in county" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col> -->
                <Col span="12">
                    <FormItem label="片区：" label-position="right " :label-width="80" prop="town" style="width:100%">
                        <Cascader :data="data" v-model="town"></Cascader>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="地图：" label-position="right " :label-width="80" prop="coordinate" style="width:100%">
                        <Select v-model="buildingInfo.coordinate" >
                            <Option v-for="item in BuildingProperty" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="地址：" label-position="right " :label-width="80" prop="address" style="width:100%">
                        <Input v-model="buildingInfo.address" type="textarea" :rows="1"  placeholder="请输入具体地址..." />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="用途：" label-position="right " :label-width="80" prop="purpose" style="width:100%">
                        <Select v-model="buildingInfo.purpose" >
                            <Option v-for="item in BuildingPurpose" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="类型：" label-position="right " :label-width="80" prop="type" style="width:100%">
                        <Select v-model="buildingInfo.type" >
                            <Option v-for="item in BuildingType" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="结构：" label-position="right " :label-width="80" prop="structure" style="width:100%">
                        <Select v-model="buildingInfo.structure" >
                            <Option v-for="item in BuildingStructure" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="产权：" label-position="right " :label-width="80" prop="property" style="width:100%">
                        <Select v-model="buildingInfo.property" >
                            <Option v-for="item in BuildingProperty" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="物业费：" label-position="right " :label-width="80" prop="area" style="width:100%">
                        <Input v-model="buildingInfo.propertyFree">
                            <Select v-model="buildingInfo.propertyFreeUnit" slot="append" style="width: 80px">
                                <Option value="1">元/月/㎡</Option>
                                <Option value="2">元/月</Option>
                                <Option value="3">元/年/㎡</Option>
                                <Option value="4">元/年</Option>
                            </Select>
                        </Input>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="销售分类：" label-position="right " :label-width="80" prop="saleType" style="width:100%">
                        <Select v-model="buildingInfo.saleType" >
                            <Option v-for="item in BuildingSaleType" :value="item.value" :key="item.value" >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            
           
        </Form>
    </Modal>
    <!-- 修改资料 -->
    <!-- <Modal v-model="showEditInfoStatus" title="修改字典" @on-ok="updateDictType('dictTypeEditValidate')" :loading="loading">
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
        
    </Modal> -->
    
  </div>
</template>

<script>

export default {
    name: 'building-list',
    created: function () {
        // 查询数据字典
        this.getDictInfo();  
        // 取数据
        this.getTableList();
        
    },
    data () {
        return {
            
            buildingInfo:{
                name:"",
                developer:"",
                city:"",
                county:"",
                town:"",
                address:"",
                purpose:"",
                type:"",
                structure:"",
                property:"",
                coordinate:"",
                saleType:"",
                propertyFree:"",
                propertyFreeUnit:"",
                
            },
            city:{},
            county:{},
            town:{},
            data: [{
                    value: '1',
                    label: '哈尔滨',
                    children: [
                        {
                            value: '1',
                            label: '道里区'
                        },
                        {
                            value: '2',
                            label: '南岗区'
                        },
                        {
                            value: '3',
                            label: '道外区'
                        }
                    ]
                }, {
                    value: '2',
                    label: '齐齐哈尔',
                    children: [
                        {
                            value: '19',
                            label: '甘南县',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        
                    ],
                }],
           
            loading: true,
            dataloading: true,
            id:"",
            formItem:{
                
            },
            DictTypeIdList:["d170f55f-bda6-416f-954f-4f6491cffa5f","75016fe5-4e3b-4598-8d80-9962da4ef7b5",
            "c1601579-6f70-4d1b-b8fb-4dd422816a3d","775eaaf4-f17e-49cf-b249-ad6f37e94716","ec2922da-7c5f-4e70-a44c-50c51666fd72"],
            BuildingPurpose:[],//楼盘用途
            BuildingType:[],//楼盘类型
            BuildingStructure:[],//楼盘结构
            BuildingProperty:[],//楼盘产权
            BuildingSaleType:[],//销售分类
            pages:{
                page:1,
                size:10,
                total:0
            },
            list: [
                {
                    title: '名称',
                    key: 'name',
                    width:120,
                    // fixed: 'left'
                },
                {
                    title: '开发商',
                    key: 'developers',
                    width:120,
                    
                },
                {
                    title: '市',
                    width:120,
                    key: 'city'
                },
                {
                    title: '区县',
                    width:120,
                    key: 'county'
                },
                {
                    title: '片区',
                    width:120,
                    key: 'town'
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
            showCreateStatus:false,
            showEditInfoStatus:false,
            showEditPwdStatus:false,
            buildingCreateValidate: {  
            },
            buildingEditValidate: {    
            },
            // couponSelected: 1
        }
        
    },
    
    methods:{
        //查询楼盘列表
        getTableList:function(){
          this.$api.building.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
            this.dataloading = false;
            if(res.code == 200){
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
            this.buildingInfo = {
                
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
            this.$api.dictType.dictList({"dict_type_id_list":this.DictTypeIdList}).then(res=>{
                if(res.code == 200){
                    this.BuildingPurpose = res.data.purpose;    //楼盘用途
                    this.BuildingType = res.data.buildType;     //楼盘类型
                    this.BuildingStructure = res.data.buildStructure;//楼盘结构
                    this.BuildingProperty = res.data.buildProperty;  //楼盘产权
                    this.BuildingSaleType = res.data.saleType; //销售分类
          
                }
            });
        },
        
    },

    
    
}
</script>
