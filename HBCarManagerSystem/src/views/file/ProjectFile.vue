<template>
  <div>
    <el-row style="height: 100%;width: 100%">
    <!--左侧-->
    <div id="left_box" style="height: 100%;float: left">
      <!-- 标题 -->
      <div style="width: 100%;height: 50px;text-align: center">
        <div style="border-radius:2px;margin:0 auto;background-color: #D9EBFF;border: #C3E1FF 1px solid;height: 30px;width: 90%;margin-top: 10px;text-align: center">
                    <span id="file_box_title" style="display: block;font-size: 14px;margin-top: 4px;">
                        &nbsp;&nbsp;<i class="el-icon-folder"></i>必备要件已上传
                    &nbsp;&nbsp;
                    <i class="el-icon-folder"></i>必备要件未上传
                    </span>
        </div>
      </div>
      <!-- 树形菜单 -->
      <div id="tree_box" class="tree_box" style="width: 350px;overflow-x:auto;overflow-y:auto">
        <el-row id="tree_box1" class="slot-tree" style="width: 100%" type="flex"><!--type="flex"-->
          <el-tree class="slot-tree" style="font-size: 17px;"
                   v-if="isLoadingTree"
                   node-key="id"
                   ref="tree"
                   highlight-current
                   :data="treeData"
                   :props="defaultProps"
                   @node-click="show">
                                <span class="slot-t-node" slot-scope="{ node, data }">
                                  <!--设置节点名称和节点的图标-->
                                  <span v-if="data.level==1">
                                    <span v-if="data.children.length==0">
                                      <i class="el-icon-folder"></i><span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
                                    </span>
                                    <span v-else>
                                      <i class="el-icon-folder"></i><span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    <i class="el-icon-folder"></i><span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
                                  </span>

                                  <!--设置节点的操作按钮-->
                                  <span v-show="!node.isEdit" style="position:absolute;left:20%;">
                                    <!--如果是根节点则只有新增按钮，如果不是则有编辑、下载和删除按钮-->
                                    <span class="slot-t-icons" v-if="data.level==1">
                                      <!-- 文件上传按钮 -->
                                          <el-button type="primary" plain @click="NodeAdd(node, data)" size="mini">上传</el-button>
                                      <!--<el-button icon="el-icon-plus" circle :size="iconSize" type="success" @click="NodeAdd(node, data)"></el-button>-->
                                    </span>
                                    <span class="slot-t-icons" v-else-if="data.level==2">
                                      <!-- 预览按钮 -->
                                          <el-button type="primary" plain @click="preview(node, data)" size="mini">预览</el-button>
                                      <!--<el-button icon="el-icon-view" circle :size="iconSize" type="primary" @click="preview(node, data)"></el-button>-->
                                      <!-- 编辑按钮 -->
                                          <el-button type="primary" plain @click="NodeEdit(node, data)" size="mini">重命名</el-button>
                                      <!--<el-button icon="el-icon-edit" circle :size="iconSize" type="primary" @click="NodeEdit(node, data)"></el-button>-->
                                      <!-- 下载按钮 -->
                                          <el-button type="primary" plain @click="downLoadFile(node, data)" size="mini">下载</el-button>
                                      <!--<el-button icon="el-icon-download" circle :size="iconSize" type="primary" @click="downLoadFile(node, data)"></el-button>-->
                                      <!-- 删除按钮 -->
                                          <el-button type="primary" plain @click="NodeDel(node, data)" size="mini">删除</el-button>
                                      <!--<el-button icon="el-icon-delete" circle :size="iconSize" type="warning" @click="NodeDel(node, data)"></el-button>-->
                                    </span>
                                  </span>
                                </span>
          </el-tree>
        </el-row>
      </div>
    </div>
    <!-- 中线 -->
    <div id="center_box" style="height: 100%;width: 20px;float: left">
      <div style="width: 1px;height: 100%;background-color: #D5D8DD"></div>
    </div>
    <!-- 右侧 -->
    <div id="right_box" style="height: 100%;float: left">
      <el-container style="width: 100%;height: 100%">
        <div style="width: 100%;height: 100%;"><!--style="width: 100%;"-->

          <div id="showImg_box" style="text-align:left; float:left;width: 100%;height: 100%">
            <div id="showImg_box_title" style=";height: 30px;background-color: #F0F8FF;text-align:center;line-height:30px;margin-top: 10px">
              <span style="vertical-align: middle;">文件详情</span>
            </div>
            <el-row class="file_m" style="width: 100%;height: 100%;margin-top: -30px">
              <!--<div id="filePath" style="height: 3%;padding-left:4px">-->
              <!--<p><span>&nbsp;{{filePath}}</span></p>-->
              <!--</div>-->

              <iframe v-if="pdfVisible" :src="fileSrc" style="width: 100%;height: 100%"  id="previewIframe" frameborder="false" scrolling="no" allowtransparency="true"></iframe><!--frameborder="false" scrolling="no" allowtransparency="true"-->
              <div v-if="imageVisible" id="showImg" style="width: 100%;height: 100%"  v-viewer="{inline:true,navbar:false}">
                <img id="img" :src="fileSrc" :key="src" style="display: none;width: 100%;height: 100%">
              </div>

            </el-row>
          </div>
        </div>
      </el-container>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" append-to-body>
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="新文件名" prop="fileName" :label-width="formLabelWidth">
          <el-input id="changeInput" v-model="form.fileName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRenameDialog('form')">取 消</el-button>
        <el-button type="primary" @click="fileRenameSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--文件上传Dialog对话框-->
    <!--<el-dialog  width="490px"  :title="uploadDialogTitle" :visible.sync="uploadDialogVisible" @close="closeUploadDialog" append-to-body>
      <div id="uploadDialog" style="margin:0 auto;width: 100%;height: 500px;text-align: center">
        <div id="file" style="text-align: left;margin:0 auto;width: 80%;height: 500px;">
          <el-upload
            class=""
            style="width: 100%"
            ref="upload"
            :data="uploadParam"
            :before-remove="beforeRemove"
            :on-preview="handlePreview"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :file-list="fileList"
            drag
            :action="uploadUrl"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<el-button @click="selectFile" type="primary" size="mini">点击上传</el-button></div>
            <div style="margin-left: 5px;width: 100%;text-align: left" slot="tip">
              <div style="width: 100%;height: 30px;font-size: 16px"><span style="vertical-align: middle;">文件列表</span></div>
            </div>
          </el-upload>

        </div>
      </div>
      <div id="endUpload" style="text-align:left;width: 100%;height: 40px">
        <div style="width: 100%;height: 60px;font-size: 16px">
          <div style="width: 100%;height: 30px;font-size: 16px;padding: 30px 0px 0px 0px">
            <el-button type="text" style="font-size: 16px;color: #7A7BB5" @click="changeStyle()"><span>显示全部文件</span></el-button>
          </div>
        </div>
      </div>
    </el-dialog>-->
  </el-row>
    <uploader :options="options" class="uploader-example">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>Drop files here to upload or</p>
      <uploader-btn>select files</uploader-btn>
      <uploader-btn :attrs="attrs">select images</uploader-btn>
      <uploader-btn :directory="true">select folder</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
    export default {
        name: "ProjectFile",
      props: ['token', 'modeId', 'fileCategoryId', 'iid','width','height'],
      data(){
          return{
            options:{
              target: this.updateFileApi,
              testChunks: false
            },
            attrs: {
              accept: 'image/*'
            },
            fileNameList:[],
            rootPath:this.updateFileApi,//根路径
            maxexpandId: 95,//新增节点开始id
            non_maxexpandId: 95,//新增节点开始id(不更改)
            isLoadingTree: true,//是否加载节点树
            iconSize: 'mini',
            defaultProps: {
              id:'id',
              fileType:'fileType',
              showUrl:'showUrl',
              changeUrl:'changeUrl',
              label: 'label',
              children: 'children',
              isEdit:'isEdit',
              ip:'ip',
              port:'port',
            },
            treeData: [{id:'1',label:'根目录',level:'1',fileType:'',children:[{id:'1.1',label:'文件1',level:'2',fileType:'',children:[ { id:'1.1.1',label:'文件6',fileType:'',level:'3'}]},{id:'1.2',label:'文件2',level:'2'},{id:'1.3',label:'文件3',level:'2',},{id:'1.4',label:'文件4',level:'2',},{id:'1.5',label:'文件5',level:'2',}]}],//树组件数据集

            // 文件重命名对话框属性
            dialogTitle: '文件重命名',
            dialogFormVisible: false,
            form: {
              fileData: {},//文件的Id
              fileName: '',
            },
            formRules: {
              fileName: [
                {required: true, message: '请输入新的文件名称', trigger: 'blur'}
              ],
            },
            interfaceName2:"",
            methodName2:"upload",
            fileName2:"",
            formLabelWidth: '100px',

            //文件上传对话框属性
            selectedNodeData: {},
            temporaryFile:"",
            mode_id:"",
            uploadUrl:this.updateFileApi,//这个就是文件上传的url,在loadTree方法可以对他赋值,也可以写死
            uploadParam:{ a:'这个可以在上传方法里面同时携带其他参数' },
            upLoadData: {
              interfaceName:"",
              methodName:"upload"
            },
            uploadDialogTitle: '添加附件',
            uploadDialogVisible: false,
            uploadForm: {},
            uploadFormRules: {},
            fileList: [],
            uploadFileList: [],

            //文件预览
            filePath: '文件路径：',
            pdfVisible:false,
            imageVisible:false,
            fileSrc: '',//文件预览的地址
            //页面自适应参数
            fixStyle: '',
            port:'',
            ip:''
          }
      },
      computed: {
        ...mapGetters([
          'updateFileApi'
        ])
      },
      methods:{
        styleInit () {
          let width = 1200;
          let height = 700;
          document.getElementById("#init_box").css("width",width);
          document.getElementById("#init_box").css("height",height);
          document.getElementById("#left_box").css("width",350);
          document.getElementById("#right_box").css("width",width-370);
          document.getElementById("#tree_box").css("height",height-60);
          document.getElementById("#showImg_box_title").css("width",width-370);

          //预览窗口大小
          document.getElementById("#previewIframe").css("height",height);
          document.getElementById("#showImg").css("height",height);
          document.getElementById("#img").css("height",height);


        },
        //加载电子附件树型列表
        loadTree(){
          let self=this;
          //初始化上传地址
          self.uploadUrl = self.getRootPath() + "/upload";
          //console.info(self.getRootPath());
          //组装参数
          let param=[];
          //获取后端文件目录
        },
        getRootPath() {
          //获取当前网址，如： http://localhost:8088/test/test.jsp
          let curPath = window.document.location.href;
          //获取主机地址之后的目录，如： test/test.jsp
          let pathName = window.document.location.pathname;
          let pos = curPath.indexOf(pathName);
          //获取主机地址，如： http://localhost:8088
          let localhostPath = curPath.substring(0, pos);
          //获取带"/"的项目名，如：/test
          let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
          return (localhostPath + projectName);//发布前用此
          //  return (localhostPath);//发布后用此

        },
        // 文件上传
        NodeAdd(n, d) {//新增节点
          this.fileNameList = [];
          this.uploadDialogVisible = true;
          this.selectedNodeData = d;
          this.mode_id = d.id;
          this.uploadParam.token = 'token';
          this.uploadParam.modeId = d.id;
          this.uploadParam.ip = d.ip;
          this.uploadParam.port = d.port;
          setTimeout(() => {
            this.showSelect();
          },0)
        },
        //上传裂变滚动条
        showSelect() {
          document.getElementById("#uploadDialog").height(500);
          document.getElementById("#endUpload").show();
          document.getElementById("file").getElementsByTagName("ul")[0].style['height'] = '300px';
          document.getElementById("file").getElementsByTagName("ul")[0].style['overflow'] = 'auto';
        },
        //改变进度条
        changeStyle(){
          let count = document.getElementById("file").getElementsByTagName("li").length;
          let height = count * 31;
          if(height >300){
            let result2 = 240+height+'px';
            let result = height+"px";
            document.getElementById("#uploadDialog").height(result2);
            document.getElementById("#endUpload").hide();
            document.getElementById("file").getElementsByTagName("ul")[0].style['height'] = result;
          }else{
            document.getElementById("#endUpload").hide();
          }
        },
        //触发文件上传
        selectFile() {
          document.getElementById("#selectFile").click();
        },
        //执行上传
        submitUpload() {
          this.$refs.upload.submit();
        },
        // 上传成功后的回调
        uploadSuccess(response, file, fileList) {
          this.fileList = fileList;
          //1.将文件的节点数据添加到数列表中
          let newChild = JSON.parse(response.result);
          if (!this.selectedNodeData.children){
            this.$set(this.selectedNodeData, 'children', []);
          }
          this.selectedNodeData.children.push(newChild);
          //this.showSelect();
          let name1 = file.url;
          let id = newChild.id;
          let tab = {'url':name1,'id':id};
          this.fileNameList.push(tab);
        },
        // 上传错误
        uploadError(response, file, fileList) {
          alert("上传失败，请重试！");
        },
        //点击文件上传对话框右上方的关闭按钮触发，询问是否删除已上传的文件
        closeUploadDialog(done) {
          //清除数据并关闭上传对话框
          this.selectedNodeData = {};
          this.fileList = [];
          this.$refs.upload.clearFiles();
          this.fileNameList = [];
        },
        //文件预览
        show(node){
          let self = this;
          self.fileSrc = "";
          if(node.level == 2){
            //1.首先判断文件的类型，只有图片和pdf支持预览,如果不是图片或pdf文件则不预览
            let fileType = node.fileType;
            if (fileType != 'jpg' && fileType != 'png' && fileType != 'gif' && fileType != 'jpeg' && fileType != 'bmp' && fileType != 'pdf') {
              self.$alert('对不起！系统只支持预览图片和pdf文件', '系统提示', {
                confirmButtonText: '确定',
                type: 'error'
              });
              self.filePath = node.showUrl;
              self.pdfVisible = false;
              self.imageVisible = false;
              return
            }
            //2.显示文件的节点路径
            // let parentLabel = n.parent.data.label;
            // self.filePath = "文件路径："+parentLabel+" / "+n.data.label;
            //3.请求文件
            //console.log(node.showUrl);
            self.fileSrc = node.showUrl;
            if (fileType == 'pdf'){
              self.imageVisible = false;
              self.pdfVisible = true;
            }else{
              self.pdfVisible = false;
              self.imageVisible = true;
            }
          }
        },
        preview(n,d){
          let self = this;
          self.fileSrc = "";
          if(d.level == 2){
            //1.首先判断文件的类型，只有图片和pdf支持预览,如果不是图片或pdf文件则不预览
            let fileType = d.fileType;
            if (fileType != 'jpg' && fileType != 'png' && fileType != 'gif' && fileType != 'jpeg' && fileType != 'bmp' && fileType != 'pdf') {
              self.$alert('对不起！系统只支持预览图片和pdf文件', '系统提示', {
                confirmButtonText: '确定',
                type: 'error'
              });
              self.filePath = d.showUrl;
              self.pdfVisible = false;
              self.imageVisible = false;
              return
            }
            //2.显示文件的节点路径
            let parentLabel = n.parent.data.label;
            self.filePath = "文件路径："+parentLabel+" / "+n.data.label;
            //3.请求文件
            //console.log(n.data.showUrl);
            self.fileSrc = n.data.showUrl;
            if (fileType == 'pdf'){
              self.imageVisible = false;
              self.pdfVisible = true;
            }else{
              self.pdfVisible = false;
              self.imageVisible = true;
            }
          }
        },
        //文件重命名
        NodeEdit(n, d) {
          this.dialogTitle = "文件重命名【 " + d.label + " 】";
          this.dialogFormVisible = true;
          this.form.fileData = d;
          let file = d.fileType;
          let filename = d.label;
          let i = filename.lastIndexOf("."+file);
          this.form.fileName = filename.substring(0,i);
        },
        fileRenameSubmit() {
          let self = this;
          self.$refs.form.validate((valid) => {
            if (valid) {
              //1.首先校验旧文件名和新文件名是否同名，如果是则提示
              let oldName = self.form.fileData.label;
              let newName = self.form.fileName+"."+self.form.fileData.fileType;
              if (oldName === newName){
                self.$alert("新文件名和原文件名同名", '系统提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  callback: function () {
                    return;
                  }
                });
              }
              let dbUrl = self.$API.ajaxPath;
              let userId = self.$.cookie("userId");
              let param=[];
              param.push(this.token);
              param.push(userId);//user_id
              param.push(self.form.fileData.id);//file_id
              param.push(self.form.fileName);//新的文件名

              $.ajax({
                type:'post',
                url:dbUrl,
                data:{
                  args:param
                },
                success:function (data) {
                  if (data.status == "0") {
                    self.$alert("文件重命名成功", '系统提示', {
                      confirmButtonText: '确定',
                      type: 'success',
                      callback: function () {
                        //修改树列表中被修改的文件的文件名
                        self.form.fileData.label = newName;
                      }
                    });
                    self.dialogFormVisible = false;
                  }
                  else {
                    self.$alert("文件重命名失败", '系统提示', {
                      confirmButtonText: '确定',
                      type: 'warning',
                      callback: function () {
                        self.closeRenameDialog('form');
                      }
                    });
                  }
                }
              })
            }
          });
        },
        //取消文件重命名
        closeRenameDialog(formName) {
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
        },
        //文件下载
        downLoadFile(n,d) {
          let self = this;
          let fileName = d.label;
          let fileId = d.id;
          let param=[];
          let downloadPath = self.$API.downloadPath;
          param.push(this.token);
          param.push(fileId);

          window.location.href=self.getRootPath()+"/download?token=&fileName="+d.label+"&file_id="+fileId;
        },
        //删除文件
        NodeDel(n, d) {
          let self=this;
          self.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //组装请求参数
            let dbUrl = self.$API.ajaxPath;
            let userId = self.$.cookie("userId");
            let param=[];
            param.push(this.token);
            param.push(userId);
            param.push(d.id);
            $.ajax({
              type: "POST",
              async:true,
              url: dbUrl,
              data:{args:param},
              success: function(data) {
                // console.log(JSON.stringify(data));
                if (data.status == 0){
                  // $("#img").attr("src","");
                  // $("#previewIframe").attr("src","");
                  //删除成功之后，将树列表中的文件的节点删除
                  self.$refs.tree.remove(n);
                  //最后弹出成功删除提示框
                  self.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }else {
                  self.$message({
                    type: 'warning',
                    message: '删除失败!'
                  });
                }
              },
              error: function(e) {
                self.$message({
                  type: 'error',
                  message: e.message
                });
              }
            });
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handlePreview(file) {
          //点击事件
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList) {
          let self=this;
          //组装请求参数
          let dbUrl = self.$API.ajaxPath;
          let userId = self.$.cookie("userId");
          let param=[];
          let list = this.fileNameList;
          let url = file.url;
          let id='';
          for(let i=0;i<list.length;i++){
            if(list[i].url == url){
              id = list[i].id;
            }
          }
          param.push(this.token);
          param.push(userId);
          param.push(id);
          $.ajax({
            type: "POST",
            url: dbUrl,
            data:{args:param},
            success: function(data) {
              if (data.status == 0){
                //删除成功之后，将树列表中的文件的节点删除
                let treeObj = self.$refs.tree;
                treeObj.remove(treeObj.getNode(id));
                //最后弹出成功删除提示框
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else {
                self.$message({
                  type: 'warning',
                  message: '删除失败!'
                });
              }
            },
            error: function(e) {
              self.$message({
                type: 'error',
                message: e.message
              });
            }
          });
        },
        //iframe自适应高度
        reinitIframe(){
          var iframe = document.getElementById("previewIframe");
          try{
            let bHeight = iframe.contentWindow.document.body.scrollHeight;
            let dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
            let height = Math.min(bHeight, dHeight);
            iframe.height = height;
          }catch (ex){
            console.log(ex);
          }
          //setInterval("reinitIframe",1000);
        },
        //页面自适应窗口大小
        pageAdapter(){
          window.onresize = () => {
            const windowWidth = document.body.clientWidth
            const windowHeight = document.body.clientHeight
            const windowAspectRatio = windowHeight / windowWidth
            let videoWidth
            let videoHeight
            if (windowAspectRatio < 0.5625) {
              videoWidth = windowWidth
              videoHeight = videoWidth * 0.5625
              this.fixStyle = {
                height: windowWidth * 0.5625 + 'px',
                width: windowWidth + 'px',
                'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
                'margin-left': 'initial'
              }
            } else {
              videoHeight = windowHeight
              videoWidth = videoHeight / 0.5625
              this.fixStyle = {
                height: windowHeight + 'px',
                width: windowHeight / 0.5625 + 'px',
                'margin-left': (windowWidth - videoWidth) / 2 + 'px',
                'margin-bottom': 'initial'
              }
            }
          }
          window.onresize()
        },
      },
      mounted() {
        this.loadTree()
        this.styleInit()
      }
    }
</script>

<style scoped>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .file_m{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    /*padding: 1em;*/
    /*max-width: 600px;*/
    /*overflow-y: auto;*/
  }

  .el-upload-list::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .el-upload-list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .el-upload-list::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }


  /*----*/
  /*滚动条样式*/
  .tree_box::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .tree_box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .tree_box::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }

  .fileList{
    background-color: #cc85d9;
    width: 100%;
    /*position: absolute;*/
    top: 30px;
    bottom: 0px;
    left: 0px;
  }
  .operation{
    border: 1px;
  }

  /*树样式*/
  .slot-tree .slot-t-top{
    margin-bottom: 15px;
  }
  .slot-tree .slot-t-node span{
    display: inline-block;
    font-size: 18px;
  }
  /*节点*/
  .slot-tree .slot-t-node--label{
    font-weight: 600;
  }
  /*输入框*/
  .slot-tree .slot-t-input .el-input__inner{
    height: 26px;
    line-height: 26px;
  }
  /*按钮列表*/
  .slot-tree .slot-t-node .slot-t-icons{
    display: none;
    margin-left: 10px;
  }
  .slot-tree .slot-t-icons .el-button+.el-button{
    margin-left: 6px;
  }
  .slot-tree .el-tree-node__content:hover .slot-t-icons{
    display: inline-block;
  }

  /*文件上传样式*/
  .tool-bar{
    height: 25px
  }
  .file-list{
    width: 100%;
    min-height: 100px;
    max-height: 300px;
    overflow: auto
  }

  /*图片预览样式*/
  .images{
    width: 100%;
    height: 650px;
  }

  form {
    width:80%;
    margin:auto;
    padding:20px 50px;
    border:1px solid #0091f2;
    border-radius:10px;
    display:block;
  }
  input {
    font-size:24px;
    margin:10px;
  }
  .clear {
    clear:both;
  }
  .speed_box {
    width:600px;
    height:20px;
    display:none;
    border:1px solid #0091f2;
    border-radius:10px;
    overflow:hidden;
  }
  #file_box {
    min-width:600px;
    min-height:300px;
    border:1px solid #0091f2;
    border-radius:10px;
    display:inline-block;
    background:#EEE;
    overflow:hidden;
    z-index:999999;
  }
  #speed {
    width:0;
    height:100%;
    background:#0091f2;
    color:white;
    text-align:center;
    line-height:20px;
    font-size:16px;
  }
  #file_size,#file_type {
    display:inline-block;
    padding:0px 16px;
    font-size:16px;
    color:#0091f2;
    font-weight:bold;
  }
  #file_type {
    margin-top:30px;
  }
  .opts_btn {
    position:relative;
    display:inline-block;
    padding:8px 16px;
    font-size:16px;
    color:white;
    text-decoration:none;
    background:#0091f2;
    border:2px solid #0091f2;
    border-radius:3px;
    cursor:pointer;
    overflow:hidden;
  }
  .oFile {
    position:absolute;
    width:100%;
    height:100%;
    z-index:10;
    top:0px;
    left:0px;
    opacity:0;
  }
  .send_btn {
    display:inline-block;
    display:none;
    float:right;
    margin-top:20px;
    padding:8px 16px;
    font-size:16px;
    color:white;
    background:#0091f2;
    border:1px solid transparent;
    border-radius:2px;
    cursor:pointer;
  }
</style>
