<template>
  <div>
    <h2>保养管理界面</h2>
    <scope-demo :posts="posts">
      <template  slot-scope="slotProps">
        <h2 >
          <span v-if="slotProps.data.isTrue">√</span>
          {{ slotProps.data.summary}}</h2>
      </template>
     <!-- <img slot="imgtest" :src="post.img"></img>-->
      <img :src="require('@/assets/truck.png')" slot="test">

    </scope-demo>
    <h2>{{ count }}</h2>
    <h2>{{ strJob }}</h2>
  </div>
</template>

<script>
  import ScopeDemo from "@/components/test/ScopeDemo";
  export default {
    name: "upkeep_manager",
    components: {ScopeDemo},
    data() {
      return {
        posts:[
          {
            title:'标题1',
            summary:'晚上吃鳊鱼',
            image:require('@/assets/truck.png'),
            isTrue:true
          },
          {
            title:'标题2',
            summary:'晚上打麻将',
            image:require('@/assets/user.png'),
            isTrue:true
          }
        ],
        a:'943/6lkjf0/92u3lk/5hy90',
        b:'/',
        count:0,
        strJob:'',
      }
    },
    created(){
      const str = "合加汽车/研究院/电气工程师";
      const c = "/"; // 要计算的字符
      const regex = new RegExp(c, 'g'); // 使用版g表示整个字符串都要匹配
      const result = str.match(regex);
      this.count = !result ? 0 : result.length;
      let arrayJob
      if(str.length !== 0){
        arrayJob = str.split('/')
      }
      if( arrayJob.length ===3){
        this.strJob =arrayJob[2]
      }
    }
  }
</script>

<style scoped>

</style>
