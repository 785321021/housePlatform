<template>
    <div class="upload-thumb2">
        <div class="upload-list"  v-for="item in uploadRecommendImgList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
            <Modal title="View Image" v-model="visible" style="text-align:center"> 
                <img :src="item.url" v-if="visible" style="max-width:100%;max-height:100%" footer-hide> 
            </Modal>
        </div>
        <!-- 上传，限制张数 -->
            <!-- <div v-if="uploadStatus"> -->
            <Upload
                ref="upload-thumb2"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','gif']"
                :max-size="2048"
                :min-size="200"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                name="file"
                :data="postData"
                action="/c-api/jqdcCommon/upload"
                style=" display:inline-block; width:90px;" :class="{'display':!uploadStatus}"
                >
                <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
            <Alert :class="{'op':!uploadStatus}">上传图片格式为'jpg','jpeg','png','gif'，大小不超过2M，请自己处理好宽高比例"</Alert>
    </div>


</template>

<script>
export default {
    name: 'UploadThumb',
    data () {
        return {
            // 已经上传成功的所有文件结果
            uploadRecommendImgList: [],
            uploadStatus:true,
            postData:{
                'thumb':0,
                'thumbWidth':'200px',
                'thumbWidth':'200px',
            },
            visible:false,
            // headers{
            //     Authorization: util.cookies.get('token')
            // }
            // defaultList: [ { 'name': 'a42bdcc1178e62b4694c830f028db5c0', 'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar' }]
        }
    },
    props: {
        defaultList:{
            type: Array,
            default: function () {
                return [];
                }
            }
        },
    mounted() {
        this.uploadRecommendImgList = this.$refs['upload-thumb2'].fileList;
    },
    watch:{
        defaultList(curVal,oldVal){
            if(curVal){
                this.uploadRecommendImgList = curVal;
            }
            if(this.uploadStats ==true){
                 this.$refs['upload-thumb2'].fileList = new Array();
                 this.uploadRecommendImgList = new Array();
            }
          
        }
    },
    created: function () {
    },
    methods:{
        handleClearFiles () {
            // 再次点击上传之前，清空之前已上传文件
            this.$refs['upload-thumb2'].clearFiles()
        },
        // 移除的回调
        handleRemove (file) {
             this.$Modal.confirm({
                title: '警告',
                content: '<p>确认要删除吗？</p>',
                onOk: () => {
                    this.uploadStatus = true;
                    // console.log(this.$refs['upload-thumb2'].fileList);
                    const fileList = this.$refs['upload-thumb2'].fileList;
                    this.$refs['upload-thumb2'].fileList.splice(fileList.indexOf(file), 1);
                    this.defaultList.splice(fileList.indexOf(file), 1);
                    // this.uploadRecommendImgList = new Array();
                 }
            });
            
        },
        // 上传成功的回调
        handleSuccess (res, file) {
            if (res.code == 200) {
                file.name = res.data.filename;
                file.url = res.data.data;
                // 更新显示的
                this.uploadRecommendImgList = this.$refs['upload-thumb2'].fileList;
                this.uploadStatus = false;
            }
            else
            {
                this.$Notice.warning({
                    title: '上传失败',
                    desc: '请检查网络及上传的内容是否符合要求！'
                });
            }
        },
        // 检查文件格式
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确, 请插入jpg/jpeg/png/gif图片。'
            });
        },
        // 检查大小
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小超出限制',
                desc: '文件 ' + file.name + ' 太大，最大就不要超过2M！'
            });
        },
        // 上传前检查数量
        handleBeforeUpload () {
            const check = this.uploadRecommendImgList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '已经超出最大可上传数量！'
                });
            }
            return check;
        },
        handleView (name) { 
            this.imgName = name; this.visible = true;
        },
    },
}
</script>


<style>
    .upload-thumb2 {
         display: flex;
    }
    .ivu-alert {
        max-width:200px;
        margin-left: 10px
    }
    .display {
        display:none!important;
    }
    .op {
        opacity: 0;
    }
    .upload-list{
        display: inline-block;
        width: 90px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-list img{
        width: 100%;
        height: 100%;
    }
    .upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .upload-list:hover .upload-list-cover{
        display: block;
    }
    .upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
