<template>
  <div class="house-list">
    <Row>
        <Col :xs="24" :sm="12">
            <Form :model="formItem" ref="formItem" :inline="true" action="javascript:void(0)">
                <FormItem>
                    <Input v-model="formItem.houseSummary" placeholder="输入房屋信息查找..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="renderTable('formItem')">查找</Button>
                </FormItem>
            </Form>
        </Col>
        <Col :xs="24" :sm="12">
            <Button @click="showCreate()" type="success" class="f-r">添加房屋</Button>
        </Col>
    </Row>
    <Table :columns="list" ref="roleList" :data="tablelist" :loading="dataloading" border ></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page ref="listPage" :total="pages.total" :current="pages.page" :page-size="pages.size" show-elevator show-total @on-change="changePage()"></Page>
        </div>
    </div>
    <!-- 添加的弹出 -->
    <Modal v-model="showCreateStatus" title="添加房屋信息" @on-ok="createHouseInfo('houseCreateValidate')" :loading="loading"
        :styles="{top: '20px', width:'90%'}">
        <Collapse v-model="collapseInfo" simple>
            <Panel name="1">楼盘信息
                <p slot="content">
                    <Form :model="buildingInfo" ref="buildingCreateValidate" :rules="buildingCreateValidate" action="javascript:void(0)" inline>
                        <Row>
                            <Col span="6">
                                <FormItem label="楼盘信息：" label-position="right " :label-width="80" prop="agent" style="width:100%">
                                    <Select v-model="ownerInfo.agent" >
                                        <Option v-for="building in buildingList" :value="building.id" :key="building.id">{{building.name }}</Option>
                                    </Select>  
                                </FormItem>
                            </Col>
                        </Row> 
                    </Form>
                </p>
            </Panel>
            <Panel name="2">房屋信息
            <p slot="content">  
              <Form :model="houseInfo" ref="houseCreateValidate" :rules="houseCreateValidate" action="javascript:void(0)" inline>
                    <Row>
                        <Col span="3">
                            <FormItem label="室：" label-position="right" :label-width="40" prop="room">
                                <InputNumber :max="9" :min="1" v-model="houseInfo.room"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="厅：" label-position="right" :label-width="40" prop="parlour">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.parlour"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="卫：" label-position="right" :label-width="40" prop="toilet">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.toilet"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="厨：" label-position="right" :label-width="40" prop="kitchen">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.kitchen"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="阳台：" label-position="right" :label-width="50" prop="balcony">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.balcony"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="房龄：" label-position="right " :label-width="80"  prop="balcony" >
                                <DatePicker v-model="houseInfo.age"  type="year" placeholder="选择年份" ></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋朝向：" label-position="right " :label-width="80" prop="orientation" style="width:100%">
                                <Select v-model="houseInfo.orientation" >
                                    <Option v-for="item in HouseOrientation" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="建筑面积：" label-position="right " :label-width="80" prop="area" style="width:100%">
                                <Input v-model="houseInfo.area"><span slot="append">m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="使用面积：" label-position="right " :label-width="80" prop="useArea" style="width:100%">
                                <Input v-model="houseInfo.useArea"><span slot="append">m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋底价：" label-position="right " :label-width="80" prop="basePrice" style="width:100%">
                                <Input v-model="houseInfo.basePrice"><span slot="append">万</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋报价：" label-position="right " :label-width="80" prop="quotedPrice" style="width:100%">
                                <Input v-model="houseInfo.quotedPrice"><span slot="append">万</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋单价：" label-position="right " :label-width="80" prop="unitPrice" style="width:100%">
                                <Input v-model="houseInfo.unitPrice"><span slot="append">/m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="付款方式：" label-position="right " :label-width="80" prop="payMmethod" style="width:100%">
                                <Select v-model="houseInfo.payMethod" >
                                    <Option v-for="item in HousePayMethod" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="装修情况：" label-position="right " :label-width="80" prop="decorate" style="width:100%">
                                <Select v-model="houseInfo.decorate" >
                                    <Option v-for="item in HouseDecorate" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋现状：" label-position="right " :label-width="80" prop="currentStatus" style="width:100%">
                                <Select v-model="houseInfo.currentStatus" >
                                    <Option v-for="item in HouseCurrentStatus" :value="item.value" :key="item.value" >{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋证件：" label-position="right " :label-width="80" prop="papers" style="width:100%">
                                <Select v-model="houseInfo.papers" >
                                    <Option v-for="item in HousePapers" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="交房时间：" label-position="right " :label-width="80"  prop="refeHouseTime">
                                    <DatePicker v-model="houseInfo.referHouseTime"  type="date" placeholder="选择交房时间" ></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="委托时间：" label-position="right " :label-width="80"  prop="entrustTime">
                                    <DatePicker v-model="houseInfo.entrustTime"  type="date" placeholder="选择委托时间" ></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="看房方式：" label-position="right " :label-width="80" prop="visitHouse" style="width:100%">
                                <Select v-model="houseInfo.visitHouse" >
                                    <Option v-for="item in HouseVisitHouse" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="钥匙编号：" label-position="right " :label-width="80" prop="keyNum" style="width:100%">
                                <Input v-model="houseInfo.keyNum"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋来源：" label-position="right " :label-width="80" prop="houseSource" style="width:100%">
                                <Select v-model="houseInfo.houseSource" >
                                    <Option v-for="item in HouseSource" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="是否可租：" label-position="right " :label-width="80" prop="isRent" >
                                <i-switch size="large" v-model="houseInfo.isRent" true-value=1 false-value=0>
                                    <span slot="open">是</span><span slot="close">否</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                        <Col span="4">
                        </Col>
                        <Col span="4">
                        </Col>
                    </Row>
                    <Row>
                        <Col span="3">
                            <FormItem label-position="right " :label-width="30" prop="dong" style="width:100%">
                                <Input v-model="houseInfo.dong"><span slot="append">栋(座)</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label-position="right " :label-width="30" prop="unit" style="width:100%">
                                <Input v-model="houseInfo.unit"><span slot="append">单元</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <FormItem label-position="right " :label-width="30" prop="mark" style="width:100%">
                                <Input v-model="houseInfo.mark"><span slot="append">号</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="楼层：" label-position="right " :label-width="80" prop="floor" style="width:100%">
                                <InputNumber :max="99" :min="-10" v-model="houseInfo.floor"></InputNumber>  
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="总楼层：" label-position="right " :label-width="80" prop="allFloor" style="width:100%">
                                <InputNumber :max="99" :min="1" v-model="houseInfo.allFloor"></InputNumber>
                            </FormItem>
                        </Col>   
                    </Row>
                </Form>
            
            </p>
            </Panel>
            
            <Panel name="3">业主信息
            <p slot="content">
              <Form :model="ownerInfo" ref="ownerCreateValidate" :rules="ownerCreateValidate" action="javascript:void(0)" inline>
                    <Row>
                    <Col span="6">
                    <FormItem label="姓名：" label-position="right " :label-width="80" prop="name" style="width:100%">
                        <Input v-model="ownerInfo.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4">
                     <FormItem label="性别：" label-position="right " :label-width="80" prop="gender" style="width:100%">
                        <RadioGroup v-model="ownerInfo.gender">
                            <Radio label="1">男</Radio>
                            <Radio label="0">女</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="4">
                    <FormItem label="电话：" label-position="right " :label-width="80" prop="telPhone" style="width:100%">
                        <Input v-model="ownerInfo.telPhone"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4">
                    <FormItem label="移动电话：" label-position="right " :label-width="80" prop="mobilPhone" style="width:100%">
                        <Input v-model="ownerInfo.mobilPhone"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="经纪人：" label-position="right " :label-width="80" prop="agent" style="width:100%">
                            <Select v-model="ownerInfo.agent" >
                                <OptionGroup v-for="agentGroup in agentGroups" :label="agentGroup.name" >
                                    <Option v-for="agent in agentGroup.agentList" :value="agent.id" :key="agent.id">{{agent.name }}</Option>
                                </OptionGroup> 
                            </Select>  
                        </FormItem>
                    </Col>
                    </Row> 

                    <!-- <Row>
                    <Col span="24">
                    <FormItem label="标签：" label-position="right " :label-width="80" prop="lab" style="width:100%">
                    <CheckboxGroup v-model="ownerInfo.lab">
                        <Checkbox label="twitter">
                            <Icon type="logo-twitter"></Icon>
                            <span>Twitter</span>
                        </Checkbox>
                        <Checkbox label="facebook">
                            <Icon type="logo-facebook"></Icon>
                            <span>Facebook</span>
                        </Checkbox>
                    </CheckboxGroup>
                    </FormItem>
                    </Col>
                    </Row> -->

                    <Row>
                    <Col span="24">
                    <FormItem label="备注：" label-position="right " :label-width="80" prop="remark" style="width:100%">
                        <Input v-model="ownerInfo.remark" type="textarea" :rows="4"  placeholder="请输入备注信息..." />
                    </FormItem>
                    </Col>
                    </Row>
                </Form>
            </p>
            </Panel>
        </Collapse>
    </Modal>
    <!-- 修改房屋信息 -->
    <Modal v-model="showEditInfoStatus" title="修改房屋信息" @on-ok="updateHouseInfo('houseEditValidate')" :loading="loading"
        :styles="{top: '20px', width:'90%'}">
        <Collapse v-model="collapseInfo" simple>
            <Panel name="1">楼盘信息
            <p slot="content">
                
            </p>
            </Panel>
            <Panel name="2">房屋信息
            <p slot="content">  
              <Form :model="houseInfo" ref="houseCreateValidate" :rules="houseCreateValidate" action="javascript:void(0)" inline>
                    <Row>
                        <Col span="3">
                            <FormItem label="室：" label-position="right" :label-width="40" prop="room">
                                <InputNumber :max="9" :min="1" v-model="houseInfo.room"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="厅：" label-position="right" :label-width="40" prop="parlour">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.parlour"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="卫：" label-position="right" :label-width="40" prop="toilet">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.toilet"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="厨：" label-position="right" :label-width="40" prop="kitchen">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.kitchen"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="阳台：" label-position="right" :label-width="50" prop="balcony">
                                <InputNumber :max="5" :min="1" v-model="houseInfo.balcony"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="房龄：" label-position="right " :label-width="80"  prop="balcony" >
                                <DatePicker v-model="houseInfo.age"  type="year" placeholder="选择年份" ></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋朝向：" label-position="right " :label-width="80" prop="orientation" style="width:100%">
                                <Select v-model="houseInfo.orientation" >
                                    <Option v-for="item in HouseOrientation" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="建筑面积：" label-position="right " :label-width="80" prop="area" style="width:100%">
                                <Input v-model="houseInfo.area"><span slot="append">m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="使用面积：" label-position="right " :label-width="80" prop="useArea" style="width:100%">
                                <Input v-model="houseInfo.useArea"><span slot="append">m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋底价：" label-position="right " :label-width="80" prop="basePrice" style="width:100%">
                                <Input v-model="houseInfo.basePrice"><span slot="append">万</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋报价：" label-position="right " :label-width="80" prop="quotedPrice" style="width:100%">
                                <Input v-model="houseInfo.quotedPrice"><span slot="append">万</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋单价：" label-position="right " :label-width="80" prop="unitPrice" style="width:100%">
                                <Input v-model="houseInfo.unitPrice"><span slot="append">/m²</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="付款方式：" label-position="right " :label-width="80" prop="payMmethod" style="width:100%">
                                <Select v-model="houseInfo.payMethod" >
                                    <Option v-for="item in HousePayMethod" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="装修情况：" label-position="right " :label-width="80" prop="decorate" style="width:100%">
                                <Select v-model="houseInfo.decorate" >
                                    <Option v-for="item in HouseDecorate" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋现状：" label-position="right " :label-width="80" prop="currentStatus" style="width:100%">
                                <Select v-model="houseInfo.currentStatus" >
                                    <Option v-for="item in HouseCurrentStatus" :value="item.value" :key="item.value" >{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋证件：" label-position="right " :label-width="80" prop="papers" style="width:100%">
                                <Select v-model="houseInfo.papers" >
                                    <Option v-for="item in HousePapers" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="交房时间：" label-position="right " :label-width="80"  prop="refeHouseTime">
                                    <DatePicker v-model="houseInfo.referHouseTime"  type="date" placeholder="选择交房时间" ></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="委托时间：" label-position="right " :label-width="80"  prop="entrustTime">
                                    <DatePicker v-model="houseInfo.entrustTime"  type="date" placeholder="选择委托时间" ></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                            <FormItem label="看房方式：" label-position="right " :label-width="80" prop="visitHouse" style="width:100%">
                                <Select v-model="houseInfo.visitHouse" >
                                    <Option v-for="item in HouseVisitHouse" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="钥匙编号：" label-position="right " :label-width="80" prop="keyNum" style="width:100%">
                                <Input v-model="houseInfo.keyNum"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="房屋来源：" label-position="right " :label-width="80" prop="houseSource" style="width:100%">
                                <Select v-model="houseInfo.houseSource" >
                                    <Option v-for="item in HouseSource" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="是否可租：" label-position="right " :label-width="80" prop="isRent" >
                                <i-switch size="large" v-model="houseInfo.isRent" true-value=1 false-value=0>
                                    <span slot="open">是</span><span slot="close">否</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                        <Col span="4">
                        </Col>
                        <Col span="4">
                        </Col>
                    </Row>
                    <Row>
                        <Col span="3">
                            <FormItem label-position="right " :label-width="30" prop="dong" style="width:100%">
                                <Input v-model="houseInfo.dong"><span slot="append">栋(座)</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label-position="right " :label-width="30" prop="unit" style="width:100%">
                                <Input v-model="houseInfo.unit"><span slot="append">单元</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <FormItem label-position="right " :label-width="30" prop="mark" style="width:100%">
                                <Input v-model="houseInfo.mark"><span slot="append">号</span></Input>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="楼层：" label-position="right " :label-width="80" prop="floor" style="width:100%">
                                <InputNumber :max="99" :min="-10" v-model="houseInfo.floor"></InputNumber>  
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="总楼层：" label-position="right " :label-width="80" prop="allFloor" style="width:100%">
                                <InputNumber :max="99" :min="1" v-model="houseInfo.allFloor"></InputNumber>
                            </FormItem>
                        </Col>   
                    </Row>
                </Form>
            
            </p>
            </Panel>
            
            <Panel name="3">业主信息
            <p slot="content">
              <Form :model="ownerInfo" ref="ownerCreateValidate" :rules="ownerCreateValidate" action="javascript:void(0)" inline>
                    <Row>
                    <Col span="6">
                    <FormItem label="姓名：" label-position="right " :label-width="80" prop="name" style="width:100%">
                        <Input v-model="ownerInfo.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4">
                     <FormItem label="性别：" label-position="right " :label-width="80" prop="gender" style="width:100%">
                        <RadioGroup v-model="ownerInfo.gender">
                            <Radio label="1">男</Radio>
                            <Radio label="0">女</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="4">
                    <FormItem label="电话：" label-position="right " :label-width="80" prop="telPhone" style="width:100%">
                        <Input v-model="ownerInfo.telPhone"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4">
                    <FormItem label="移动电话：" label-position="right " :label-width="80" prop="mobilPhone" style="width:100%">
                        <Input v-model="ownerInfo.mobilPhone"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="经纪人：" label-position="right " :label-width="80" prop="agent" style="width:100%">
                            <Select v-model="ownerInfo.agent" >
                                <OptionGroup v-for="agentGroup in agentGroups" :label="agentGroup.name" >
                                    <Option v-for="agent in agentGroup.agentList" :value="agent.id" :key="agent.id">{{agent.name }}</Option>
                                </OptionGroup> 
                            </Select>  
                        </FormItem>
                    </Col>
                    </Row> 

                    <!-- <Row>
                    <Col span="24">
                    <FormItem label="标签：" label-position="right " :label-width="80" prop="lab" style="width:100%">
                    <CheckboxGroup v-model="ownerInfo.lab">
                        <Checkbox label="twitter">
                            <Icon type="logo-twitter"></Icon>
                            <span>Twitter</span>
                        </Checkbox>
                        <Checkbox label="facebook">
                            <Icon type="logo-facebook"></Icon>
                            <span>Facebook</span>
                        </Checkbox>
                    </CheckboxGroup>
                    </FormItem>
                    </Col>
                    </Row> -->

                    <Row>
                    <Col span="24">
                    <FormItem label="备注：" label-position="right " :label-width="80" prop="remark" style="width:100%">
                        <Input v-model="ownerInfo.remark" type="textarea" :rows="4"  placeholder="请输入备注信息..." />
                    </FormItem>
                    </Col>
                    </Row>
                </Form>
            </p>
            </Panel>
        </Collapse>
    </Modal>
    
  </div>
</template>

<script>
export default {
    name: 'house-list',
    created: function () {
        // 查询数据字典
        this.getDictInfo();
        
        // 取数据
        this.getTableList();
    },
    data () {
        return {
            loading: true,
            dataloading: true,
            houseId:'',
            formItem:{
                'houseSummary':'',
            },
            DictTypeIdList:["07463f78-7aeb-4a38-a7a0-f8257f38e5b4","aff78380-bb1f-4b45-8aba-05d4ac36b22a",
            "120aa28c-ce1e-4c6b-bd5b-f05036a9ff5c","be3d89ee-6bdd-49bd-aa3a-4bcff0395fe9","bde2b5e3-0c3d-43aa-8122-3cf152e3b0b9",
            "72c66e52-280f-42ff-8697-8832c7c7b875","f7182705-2bde-4a56-b90f-d50eb1b68f76"],
            HouseOrientation:[],//房屋朝向
            HouseOrientationDict:{},
            HousePayMethod:[],//房屋付款方式
            HouseDecorate:[],//装修情况
            HouseCurrentStatus:[],//房屋目前状态
            HousePapers:[],//房屋证件
            HouseVisitHouse:[],//房屋查看方式
            HouseSource:[],//房屋来源
            pages:{
                page:1,
                size:10,
                total:0
            },
            
            list: [
                {
                    title: '房源编号',
                    width:100,
                    resizable: true,
                    key: 'number'
                },
                {
                    title: '楼盘名称',
                    minWidth:120,
                    resizable: true,
                    key: 'buildingName'
                },
                {
                    title: '朝向',
                    width:80,
                    resizable: true,
                    key: 'orientation',
                    render: (h, params) => {
                        for (var i=0; i<this.HouseOrientation.length; i++){
                            if(params.row.orientation ==  this.HouseOrientation[i].value){
                                return h('strong', this.HouseOrientation[i].label)
                            }
                        }                    
                    }
                },
                {
                    title: '室',
                    width:50,
                    resizable: true,
                    key: 'room',
                },
                {
                    title: '厅',
                    width:50,
                    resizable: true,
                    key: 'parlour'
                },
                {
                    title: '卫',
                    width:50,
                    resizable: true,
                    key: 'toilet'
                },
                {
                    title: '类型',
                    width:70,
                    resizable: true,
                    key: 'type'
                },
                {
                    title: '装修',
                    width:70,
                    resizable: true,
                    key: 'decorate'
                },
                {
                    title: '面积',
                    width:70,
                    resizable: true,
                    key: 'area'
                },
                {
                    title: '报价',
                    width:70,
                    resizable: true,
                    key: 'quotedPrice'
                },
                {
                    title: '单价',
                    width:70,
                    resizable: true,
                    key: 'unitPrice'
                },
                {
                    title: '经纪人',
                    width:80,
                    resizable: true,
                    key: 'agent'
                },
                {
                    title: '状态',
                    width:70,
                    resizable: true,
                    key: 'agent'
                },
                {
                    title: '最后跟进时间',
                    width:140,
                    resizable: true,
                    key: 'lasttime',
                    // render: (h,params) => {
                    //     return this.filters.formatDate(params.row.lasttime);
                    // }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:140,
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
                                        this.showEditInfo(params.row.houseId)
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
            roleList:[],
            sectionList:[],
            houseInfo:{
                room:0,//室
                parlour:0,//厅
                toilet:0,//卫
                kitchen:0,//厨
                balcony:0,//阳台
                
                age:'',//房龄
                orientation:'',//房屋朝向
                area:'',//建筑面积
                useArea:'',//使用面积
                basePrice:'',//房屋底价

                quotedPrice:'',//房屋报价
                unitPrice:'',//房屋单价
                payMethod:'',//付款方式
                decorate:'',//装修情况
                currentStatus:'',//房屋现状

                referHouseTime:'',//交房时间
                entrustTime:'',//委托时间
                papers:'',//房屋证件
                visitHouse:'',//看房方式
                keyNum:'',//钥匙编号

                houseSource:'',//房屋来源
                isRent:0,//是否可租
                owner:'',
                floor:0,
                allFloor:0
            },
            buildingInfo:{
                
            },
            ownerInfo:{
                name:'',//姓名
                gender:''
            },
            agentGroups: [],
            buildingList:[],
            
            collapseInfo: ['1', '2', '3'],
            showCreateStatus: false,
            showEditInfoStatus:false,
            showEditPwdStatus:false,
            houseCreateValidate: {
                // name: [
                //     { required: true, message: '用户名必须填写', trigger: 'blur' },
                //     { type: 'string', min: 2, max:15, message: '用户名 3 - 15 位长度', trigger: 'blur' }
                // ],
                
            },
            houseEditValidate: {
                // realname: [
                //     { required: true, message: '姓名必须填写', trigger: 'blur' },
                //     { type: 'string', min: 2, max:15, message: '姓名 3 - 15 位长度', trigger: 'blur' }
                // ],
            },
            ownerCreateValidate: {
                name: [
                    { required: true, message: '联系人姓名名必须填写', trigger: 'blur' },
                    { type: 'string', min: 2, max:15, message: '用户名 1 - 15 位长度', trigger: 'blur' }
                ],
                
            },
            
            
        }
    },
    
    methods:{
        //查询售房列表
        getTableList:function(){
          this.$api.house.list({"page":this.pages.page,"size":this.pages.size}).then(res=>{
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
            this.houseInfo = {
                room:0,//室
                parlour:0,//厅
                toilet:0,//卫
                kitchen:0,//厨
                balcony:0,//阳台
                
                age:'',//房龄
                orientation:'',//房屋朝向
                area:'',//建筑面积
                useArea:'',//使用面积
                basePrice:'',//房屋底价

                quotedPrice:'',//房屋报价
                unitPrice:'',//房屋单价
                payMethod:'',//付款方式
                decorate:'',//装修情况
                currentStatus:'',//房屋现状

                referHouseTime:'',//交房时间
                entrustTime:'',//委托时间
                papers:'',//房屋证件
                visitHouse:'',//看房方式
                keyNum:'',//钥匙编号

                houseSource:'',//房屋来源
                isRent:0,//是否可租
                floor:0,//楼层数
                allFloor:0,//总楼层
            };
            this.ownerInfo = {
                gender:'1'
            };
            // 查询经纪人组
            this.getAgentGroup();
            //查询楼盘信息列表
            this.getBuildingList();
            
        },

        // 添加
        createHouseInfo(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.houseInfo.owner=this.ownerInfo
                    this.$api.house.create(this.houseInfo).then(res=>{
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
            this.houseId = value;
            this.showEditInfoStatus = !this.showEditInfoStatus;
            // 取信息
            this.$api.house.detail({houseId:value}).then(res=>{
                if(res.code == 200){
                    this.houseInfo = res.data;
                    if (res.data.owner != null){
                        this.ownerInfo = res.data.owner
                    }
                    this.$Message.success(res.msg);
                }
                this.loading = false;
                // this.$nextTick(() => {this.loading = true;});
            });
            // 查询经纪人组
            this.getAgentGroup();
        },
        // 修改
        updateHouseInfo:function(name){
            this.houseInfo.owner=this.ownerInfo
            this.$api.house.editinfo(this.houseInfo).then(res=>{
                if(res.code == 200){
                    this.$Message.success(res.msg);
                }
                this.loading = false;
                this.$nextTick(() => {this.loading = true;});
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
            var ps = {'summary':this.formItem.houseSummary,"page":this.pages.page,"size":this.pages.size};
            this.$api.house.list(ps).then(res=>{
                if(res.code == 200){
                    this.tablelist = res.data.list;
                    this.pages.total = res.data.total;
                    this.$Message.success(res.msg);
                }
                this.dataloading = false;
            });
            return;
        },



        //查询本模块所需要的全部数据字典
        getDictInfo:function(){
            // alert(this.DictTypeIdList)
            this.$api.dictType.dictList({"dict_type_id_list":this.DictTypeIdList}).then(res=>{
                if(res.code == 200){
                    this.HouseOrientation = res.data.orientation;
                    this.HouseOrientationDict = res.data.orientationDict;
                    this.HousePayMethod = res.data.payMethod;
                    this.HouseDecorate = res.data.decorate;
                    this.HouseCurrentStatus = res.data.currentStatus;
                    this.HousePapers = res.data.papers;
                    this.HouseVisitHouse = res.data.visitHouse;
                    this.HouseSource = res.data.houseSource;
                    // alert(this.DictStatue)
                    // this.test=res.data.orientation[2].label
                }
            });
        },
        //查询各个公司的经纪人
        getAgentGroup:function(){
            this.$api.agent.listByStore({}).then(res=>{
                if(res.code == 200){
                 
                    this.agentGroups = res.data;
                    
                }
            });
        },
        getBuildingList:function(){
            this.$api.building.list({}).then(res=>{
                if(res.code == 200){
                    this.buildingList = res.data;
                }
            });
        },
    },
}
</script>
