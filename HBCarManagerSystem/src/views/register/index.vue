<template>
  <div class="location_frame">
    <div class="main_frame" :style="mainFrameStyle">
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
      <footer>
        <a href="http://www.tus-est.com/" target="_blank">启迪环境</a>&nbsp;&nbsp;<a href="https://www.hjxnyqc.com.cn/" target="_blank">合加新能源汽车</a><br>
        Copyright © 合加新能源汽车有限公司  京 ICP备 11111111号
      </footer>
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

<style scoped>
  .location_frame {
    margin-left:auto;
    margin-right:auto;
    margin-top:10px;
    width:1280px;
    height:800px;
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
    /*border:1px solid white;*/
  }
  footer{
    margin-top:190px;
  }
</style>
