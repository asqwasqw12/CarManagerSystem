<template>
  <div>
    <file-manager :settings="settings"></file-manager>
  </div>
</template>

<script>
  //import '@/assets/styles/all.css'
 //import '@/assets/styles/bootstrap.min.css'
  import { mapGetters } from 'vuex'
  import Cookies from "js-cookie";
    export default {
        name: "ProjectList",
      data(){
          return {
            settings: {
              // axios headers
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                token: Cookies.get('token'),
              },
              baseUrl:this.updateFileApi,   // overwrite base url Axios
              windowsConfig: 2,                           // overwrite config
              },
          }
      },
      computed: {
        ...mapGetters([
          'updateFileApi'
        ])
      },
    }
</script>

<style scoped src="../../assets/styles/bootstrap.min.css">

</style>
