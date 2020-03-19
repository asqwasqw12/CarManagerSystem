<template>
  <div class="location_frame">
    <div class="main_frame" :style="mainFrameStyle">
      <div id="login" >
        <el-form :model="loginForm" ref="loginForm" :rules="rules">
          <el-form-item>
            <span style="color:white;font-family:楷体;font-size:26px;">用&nbsp;户&nbsp;登&nbsp;录</span>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input type="text" v-model="loginForm.userName" placeholder="用户名">
              <template slot="prepend"><i class="el-icon-user" style="font-size:20px;color:white;"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="text" v-model="loginForm.password" placeholder="密码" show-password>
              <template slot="prepend"><i class="el-icon-lock" style="font-size:20px;color:white;"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span = "13">
              <el-form-item prop="captcha">
                <el-input type = "test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码，单击图片刷新" style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2" sytle="margin-right:0px;">
              <el-form-item>
                <div class="verify-box" @click="refreshCaptcha">
                  <s-identify :identifyCode="identifyCode"></s-identify>
                </div>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" :loading="loading" style="font-size:20px;font-family:微软雅黑;width:320px;" @click="clickLogin">登 录</el-button>
          </el-form-item>
            <span style="display:inline-block;line-height:20px;">没有账号？马上<router-link to="register"><el-link type="primary">注册</el-link></router-link>
            </span>

        </el-form>

      </div>
      <div class="truck" :style="truckStyle" ></div>
      <footer>
       <a href="http://www.tus-est.com/">启迪环境</a>&nbsp;&nbsp;<a href="https://www.hjxnyqc.com.cn/">合加新能源汽车</a><br>
        Copyright © 合加新能源汽车有限公司  京 ICP备 11111111号
      </footer>
    </div>
  </div>
</template>

<script>

  import request from '@/utils/request'
  import SIdentify from '../../components/identify'
    export default {
    components:{
      SIdentify
    },
      data() {
        let validateUserName = (rule, value, callback) => {
          if (value.length === 0) {
            return callback(new Error('请输入用户名'))
          } else {
            callback()
          }
        }
        let validatePassword = (rule, value, callback) => {
          if (value.length === 0) {
            callback(new Error('请输入密码'))
          } else if (value.length < 5) {
            callback(new Error('密码不能小于5位'))
          } else {
            callback()
          }
        }
        let validateCaptcha = (rule, value, callback) => {
          if (value.length === 0) {
            callback(new Error('请输入验证码'))
          } else if (value != this.identifyCode ) {
            callback(new Error('验证码错误'))
          } else {
            callback()
          }
        }
        return {
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
          },
          //车辆动画样式
          truckStyle:{
           // position:"relative",
           // width:"200px",
           // height:"80px",
            background:"url(" + require("../../assets/truck.png") + ")",
           // marginTop:"180px",
           // marginBottom:"120px",
            //animation:"ball 10s linear infinite"
          },
          //登录框对象
          loginForm: {
            userName: '',
            password: '',
            captcha:'',   //用户输入验证码
            //src:''        //验证码图片源

          },
          //加载界面
          loading: false,
          notifies:[],
          identifyCodes:'1234567890',
          identifyCode:'',//图片验证码
          //captcha:'',   //用户输入验证码
          //输入规则
          rules: {
            userName: [{
              required: true,
              trigger: 'blur',
              validator: validateUserName
            }],
            password:[{
              required:true,
              trigger:'blur',
              validator:validatePassword
            }],
            captcha:[{
              required:true,
              trigger:'blur',
              validator:validateCaptcha
            }],

          }

        }

      },
      methods: {
        clickLogin() {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              let userInfo = {
                account:this.loginForm.userName,
                password:this.loginForm.password,
              //captcha: this.loginForm.captcha
                }
              setTimeout(() => {
                this.$store.dispatch('login', userInfo).then(
                  res => {
                    if (res.msg === 'ok' )  {
                      this.clearNotifies()
                      this.$router.push('/')
                    }
                    this.loading = false
                  }).catch(error =>{
                    this.loading = false
                    this.$notify({
                      title:'登录提示',
                      message:error,
                      position:'center',
                      type:'error'
                    })
                })
              }, 5000)
            }else{
              return false
            }
          })
        },
        clearNotifies: function () {
          this.notifies.forEach(notify => {
            notify.close()
          })
        },
        randomNum(min,max){
          return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCaptcha(){
          //this.loginForm.src = "http://localhost:8080/eshop" + "/captcha.jpg?t=" + new Date().getTime();
          this.identifyCode = "";
          this.makeCode(this.identifyCodes,4);
          this.$refs.loginForm.validateField('captcha');
          console.log('当前验证码==',this.identifyCode);
        },
        makeCode(o,l){
          for (let i = 0;i<l; i++){
            this.identifyCode += this.identifyCodes[this.randomNum(0,this.identifyCodes.length)]
          }

        }
      },
      mounted() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes,4);
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
  #login {
    margin-top:50px;
    margin-left:800px;
    text-align:center;
    width:320px;
    height:300px;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    /*border:1px solid white;*/
  }
  .verify-box{
    margin-right: 0px;
    padding-right: 0px;
    width:120px;
    height: 38px;
  }
  .truck{
    position:relative;
    width:200px;
    height:80px;
    /*background:url("../../assets/truck.png") ;*/
    margin-top:120px;
    margin-bottom:200px;
    animation:ball 10s linear infinite;
  }
  @keyframes ball{
    0%{transform:translate(1080px);}
    /* 20%{transform:translate(1080px);}
      40%{transform:translate(680px);}
      60%{transform:translate(480px);}
      80%{transform:translate(280px);} */
    100%{transform:translate(0px);}
  }
  footer{
    margin-top:20px;
  }
  body{
    background-color: #282828;
    background-image: -webkit-radial-gradient(black 15%, transparent 16%), -webkit-radial-gradient(black 15%, transparent 16%), -webkit-radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%), -webkit-radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%);
    background-image: radial-gradient(black 15%, transparent 16%), radial-gradient(black 15%, transparent 16%), radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%), radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%);
    background-position: 0 0px, 8px 8px, 0 1px, 8px 9px;
    background-size: 16px 16px;
    text-aglin:center;
    height:1200px;
  }
</style>
<style>
  /*body{
    background-color: #282828;
    background-image: -webkit-radial-gradient(black 15%, transparent 16%), -webkit-radial-gradient(black 15%, transparent 16%), -webkit-radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%), -webkit-radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%);
    background-image: radial-gradient(black 15%, transparent 16%), radial-gradient(black 15%, transparent 16%), radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%), radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%);
    background-position: 0 0px, 8px 8px, 0 1px, 8px 9px;
    background-size: 16px 16px;
    text-aglin:center;
    height:1200px;
  }*/
</style>
