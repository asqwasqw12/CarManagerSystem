<template>
  <elFrame :src="swaggerApi" />
</template>

<script>
  import { mapGetters } from 'vuex'
  import elFrame from '@/components/Iframe/index'
    export default {
        name: "swagger",
      components: { elFrame },
      computed: {
        ...mapGetters([
          'swaggerApi'
        ])
      }
    }
</script>

<style scoped>

</style>
