<template>
  <elFrame :src="serverApi" />
</template>

<script>
  import { mapGetters } from 'vuex'
  import elFrame from '@/components/Iframe/index'
    export default {
        name: "server",
      components: { elFrame },
      computed: {
        ...mapGetters([
          'serverApi'
        ])
      }
    }
</script>

<style scoped>

</style>
