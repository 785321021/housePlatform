<template>
  <div class="town-list">
    <Row>
        <Col :xs="24" :sm="18">
            <Form :model="formItem" ref="formItem" :inline="true" action="javascript:void(0)">
                <FormItem label="名称：" label-position="right " :label-width="50" prop="name" style="width:20%">
                    <Input v-model="formItem.name" clearable placeholder="输入关键词查找..."></Input>
                </FormItem>
                <FormItem label="省：" label-position="right " :label-width="40" prop="province" style="width:20%">
                    <Select v-model="formItem.province" clearable @on-change="changeProvince" >
                        <Option v-for="item in province" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="市：" label-position="right " :label-width="40" prop="city" style="width:20%">
                    <Select v-model="formItem.city" clearable @on-change="changeCity">
                        <Option v-for="item in city" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="区县：" label-position="right " :label-width="50" prop="county" style="width:20%">
                    <Select v-model="formItem.county" clearable @on-change="changeCounty">
                        <Option v-for="item in county" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="renderTable('formItem')">查找</Button>
                </FormItem>
            </Form>
        </Col>
        <Col :xs="24" :sm="6">
            <Button @click="showCreate()" type="success" class="f-r">添加片区</Button>
        </Col>
    </Row>
    <Table :columns="list" ref="townList" :data="tablelist" :loading="dataloading"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="新增片区" @on-ok="createTown('townCreateValidate')" :loading="loading" 
    :styles="{ width:'50%'}">      
        <Form :model="townInfo" ref="townCreateValidate" :rules="townCreateValidate" action="javascript:void(0)" inline>  
            <Row>
                <Col span="12">
                    <FormItem label="片区名称：" label-position="right " :label-width="80" prop="name" style="width:100%">
                        <Input v-model="townInfo.name"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="区县：" label-position="right " :label-width="80" prop="countys" style="width:100%">
                        <Cascader :data="province" trigger="hover" v-model="townInfo.countys"></Cascader>
                    </FormItem>
                </Col>
            </Row>
                     
        </Form>
    </Modal>
    <!-- 修改资料 -->
    <Modal v-model="showEditInfoStatus" title="修改片区" @on-ok="updateTown('townEditValidate')" :loading="loading" 
    :styles="{ width:'50%'}">
        <Form :model="townInfo" ref="townEditValidate" :rules="townEditValidate" action="javascript:void(0)">
            <Row>
                <Col span="12">
                    <FormItem label="片区名称：" label-position="right " :label-width="80" prop="name" style="width:100%">
                        <Input v-model="townInfo.name"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="区县：" label-position="right " :label-width="80" prop="countys" style="width:100%">
                        <Cascader :data="province" trigger="hover" v-model="townInfo.countys"></Cascader>
                    </FormItem>
                </Col>
            </Row>
        </Form>    
    </Modal>
    
  </div>
</template>

<script>

export default {
    name: 'town-list',
    created: function () {
        // // 查询数据字典
        // this.getDictInfo();  
        // 取数据
        this.getTableList();
        // 查询省市区数据
        this.getProvinceList();
        
    },
    data () {
        return { 
            townInfo:{
                name:"", 
            },
            // data: [],
            loading: true,
            dataloading: true,
            id:"",
            formItem:{  
            },
            province:[],
            city:[],
            county:[],
            pages:{
                page:1,
                size:10,
                total:0
            },
            list: [
                {
                    title: '片区名称',
                    key: 'name',
                    width:240,
                    // fixed: 'left'
                },
                {
                    title: '所属省份',
                    key: 'province',
                    width:150,
                    
                }, 
                {
                    title: '所属城市',
                    key: 'city',
                    width:150,
                    
                }, 
                {
                    title: '所属区县',
                    key: 'county',
                    width:150,
                    
                }, 
                {
                    title: '操作',
                    key: 'action',
                    width:150,
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
                                        this.remove(params.index,params.row.id,params.row.name)
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
            townCreateValidate: {  
            },
            townEditValidate: {    
            },
            // couponSelected: 1
        }
        
    },
    
    methods:{
        //查询片区列表
        getTableList:function(){
          this.$api.town.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
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
        createTown(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.town.create(this.townInfo).then(res=>{
                        if(res.code == 200){
                            
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
            this.$api.town.detail({id:value}).then(res=>{
                if(res.code == 200){
                    this.townInfo = res.data;
                    
                    this.$Message.success(res.msg);
                    
                    
                }
                this.loading = false;
                // this.$nextTick(() => {this.loading = true;});
            });
        },
        // 修改
        updateTown:function(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$api.town.editinfo(this.townInfo).then(res=>{
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
            var ps = {'name':this.formItem.name,'province':this.formItem.province,'city':this.formItem.city,
            'county':this.formItem.county,"page":this.pages.page,"size":this.pages.size};
            this.$api.town.list(ps).then(res=>{
                if(res.code == 200){
                    this.pages.total = res.data.total;
                    this.tablelist = res.data.list;
                    this.$Message.success(res.msg);
                }
                this.dataloading = false;
            });
            return;
        },

        // 删除
        remove:function(index,id,name){
            // 弹出确认框
            this.$Modal.confirm({
                title: '警告',
                content: '<p>确认删除片区'+name+'?</p>',
                onOk: () => {
                    this.$api.town.remove({id:id}).then(res=>{
                        if(res.code == 200){
                            this.$Message.success(res.msg);
                            this.tablelist.splice(index, 1);
                        }
                    });
                }
            });
        },
        //省 改变时更新市  区
        changeProvince:function(){
            if(this.formItem.province == undefined){
                this.formItem.city = undefined;
                this.formItem.county = undefined;
            }
            this.$api.town.changeProvince({'province':this.formItem.province}).then(res=>{
                if(res.code == 200){
                    this.city = res.data.cityList; 
                    this.county = res.data.countyList;  
                    
                }
            });
            
            
        },
        //市 改变时更新区 省
        changeCity:function(){
            if(this.formItem.city != undefined){
                if(this.formItem.province == undefined){
                    this.formItem.province = this.formItem.city.substring(0,2)+"0000";
                    this.changeProvince()
                } 
            }else{
                this.formItem.county = undefined;
            }
            this.$api.town.changeCity({'province':this.formItem.province,'city':this.formItem.city}).then(res=>{
                if(res.code == 200){
                    this.county = res.data.countyList;  
                }
            });
        },
        //区 改变时更新 省 市
        changeCounty:function(){ 
            if(this.formItem.county != undefined){
                if(this.formItem.province == undefined){
                    this.formItem.province = this.formItem.county.substring(0,2)+"0000"; 
                    this.changeProvince()
                }
                if(this.formItem.city == undefined){
                    this.formItem.city = this.formItem.county.substring(0,4)+"00";  
                    this.changeCity()
                }
                
            }      
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

        //查询省市区数据
        getProvinceList:function(){
            this.$api.town.provinceList().then(res=>{
                if(res.code == 200){
                    this.province = res.data.province;   
                    this.city = res.data.city; 
                    this.county = res.data.county;  
                }
            });
        },
        
    },

    
    
}
</script>
