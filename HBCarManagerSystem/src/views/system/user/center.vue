<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <el-upload
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="headers"
                :action="updateAvatarApi"
                class="avatar-uploader"
              >
                <img :src="userInfo.avatar ? baseApi + '/avatar/' + userInfo.avatar : Avatar" title="点击上传头像" class="avatar">
              </el-upload>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><i class="fa-address-card"></i>登录账号<div class="user-right">{{ userInfo.username }}</div></div></li>
              <li><i class="fa-user"></i> 用户姓名 <div class="user-right">{{ userInfo.realName }}</div></li>
              <li><i class="fa-phone"></i> 手机号码 <div class="user-right">{{ userInfo.mobile }}</div></li>
              <li><i class="fa-envelope-o"></i> 用户邮箱 <div class="user-right">{{ userInfo.email }}</div></li>
              <li><i class="fa-cubes"></i><i class="fa-pencil"></i> 所属部门 <div class="user-right"> {{ userInfo.deptId }}</div></li>
              <li><svg-icon icon-class="dept" /> 信息修改
                <div class="user-right">
                  <a @click="$refs.userForm.dialogVisible = true">邮箱/手机</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="其他配置" name="first">
              <el-form ref="form" :model="form"  style="margin-top: 10px;" size="small" label-width="65px">
                <el-form-item label="其他">
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    操作日志    -->
            <el-tab-pane label="操作日志" name="second">
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <update-user  v-if="showDialog" ref="userForm" :email="userInfo.email" :mobile="userInfo.mobile" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UpdateUser from './center/UpdateUser'
  import store from '@/store'
  import { parseTime } from '@/utils/index'
  import {findByName} from '@/api/system/user'
  import Avatar from '@/assets/images/avatar.png'
  import { baseUrl } from '@/utils/global'
  export default {
    name: 'Center',
    components: {  UpdateUser },
    data() {
      return {
        baseApi:baseUrl,
        Avatar: Avatar,
        activeName: 'first',
        saveLoading: false,
        headers: {
          'Authorization': store.getters.token
        },
        userName:this.$store.getters.name,
        userInfo: {},
        form:{},
        showDialog:false,
      }
    },
    computed: {
      ...mapGetters([
        'updateAvatarApi'
      ])
    },
    mounted() {
      this.$nextTick( () => {
        if (this.userName) {
          let params = {name:this.userName}
          findByName(params).then((res) => {
            if(res.code == 200) {
              this.userInfo = res.data
              this.showDialog = true
            }
          })
        }
      })
    },
    methods: {
      parseTime,
      handleClick(tab, event) {
        if (tab.name === 'second') {
          this.init()
        }
      },
      beforeInit() {
        this.url = 'api/logs/user'
        return true
      },
      handleSuccess(response, file, fileList) {
        this.$notify({
          title: '头像修改成功',
          type: 'success',
          duration: 2500
        })
        store.dispatch('GetInfo').then(() => {})
      },
      // 监听上传失败
      handleError(e, file, fileList) {
        const msg = JSON.parse(e.message)
        this.$notify({
          title: msg.message,
          type: 'error',
          duration: 2500
        })
      },
      doSubmit() {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader-icon {
    font-size: 28px;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    border-radius: 50%
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
</style>
