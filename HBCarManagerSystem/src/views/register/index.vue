<template>
  <div class="location_frame">
    <div class="main_frame">
      <div id="register" >
        <el-form :model="registerForm" ref="registerForm" label-position="right" label-width="80px" :rules="rules">

          <el-form-item>
            <span style="color:white;font-family:楷体;font-size:26px;">用&nbsp;户&nbsp;注&nbsp;册</span>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <el-form-item label="用户名"  prop="userName">
                <el-input type="text" v-model="registerForm.userName" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input type="text" v-model="registerForm.realName" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码确认" prop="checkPassword">
                <el-input type="password" v-model="registerForm.checkPassword" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item >
            <el-col :span="12">
              <el-form-item label="手机号" prop="mobilephone" >
                <el-input type="text" v-model="registerForm.mobilephone" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input type="text" v-model="registerForm.email" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <el-form-item label="部门名称" prop="departmentname">
                <el-input type="text" v-model="registerForm.departmentname" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务" prop="post">
                <el-input type="text" v-model="registerForm.post" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="registerForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司" prop="company">
                <el-select v-model="registerForm.company" >
                  <el-option label="合加新能源汽车有限公司" value="合加新能源汽车有限公司"></el-option>
                  <el-option label="其他公司" value="其他公司"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span = "12">
            <el-form-item label="验证码" prop="captcha">
              <el-input type = "test" v-model="registerForm.captcha" auto-complete="off" placeholder="验证码，单击图片刷新" style="width:100%;margin-right:12px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label=" ">
              <div class="verify-box" @click="refreshCaptcha" style="width:120px;">
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
            </el-form-item>
          </el-col>
         </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading = "loading" @click="onSubmit">注册</el-button>
            <el-button type="primary" @click="onLogin">重新登录</el-button>
          </el-form-item>
        </el-form>
        <p style="font-size:12px;color:red;">为了确保您的注册信息通过审核，请提供您的真实个人信息</p>
      </div>
      <div class="info">
        <a href="https://www.crrcgc.cc/" target="_blank">中国中车</a>&nbsp;&nbsp;<a href="http://www.evcrrc.com/" target="_blank">中车时代电动汽车有限公司</a><br>
        <div class="left"><span style="font-weight: bolder">装备制造：</span><a href="http://www.inforeenviro.com/" target="_blank">盈峰环境</a>&nbsp;&nbsp;<a href="http://www.ythuanwei.com/products/" target="_blank">宇通环卫</a>&nbsp;&nbsp;
          <a href="http://www.xcmg.com/xghj/" target="_blank">徐工环境</a>&nbsp;&nbsp;<a href="http://www.fjlm.c om.cn/" target="_blank">福龙马</a>&nbsp;&nbsp;<a href="http://www.hdclean.com/" target="_blank">海德汽车</a>
          <a href="http://www.krtzc.com.cn/index.html" target="_blank">凯瑞特种车</a>&nbsp;&nbsp;<a href="https://zyc.wuzheng.com.cn/?categoryCode=qxcp" target="_blank">五征环保</a>&nbsp;&nbsp;
          <a href="http://www.senyuanhi.com/productMechanies/24/" target="_blank">森源重工</a>&nbsp;&nbsp;<a href="http://www.hbxgzz.com/?bd_vid=10078331111149122661" target="_blank">楚胜汽车</a>&nbsp;&nbsp;
          <a href="http://www.qdcimctrailer.com/" target="_blank">青岛中集</a>&nbsp;&nbsp;<a href="http://www.hbydcl.com/product.asp">河北远达</a>&nbsp;&nbsp;
          <a href="http://www.fotonbrock.com/" target="_blank">福田普罗科</a>&nbsp;&nbsp;<a href="http://www.aerosun.cn/n3379707/n3379731/index.html" target="_blank">航天晨光</a>
          <a href="http://www.zhongtongauto.com/product/5/" target="_blank">中通集团</a>&nbsp;&nbsp;<a href="http://www.wctzc.com/" target="_blank">潍柴特种车</a>&nbsp;&nbsp;
          <a href="http://www.hishan.com.cn/" target="_blank">海山机械</a>&nbsp;&nbsp;<a href="http://www.saodiche.com.cn/index.asp" target="_blank">南通明诺</a>&nbsp;&nbsp;
          <a href="http://njhbddc.isitestar.cn/" target="_blank">南京皇保</a>&nbsp;&nbsp;<a href="https://www.hjxnyqc.com.cn/" target="_blank">合加新能源汽车</a>&nbsp;&nbsp;
          <a href="http://www.hako.cn/" target="_blank">德国哈高</a>&nbsp;&nbsp;<a href="https://www.johnstonsweepers.com/" target="_blank">英国庄士顿</a>&nbsp;&nbsp;
          <a href="https://www.johnstonsweepers.com/" target="_blank">意大利道路宝</a>&nbsp;&nbsp;<a href="http://www.faun.com.cn/cn/about.html" target="_blank">法恩中国</a>&nbsp;&nbsp;
          <a href="https://www.chukyo-juki.co.jp/list/list.php?paged=1&category=specialized" target="_blank">日本中京重机</a>&nbsp;&nbsp;
          <a href="http://www.ceksanmakina.com/EN/index.php" target="_blank">土耳其CEKSAN</a>&nbsp;&nbsp;
        </div>
        <div class="left"><span style="font-weight: bolder">零部件：</span><a href="http://www.dfcv.com.cn/Index.aspx" target="_blank">东风商用车</a>&nbsp;&nbsp;
          <a href="http://www.fawjiefang.com.cn/" target="_blank">一汽解放</a>&nbsp;&nbsp;<a href="http;//139.196.137.160/" target="_blank">一汽凌源</a>&nbsp;&nbsp;
          <a href="http://lighttruck.jmc.com.cn/" target="_blank">江铃汽车</a><a href="http://www.qingling.com.cn/" target="_blank">庆铃汽车</a>
          <a href="http://www.dcec.com.cn/" target="_blank">东风康明斯</a>&nbsp;&nbsp;<a href="https://www.catlbattery.com/" target="_blank">宁德时代</a>&nbsp;&nbsp;<a href="http://www.vortexinfo.cn/h-col-282.html" target="_blank">伏泰科技</a>
          <a href="http://www.jiachengtech.com/" target="_blank">嘉成科技</a>&nbsp;&nbsp;<a href="http://www.csshuobo.com/" target="_blank">硕博电子</a>
        </div>
        <div class="left"><span style="font-weight: bolder">环卫运营：</span>
          <a href="http://www.besg.com.cn/approach/index.html" target="_blank">北京环卫</a>&nbsp;&nbsp;
          <a href="http://www.tus-est.com/" target="_blank">启迪环境</a>&nbsp;&nbsp;
          <a href="http://www.rrjqj.com/intro/1.html">仁仁洁</a>
        </div>
        <div class="left"><span style="font-weight: bolder">行业新闻:</span>
          <a href="http://www.chinacar.com.cn/search.html" target="_blank">汽车公告网</a>&nbsp;&nbsp;
          <a href="http://www.cn-hw.net/" target="_blank">环卫科技</a>&nbsp;&nbsp;
          <a href="http://www.hunanhw.com/" target="_blank">湖南环卫</a>
          <a href="http://www.cncma.org/" target="_blank">机械工业协会</a>
        </div>
      </div>
    </div>
    <div  v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>
    import router from "@/router/routers";
    import request from '@/utils/request'
    import SIdentify from '../../components/identify'
    import { register } from '@/api/login'
    export default {
        name: "index",
      components: {
        SIdentify
      },
       data(){
         let validateCaptcha = (rule, value, callback) => {
           if (value.length === 0) {
             callback(new Error('请输入验证码'))
           } else if (value != this.identifyCode) {
             callback(new Error('验证码错误或失效，重新刷新'))
           } else {
             callback()
           }

         }
         let validatePassword = (rule, value, callback) => {
           const reg = /^\S{6,20}$/g
           if (value.length === 0) {
             callback(new Error('请输入密码'))
           } else if(!reg.test(value)) {
             callback(new Error('请输入6-20个非空字符'))
           }else {
             if (this.registerForm.checkPassword.length !== 0) {
               this.$refs.registerForm.validateField('checkPassword')
             }
               callback()

           }
       }
         let validateCheckPassword = (rule, value, callback) => {
           if (value.length === 0) {
             callback(new Error('请再次输入密码'))
           } else if (value !== this.registerForm.password) {
             callback(new Error('两次输入密码不一致！'))
           } else {
             callback()
           }
         }
         let validateUserName = (rule, value, callback) => {
           const reg = /^[a-zA-Z][a-zA-Z0-9_-]{4,16}$/
           if (value.length === 0) {
             callback(new Error('请输入用户名'))
           } else if (!reg.test(value)) {
             callback(new Error('请由字母数字下划线减号自由组合'))
           } else {
             callback()
           }
         }
        let validateMobilephone = (rule, value, callback) => {
           const reg = /^[1][3,4,5,7,8][0-9]{9}$/
           if (value.length === 0) {
             callback(new Error('请输入手机号码'))
           } else if (!reg.test(value)) {
             callback(new Error('您输入的手机号码格式有误'))
           } else {
             callback()
           }
         }
         let validateEmail = (rule, value, callback) => {
           const reg = /^(\w+\.?)*[A-Za-z0-9_-]+@(\w+\.)\w+$/      // /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
           if (value.length === 0) {
             callback(new Error('请输入您的电子邮箱'))
           } else if (!reg.test(value)) {
             callback(new Error('您输入的电子邮箱格式有误'))
           } else {
             callback()
           }
         }
          return {
            registerForm:{
              userName:'',//用户名
              password:'',//密码
              checkPassword:'',
              realName:'',//真实姓名
              sex:'男',//性别
              company:'合加新能源汽车有限公司',//公司名称
              departmentname:'',//部门名称
              post:'',//职务
              email:'',//电子邮箱
              mobilephone:'',//手机
              captcha:''

            },
            loading: false,//加载界面
            notifies: [],
            identifyCodes: '1234567890',
            identifyCode: '',//图片验证码
            rules: {
              userName: [
                {
                  required: true,
                  trigger: 'blur',
                  validator:validateUserName
                }
              ],
             realName: [
                {
                  required: true,
                  message: '请输入您的真实姓名',
                  trigger: 'blur'
                },
                {
                  min: 2,
                  max: 10,
                  message: '长度在2到10个字符',
                  trigger:'blur'
                }
              ],
              mobilephone: [
                {
                  required: true,
                  trigger: 'blur',
                  validator:validateMobilephone
                }
              ],
             email: [
                {
                  required: true,
                  trigger: 'blur',
                  validator: validateEmail
                }
              ],
              departmentname: [
                {
                  required: true,
                  message: '请输入您所在部门',
                  trigger: 'blur'
                },
                {
                  min: 3,
                  max: 20,
                  message: '长度在3到20个字符',
                  trigger:'blur'
                }
              ],
              post: [
                {
                  required: true,
                  message: '请输入您的职务',
                  trigger: 'blur'
                },
                {
                  min: 2,
                  max: 20,
                  message: '长度在2到20个字符',
                  trigger:'blur'
                }
              ],
              captcha: [{
                required: true,
                trigger: 'blur',
                validator: validateCaptcha
              }],
              password:[{
                required:true,
                trigger:'blur',
                validator:validatePassword
              }],
              checkPassword:[{
                required:true,
                trigger:'blur',
                validator:validateCheckPassword
              }],
            },
            //框架样式
            mainFrameStyle:{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              width: "1280px",
              height: "800px",
              background:  "url(" + require("../../assets/index_background-9.jpg") + ")",
              backgroundSize: "cover",
              border: "2px solid #ccc"
            }

          }
      },
      methods:{
          onSubmit(){
            window.console.log("注册提交中。。。。")

            this.$refs.registerForm.validate( valid =>{

              if(valid){
                window.console.log("注册信息有效性验证成功")
                this.loading=true
                let userInfo = {
                  name:this.registerForm.userName, //用户名
                  password:this.registerForm.password,//密码
                  realName:this.registerForm.realName,//真实姓名
                  //sex:this.registerForm.sex,//性别,暂未存储到后台数据库
                  //company:this.registerForm.company,//公司名称
                  //deptName:this.registerForm.departmentname,//部门名称
                  job:this.registerForm.company+'/'+this.registerForm.departmentname+'/'+this.registerForm.post,//职务
                  email:this.registerForm.email,//电子邮箱
                  mobile:this.registerForm.mobilephone,//手机
                }
                register(userInfo).then(response =>{
                  this.loading = false
                  const data = response
                  console.log(data)
                  if(data.msg === 'ok') {
                    this.$notify({
                      title: '注册提示',
                      message: "注册成功，请耐心等待审核",
                      position: 'bottom-right',
                      type: 'success',
                      duration:3000
                    })
                  }else{
                    this.$notify({
                      title: '注册提示',
                      message: data.msg,
                      position: 'bottom-right',
                      type: 'error',
                      duration:3000
                    })
                  }
                }).catch(error =>{
                  this.loading = false
                  this.$notify({
                    title:'注册提示',
                    message:error.message,
                    position:'bottom-right',
                    type:'error'
                  })
                })
              }
            })
          },
          onLogin(){
            router.push('/login')
          },
        randomNum(min, max) {
          return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCaptcha() {
          //this.loginForm.src = "http://localhost:8080/eshop" + "/captcha.jpg?t=" + new Date().getTime();
          this.identifyCode = "";
          this.makeCode(this.identifyCodes, 4);
          this.$refs.registerForm.validateField('captcha');
          console.log('当前验证码==', this.identifyCode);

          //由于刷新后如果输入框已有数据，这个时候是不会进行有效性检查的，所以要将鼠标聚焦到验证码输入框
        },
        makeCode(o, l) {
          for (let i = 0; i < l; i++) {
            this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
          }
        }
      },
      mounted() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      }
    }
</script>

<style  lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";
  .location_frame {
    min-height: calc(100vh - 50px);
    width: 100%;
    text-align: center;
  }
  .main_frame{
    position:relative;
    width: 1280px;
    height: 800px;
    margin-left:auto;
    margin-right:auto;
    background: url('../../assets/index_background-10.jpg') no-repeat center/cover;
  }
  #register {
    margin:10px auto;
    padding-right: 40px;
    text-align:center;
    background: rgba(0, 0, 0, 0.7);
    width:650px;
    height:550px;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border:1px solid white;
  }
  #el-main-footer {
    background: none repeat scroll 0 0 white;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    padding: 10px 6px 0 6px;
    height: 33px;
    font-size: 0.7rem !important;
    color: #7a8b9a;
    letter-spacing: 0.8px;
    font-family: Arial, sans-serif !important;
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
  }
  .info{
    position:absolute;
    left:0px;
    top:570px;
  }
  .left{
    text-align: left;
    margin: 0px 20px;
  }
  a{
    text-decoration: underline;
    color:$--color-primary
  }
</style>
