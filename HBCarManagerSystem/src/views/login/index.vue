<template>
    <div class="box">
      <div id="login" style="width:320px;height:300px;text-align:center;">
        <el-form :model="loginForm" ref="loginForm" :rules="rules">
          <el-form-item>
            <span style="color:white;font-family:楷体;font-size:26px;">用&nbsp;户&nbsp;登&nbsp;录</span>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input type="text" v-model="loginForm.userName" placeholder="用户名">
              <template slot="prepend"><i class="el-icon-user" style="font-size:200px;color:white;"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="text" v-model="loginForm.password" placeholder="密码" show-password>
              <template slot="prepend"><i class="el-icon-lock" style="font-size:20px;color:white;"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" :loading="loading" style="font-size:20px;font-family:微软雅黑;width:320px;" @click="clickLogin">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>

  import request from '@/utils/request'
    export default {
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
          } else if (value.length < 6) {
            callback(new Error('密码不能小于3位'))
          } else {
            callback()
          }
        }
        return {
          loginForm: {
            userName: '',
            password: '',
          },
          loading: false,
          notifies:[],
          rules: {
            userName: [{
              required: true,
              trigger: 'blur',
              validator: validateUserName
            }],
            password:[{
              required:true,
              trigger:'blur',
              validator:validatePasssword
            }]
          }

        }

      },
      methods: {
        clickLogin() {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              setTimeout(() => {
                this.$store.dispatch('login', this.loginForm).then(
                  res => {
                    if (res.info.code === '0') {
                      this.clearNotifies()
                      this.$router.push('/')
                    } else {
                      this.$notify({
                        title: '登录提示',
                        message: '用户名或密码错误',
                        position: 'bottom-right',
                        type: 'error'
                      })
                      this.loading = false
                    }
                  }).catch(error =>{
                    this.loading = false
                    this.$notify({
                      title:'登录提示',
                      message:error.message,
                      position:'center',
                      type:'error'
                    })
                })

              }, 2000)
            }else{
              return false
            }
          })
        },
        clearNotifies: function () {
          this.notifies.forEach(notify => {
            notify.close()
          })
        }
      }
    }
</script>

<style scoped>

</style>
