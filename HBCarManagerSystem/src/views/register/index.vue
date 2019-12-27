<template>
    <div class="location_frame">
      <div class="main_frame" :style="mainFrameStyle">
        <div id="register" >
          <el-form :model="registerForm" ref="registerForm" label-position="right" label-width="100px" size='mini':rules="rules">
            <el-form-item>
              <span style="color:white;font-family:楷体;font-size:26px;">用&nbsp;户&nbsp;注&nbsp;册</span>
            </el-form-item>
            <el-form-item label="用户名"  prop="userName">
              <el-input type="text" v-model="registerForm.userName" >
              </el-input>
            </el-form-item>
            <el-form-item label="密码" >
              <el-input type="text" v-model="registerForm.password1" >
              </el-input>
            </el-form-item>
            <el-form-item label="再次确认密码" prop="password">
              <el-input type="text" v-model="registerForm.password" >
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
              <el-input type="text" v-model="registerForm.realName" >
              </el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobilephone">
              <el-input type="text" v-model="registerForm.mobilephone" >
              </el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input type="text" v-model="registerForm.email" >
              </el-input>
            </el-form-item>

            <el-form-item label="部门名称" prop="departmentname">
              <el-input type="text" v-model="registerForm.departmentname" >
              </el-input>
            </el-form-item>
            <el-form-item label="职务" prop="post">
              <el-input type="text" v-model="registerForm.post" >
              </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="registerForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公司" prop="company">
                <el-select v-model="registerForm.company" >
                  <el-option label="合加新能源汽车有限公司" value="合加新能源汽车有限公司"></el-option>
                  <el-option label="其他公司" value="其他公司"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSumbit">注册</el-button>
              <el-button type="primary" @click="onLogin">重新登录</el-button>
            </el-form-item>
          </el-form>
          <p style="font-size:12px;">为了确保您的注册信息通过审核，请提供您的真实个人信息</p>
        </div>
        <footer>
          <a href="http://www.tus-est.com/">启迪环境</a>&nbsp;&nbsp;<a href="https://www.hjxnyqc.com.cn/">合加新能源汽车</a><br>
          Copyright © 合加新能源汽车有限公司  京 ICP备 11111111号
        </footer>
      </div>
    </div>
</template>

<script>
    import router from "../../router";

    export default {
        name: "index",
       data(){
          return {
            registerForm:{
              userName:'',//用户名
              password:'',//密码
              password1:'',
              realName:'',//真实姓名
              sex:'男',//性别
              company:'',//公司名称
              departmentname:'',//部门名称
              post:'',//职务
              email:'',//电子邮箱
              mobilephone:'',//手机

            },
            //框架样式
            mainFrameStyle:{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              width: "1280px",
              height: "800px",
              background:  "url(" + require("../../assets/index_background-5.jpg") + ")",
              backgroundSize: "cover",
              border: "2px solid #ccc"
            }

          }
      },
      methods:{
          onSubmit(){
            console.log('submit')
          },
          onLogin(){
            router.push('/login')
          }
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
    text-align:center;
    width:320px;
    height:550px;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    /*border:1px solid white;*/
  }
  footer{
    margin-top:190px;
  }
</style>
