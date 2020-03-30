<template>
  <div class="navbar" :style="{'background':themeColor}">
    <span class="right-menu" >
      <el-menu class="el-menu-demo" mode="horizontal" :background-color="themeColor" :active-text-color="themeColor">
        <el-menu-item index="3" v-popover:popover-message>
          <!-- 我的私信 -->
          <el-badge :value="messageData.length" :max="99" class="badge">
            <i class="el-icon-message-solid" style="color:#fff;"></i>
          </el-badge>
          <el-popover ref="popover-message" placement="bottom-end" trigger="click">
            <message-panel :data.sync="messageData"></message-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4" v-popover:popover-notice>
          <!-- 系统通知 -->
          <el-badge :value="noticeData.length" :max="99" class="badge">
            <i class="el-icon-message" style="color:#fff;"></i>
          </el-badge>
          <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
            <notice-panel :data.sync="noticeData"></notice-panel>
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
    </span>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
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
        userInfo:{},
        messageNumbers:0,
        messageData:[
          {
            key: "1",
            avatar:'@/assets/user.png',
            content:'你修改了用户密码',
            sender:'张三1',
            time:'5分钟前'
          },
          {
            key: "2",
            avatar:'@/assets/user.png',
            content:'你修改了用户头像',
            sender:'张三2',
            time:'2小时前'
          },
          {
            key: "3",
            avatar:'@/assets/user.png',
            content:'今日25名新成员加入',
            sender:'李四1',
            time:'昨天'
          },
          {
            key: "4",
            avatar:'@/assets/user.png',
            content:'您发表了一篇新随笔',
            sender:'李四2',
            time:'昨天'
          },
          {
            key: "5",
            avatar:'@/assets/user.png',
            content:'您发表了一篇新随笔',
            sender:'王五1',
            time:'前天'
          }],
        noticeData:[
          {
            key: "1",
            icon:'fa fa-envelope-o',
            content:'你修改了用户密码'
          },
          {
            key: "2",
            icon:'fa fa-music',
            content:'你修改了用户头像'
          },
          {
            key: "3",
            icon:'fa fa-edit',
            content:'今日25名新成员加入'
          },
          {
            key: "4",
            icon:'fa fa-edit',
            content:'您发表了一篇新随笔'
          }]
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
    },
    computed:{
      ...mapState({
        themeColor: state=>state.settings.themeColor
      })
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
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
