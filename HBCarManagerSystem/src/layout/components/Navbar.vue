<template>
  <div class="navbar">
    <div class="right-menu">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="3" v-popover:popover-message>
          <!-- 我的私信 -->
          <el-badge :value="5" :max="99" class="badge">
            <li style="color:#fff;" class="fa fa-envelope-o fa-lg"></li>
          </el-badge>
          <el-popover ref="popover-message" placement="bottom-end" trigger="click">
            <message-panel></message-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4" v-popover:popover-notice>
          <!-- 系统通知 -->
          <el-badge :value="4" :max="99" class="badge">
            <li style="color:#fff;" class="fa fa-bell-o fa-lg"></li>
          </el-badge>
          <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
            <notice-panel></notice-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="userInfo.avatar" />{{userInfo.realName}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="userInfo"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import NoticePanel from "@/views/core/NoticePanel"
  import MessagePanel from "@/views/core/MessagePanel"
  import PersonalPanel from "@/views/core/PersonalPanel"
  import {findByName} from "@/api/system/user";
  export default {
    components:{
      NoticePanel,
      MessagePanel,
      PersonalPanel
    },
    name: "Navbar",
    data(){
      return {
        userName:this.$store.getters.name,
        userInfo:{}
      }
    },
    mounted() {
      if (this.userName) {
        let params = {name:this.userName}
        findByName(params).then((res) => {
          if(res.code == 200) {
            this.userInfo = res.data
            this.userInfo.avatar = require("@/assets/user.png")
          }
        })
      }
    },
    methods:{
      async logout(){
        await this.$store.dispatch('logout')
        console.log("this.$route.fullPath"+this.$route.fullPath)
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;

    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      }
    .user-info {
        font-size: 20px;
        color: #fff;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    .badge {
        line-height: 18px;
      }
  }

</style>

<!--
<template>
<div class="navbar">
  <div class="right-menu">
    <div class="welcome">
    你好，{{ userName }}
    </div>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <i class="fa fa-address-card-o"/>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</div>
</template>

<script>
  //<i class="fa fa-address-card-o"/>
    export default {
        name: "Navbar",
      data(){
          return {
            userName:this.$store.getters.name
          }
      },
      methods:{
          async logout(){
            await this.$store.dispatch('logout')
            console.log(this.$route.fullPath)
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          }
      }
    }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

  &:hover {
     background: rgba(0, 0, 0, .025)
   }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;

  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .welcome{
      float:left;
      display:inline-block;
      line-height: 50px;
      height: 50px;
      text-align: center;
    }

  &:focus {
     outline: none;
   }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

  &.hover-effect {
     cursor: pointer;
     transition: background .3s;

  &:hover {
     background: rgba(0, 0, 0, .025)
   }
  }
  }

  .avatar-container {
    margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
  }
  }
  }
  }

</style>
-->
