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
      <div class="footer">
       <a href="http://www.tus-est.com/" target="_blank">启迪环境</a>&nbsp;&nbsp;<a href="https://www.hjxnyqc.com.cn/" target="_blank">合加新能源汽车</a><br>
        <div class="left">装备制造：<a href="http://www.inforeenviro.com/" target="_blank">盈峰环境</a>&nbsp;&nbsp;<a href="http://www.ythuanwei.com/products/" target="_blank">宇通环卫</a>&nbsp;&nbsp;
          <a href="http://www.xcmg.com/xghj/" target="_blank">徐工环境</a>&nbsp;&nbsp;<a href="http://www.fjlm.c om.cn/" target="_blank">福龙马</a>&nbsp;&nbsp;<a href="http://www.hdclean.com/" target="_blank">海德汽车</a>
          <a href="http://www.krtzc.com.cn/index.html" target="_blank">凯瑞特种车</a>&nbsp;&nbsp;<a href="https://zyc.wuzheng.com.cn/?categoryCode=qxcp" target="_blank">五征环保</a>&nbsp;&nbsp;
          <a href="http://www.senyuanhi.com/productMechanies/24/" target="_blank">森源重工</a>&nbsp;&nbsp;<a href="http://www.hbxgzz.com/?bd_vid=10078331111149122661" target="_blank">楚胜汽车</a>&nbsp;&nbsp;
          <a href="http://www.qdcimctrailer.com/" target="_blank">青岛中集</a>&nbsp;&nbsp;<a href="http://www.hbydcl.com/product.asp">河北远达</a>&nbsp;&nbsp;
          <a href="http://www.fotonbrock.com/" target="_blank">福田普罗科</a>&nbsp;&nbsp;<a href="http://www.aerosun.cn/n3379707/n3379731/index.html" target="_blank">航天晨光</a>
          <a href="http://www.zhongtongauto.com/product/5/" target="_blank">中通集团</a>&nbsp;&nbsp;<a href="http://www.wctzc.com/" target="_blank">潍柴特种车</a>&nbsp;&nbsp;
          <a href="http://www.hishan.com.cn/" target="_blank">海山机械</a>&nbsp;&nbsp;<a href="http://www.saodiche.com.cn/index.asp" target="_blank">南通明诺</a>&nbsp;&nbsp;
          <a href="http://njhbddc.isitestar.cn/" target="_blank">南京皇保</a>&nbsp;&nbsp;
          <a href="http://www.hako.cn/" target="_blank">德国哈高</a>&nbsp;&nbsp;<a href="https://www.johnstonsweepers.com/" target="_blank">英国庄士顿</a>&nbsp;&nbsp;
          <a href="https://www.johnstonsweepers.com/" target="_blank">意大利道路宝</a>&nbsp;&nbsp;<a href="http://www.faun.com.cn/cn/about.html" target="_blank">法恩中国</a>&nbsp;&nbsp;
          <a href="https://www.chukyo-juki.co.jp/list/list.php?paged=1&category=specialized" target="_blank">日本中京重机</a>&nbsp;&nbsp;
          <a href="http://www.ceksanmakina.com/EN/index.php" target="_blank">土耳其CEKSAN</a>&nbsp;&nbsp;
        </div>
        <div class="left">零部件：<a href="http://www.dfcv.com.cn/Index.aspx" target="_blank">东风商用车</a>&nbsp;&nbsp;
          <a href="http://www.fawjiefang.com.cn/" target="_blank">一汽解放</a>&nbsp;&nbsp;<a href="http;//139.196.137.160/" target="_blank">一汽凌源</a>&nbsp;&nbsp;
          <a href="http://lighttruck.jmc.com.cn/" target="_blank">江铃汽车</a><a href="http://www.qingling.com.cn/" target="_blank">庆铃汽车</a>
          <a href="http://www.dcec.com.cn/" target="_blank">东风康明斯</a>&nbsp;&nbsp;<a href="https://www.catlbattery.com/" target="_blank">宁德时代</a>&nbsp;&nbsp;<a href="http://www.vortexinfo.cn/h-col-282.html" target="_blank">伏泰科技</a>
          <a href="http://www.jiachengtech.com/" target="_blank">嘉成科技</a>&nbsp;&nbsp;<a href="http://www.csshuobo.com/" target="_blank">硕博电子</a>
        </div>
        <div class="left">环卫运营：
          <a href="http://www.besg.com.cn/approach/index.html" target="_blank">北京环卫</a>&nbsp;&nbsp;
          <a href="http://www.rrjqj.com/intro/1.html">仁仁洁</a>
        </div>
        <div class="left">行业新闻:
          <a href="http://www.chinacar.com.cn/search.html" target="_blank">汽车公告网</a>&nbsp;&nbsp;
          <a href="http://www.cn-hw.net/" target="_blank">环卫科技</a>&nbsp;&nbsp;
          <a href="http://www.hunanhw.com/" target="_blank">湖南环卫</a>
        </div>
        <span style="font-size:10px;">Copyright © 合加新能源汽车有限公司  京 ICP备 11111111号</span>
      </div>
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
          } else if (value.length < 3) {
            callback(new Error('密码不能小于3位'))
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
          border: "2px solid #ccc",
            //position:"relative"
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
    border:1px solid red;
  }
  #login {
    margin-top:50px;
    margin-left:800px;
    text-align:center;
    width:320px;
    height:300px;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    /*border:1px solid red;*/
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
  .footer{
    float:bottom;
    margin-top:-100px;
  }
  .left{
      text-align: left;
      margin: 0px 20px;
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
