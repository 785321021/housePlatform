// <template>
//   <div class="admin-list">
//     <Row>
//         <Col :xs="24" :sm="12">
//             <Form :model="formItem" ref="formItem" :inline="true" action="javascript:void(0)">
//                 <FormItem>
//                     <Input v-model="formItem.key" placeholder="输入关键词查找..."></Input>
//                 </FormItem>
//                 <FormItem>
//                     <Button type="primary" @click="renderTable('formItem')">查找</Button>
//                 </FormItem>
//             </Form>
//         </Col>
//         <Col :xs="24" :sm="12">
//             <Button @click="showCreate()" type="success" class="f-r">添加房屋</Button>
//         </Col>
//     </Row>
//     <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading"></Table>
//     <div style="margin: 10px;overflow: hidden">
//         <div style="float: right;">
//             <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
//         </div>
//     </div>
//     <!-- 添加的弹出 -->
//     <Modal v-model="showCreateStatus" title="添加房屋信息" @on-ok="createAdmin('adminCreateValidate')" :loading="loading">
//         <Form :model="adminInfo" ref="adminCreateValidate" :rules="adminCreateValidate" action="javascript:void(0)">
//             <FormItem label="室" prop="room">
//                 <Input v-model="adminInfo.room" ></Input>
//             </FormItem>
//             <FormItem label="厅" prop="parlour">
//                 <Input v-model="adminInfo.parlour" ></Input>
//             </FormItem>
//             <FormItem label="卫" prop="toilet">
//                 <Input v-model="adminInfo.toilet" ></Input>
//             </FormItem>
//             <FormItem label="厨" prop="kitchen">
//                 <Input v-model="adminInfo.kitchen" ></Input>
//             </FormItem>
//             <FormItem label="阳台" prop="balcony">
//                 <Input v-model="adminInfo.balcony" ></Input>
//             </FormItem>

//             <FormItem label="房龄" prop="age">
//                 <Input v-model="adminInfo.age" ></Input>
//             </FormItem>
//             <FormItem label="朝向" prop="orientation">
//                 <Input v-model="adminInfo.orientation" ></Input>
//             </FormItem>
//             <FormItem label="面积" prop="area">
//                 <Input v-model="adminInfo.area" ></Input>
//             </FormItem>
//             <FormItem label="使用面积" prop="use_area">
//                 <Input v-model="adminInfo.use_area" ></Input>
//             </FormItem>
//             <FormItem label="底价" prop="base_price">
//                 <Input v-model="adminInfo.base_price" ></Input>
//             </FormItem>

//             <FormItem label="报价" prop="quoted_price">
//                 <Input v-model="adminInfo.quoted_price" ></Input>
//             </FormItem>

           


            
//         </Form>
//     </Modal>
//     <!-- 修改资料 -->
//     <Modal v-model="showEditInfoStatus" title="修改资料" @on-ok="updateAdmin('adminEditValidate')" :loading="loading">
//         <Form :model="adminInfo" ref="adminEditValidate" :rules="adminEditValidate" action="javascript:void(0)">
            
//         </Form>
//     </Modal>
//     <!-- 修改密码 -->
//     <Modal v-model="showEditPwdStatus" title="修改密码" @on-ok="updatePassword('adminPasswordValidate')" :loading="loading">
//         <Form :model="adminPwd" ref="adminPasswordValidate" :rules="adminPasswordValidate" action="javascript:void(0)">
//             <FormItem label="密码" prop="password">
//                 <Input v-model="adminPwd.password" type="password" placeholder="输入密码..."></Input>
//             </FormItem>
//             <FormItem label="确认密码">
//                 <Input v-model="adminPwd.password_confirmation" type="password" placeholder="确认密码..."></Input>
//             </FormItem>
//         </Form>
//     </Modal>
//   </div>
// </template>

// <script>
// export default {
//     name: 'admin-list',
//     data () {
//         return {
//             loading: true,
//             dataloading: true,
//             admin_id:0,
//             formItem:{
//                 'key':'',
//             },
//              pages:{
//                 page:1,
//                 size:10,
//                 total:0
//             },
//             list: [
//                 {
//                     title: '房源编号',
//                     key: 'number',
//                     width:80,
//                     fixed: 'left'
//                 },
//                 {
//                     title: '楼盘名称',
//                     minWidth:120,
//                     key: 'building_name'
//                 },
//                 {
//                     title: '朝向',
//                     width:120,
//                     key: 'orientation'
//                 },
//                 {
//                     title: '室',
//                     width:60,
//                     key: 'room'
//                 },
//                 {
//                     title: '厅',
//                     width:60,
//                     key: 'parlour'
//                 },
//                 {
//                     title: '卫',
//                     width:60,
//                     key: 'toilet'
//                 },
//                 {
//                     title: '类型',
//                     width:60,
//                     key: 'type'
//                 },
//                 {
//                     title: '装修',
//                     width:60,
//                     key: 'decorate'
//                 },
//                 {
//                     title: '面积',
//                     width:60,
//                     key: 'area'
//                 },
//                 {
//                     title: '报价',
//                     width:60,
//                     key: 'quoted_price'
//                 },
//                 {
//                     title: '单价',
//                     width:60,
//                     key: 'unit_price'
//                 },
//                 {
//                     title: '经纪人',
//                     width:50,
//                     key: 'agent'
//                 },
//                 {
//                     title: '状态',
//                     width:50,
//                     key: 'agent'
//                 },
//                 {
//                     title: '最后跟进时间',
//                     width:160,
//                     key: 'lasttime',
//                     // render: (h,params) => {
//                     //     return this.filters.formatDate(params.row.lasttime);
//                     // }
//                 },
//                 {
//                     title: '操作',
//                     key: 'action',
//                     width:180,
//                     align: 'left',
//                     render: (h, params) => {
//                         return h('div', [
//                             h('Button', {
//                                 style:{
//                                     marginRight:'8px'
//                                 },
//                                 props: {
//                                     type: 'primary',
//                                     size: 'small',
//                                 },
//                                 on: {
//                                     click: () => {
//                                         this.showEditInfo(params.row.id)
//                                     }
//                                 }
//                             }, '修改'),
//                             h('Button', {
//                                 style:{
//                                     marginRight:'8px'
//                                 },
//                                 props: {
//                                     type: 'warning',
//                                     size: 'small',
//                                 },
//                                 on: {
//                                     click: () => {
//                                         this.showEditPwd(params.row.id)
//                                     }
//                                 }
//                             }, '改密'),
//                             h('Button', {
//                                 props: {
//                                     type: 'error',
//                                     size: 'small'
//                                 },
//                                 on: {
//                                     click: () => {
//                                         this.remove(params.index,params.row.id)
//                                     }
//                                 }
//                             }, '删除')
//                         ]);
//                     }
//                 }
//             ],
//             tablelist: [],
//             roleList:[],
//             sectionList:[],
//             adminInfo:{
//                 section_id:0,
//                 roleIds:[],
//                 number:'',
//                 building_name:'',
//                 phone:'',
//                 email:'',
//                 password:'',
//                 password_confirmation:'',
//             },
//             adminPwd:{
//                 password:'',
//                 password_confirmation:'',
//             },
//             showCreateStatus:false,
//             showEditInfoStatus:false,
//             showEditPwdStatus:false,
//             adminCreateValidate: {
//                 name: [
//                     { required: true, message: '用户名必须填写', trigger: 'blur' },
//                     { type: 'string', min: 2, max:15, message: '用户名 3 - 15 位长度', trigger: 'blur' }
//                 ],
//                 realname: [
//                     { required: true, message: '姓名必须填写', trigger: 'blur' },
//                     { type: 'string', min: 2, max:15, message: '姓名 3 - 15 位长度', trigger: 'blur' }
//                 ],
//                 section_id: [
//                     { required: true, message: '部门必须选择', trigger: 'change', type:'number'},
//                 ],
//                 password: [
//                     { required: true, message: '密码必须填写', trigger: 'blur' },
//                     { type: 'string', min: 6, max:15, message: '密码 6 - 15 位长度', trigger: 'blur' }
//                 ],
//             },
//             adminEditValidate: {
//                 realname: [
//                     { required: true, message: '姓名必须填写', trigger: 'blur' },
//                     { type: 'string', min: 2, max:15, message: '姓名 3 - 15 位长度', trigger: 'blur' }
//                 ],
//                 section_id: [
//                     { required: true, message: '部门必须选择', trigger: 'blur',type:'number' },
//                 ],
//             },
//             adminPasswordValidate: {
//                 password: [
//                     { required: true, message: '密码必须填写', trigger: 'blur' },
//                     { type: 'string', min: 6, max:15, message: '密码 6 - 15 位长度', trigger: 'blur' }
//                 ]
//             },
//             roleIds:[],
//         }
//     },
//     created: function () {
//         // 取数据
//         this.getTableList();
//         // this.getSectionRole();
//     },
//     methods:{
//         //查询售房列表
//         getTableList:function(){
//           this.$api.house.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
//             this.dataloading = false;
//             if(res.code == 200)
//             {
//                 this.tablelist = res.data.list;
//                 this.pages.total = res.data.total;
//                 this.$Message.success(res.msg);
//             }
//           });
//           return;
//         },
        
//         // 展开添加
//         showCreate(){
//             this.showCreateStatus = !this.showCreateStatus;
//             this.admin_id = 0;
//             this.adminInfo = {
//                 room:'',
//                 parlour:'',
//                 toilet:'',
//                 kitchen:'',
//                 balcony:'',

//                 age:'',
//                 orientation:'',
//                 area:'',
//                 use_area:'',
//                 base_price:'',
                
//                 quoted_price:'',


//                 realname:'',
//                 phone:'',
//                 email:'',
//                 password:'',
//                 password_confirmation:'',
//             };
//         },
//           // 翻页
//         changePage() {
//             this.pages.page = this.$refs['listPage'].currentPage;
//             this.renderTable(1);
//         }
        
//     },
// }
// </script>
