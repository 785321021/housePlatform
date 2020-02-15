<template>
    <div class="upload-video">
        <!-- 上传，限制张数 -->
        <div class="upload-list" v-for="item in uploadVideoList">
            <template v-if="item.status === 'finished'">
                <img src="/img/playVideo.png" >
                <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
            <Modal title="View Image" v-model="visible" style="text-align:center"> 
                <Video :src="item.url" v-if="visible" style="max-width:100%;max-height:100%" controls="" footer-hide> </Video>
            </Modal>
        </div>


        <Upload
            ref="upload-video"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['mp4']"
            :max-size="9999999"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            name="file"
            type="drag"
            :data="postData"
            accept="video/*"
            action="/c-api/jqdcCommon/upload"
            style="display: inline-block;width:90px;":class="{'display':!uploadStatus}">
            <div style="width: 90px;height:90px;line-height: 90px;">
                <Icon type="ios-film" size="20"></Icon>
            </div>
        </Upload>
        
        <Alert :class="{'op':!uploadStatus}" class="mt10">视频比例4:3，720P以上，只支持MP4。
                                        <p class="pclass">请等待'蓝/绿色进度条消失'则为完成状态。</p></Alert>
    </div>
</template>

<script>
export default {
    name: 'UploadVideo',
    data () {
        return {
            // 已经上传成功的所有文件结果
            uploadVideoList: [],
            uploadStatus:true,
            postData:{
                'thumb':0,
                'thumbWidth':'200px',
                'thumbWidth':'200px',
            },
            visible:false
        }
    },
    props: {
        defaultList:{
            type: Array,
            default: function () {
                return [];
            }
        },
    },
    mounted() {
        this.uploadVideoList = this.$refs['upload-video'].fileList;
    },
    watch:{
        defaultList(curVal,oldVal){
            if(curVal){
                this.uploadVideoList = curVal;
            }
            if(this.uploadStats ==true){
                 this.$refs['upload-video'].fileList = new Array();
                 this.uploadList = new Array();
            }
        }
    },
    created: function () {
    },
    methods:{
        handleProgress(){
            this.uploadVideoList = this.$refs['upload-video'].fileList;
        },
        handleClearFiles () {
            // 再次点击上传之前，清空之前已上传文件
            this.$refs.upload.clearFiles()
        },
        // 移除的回调
        handleRemove (file) {
            this.$Modal.confirm({
                title: '警告',
                content: '<p>确认要删除吗？</p>',
                onOk: () => {
                     this.uploadStatus = true;
                     const fileList = this.$refs['upload-video'].fileList;
                    this.$refs['upload-video'].fileList.splice(fileList.indexOf(file), 1);
                    this.defaultList.splice(fileList.indexOf(file), 1);
                }
            });
        },
        // 上传成功的回调
        handleSuccess (res, file) {
            if (res.code == 200) {
                file.name = res.data.filename;
                file.url = res.data.data;
                // 更新显示的
                this.uploadStatus = false;
                this.uploadVideoList = this.$refs['upload-video'].fileList;
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
                desc: '文件 ' + file.name + ' 格式不正确, 请插入mp4格式的视频。'
            });
        },
        // 检查大小
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小超出限制',
                desc: '文件 ' + file.name + ' 太大，最大就不要超过20M！'
            });
        },
        // 上传前检查数量
        handleBeforeUpload () {
            const check = this.uploadVideoList.length < 1;
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
    .upload-video {
        display: flex;
    }
    .ivu-alert {
        max-width:200px;
        margin-left: 10px;
    }
    .display {
        display:none!important;
    }
    .op {
        opacity: 0;
    }
    .upload-list{
        display: inline-block;
        width: 140px;
        height: 140px;
        text-align: center;
        line-height: 140px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-list video{
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
    .pclass{
        color:#f00;
    }
</style>
