<template>
  <elFrame :src="sqlApi" />
</template>

<script>
  import { mapGetters } from 'vuex'
  import elFrame from '@/components/Iframe/index'
    export default {
        name: "sql",
      components: { elFrame },
     computed: {
        ...mapGetters([
          'sqlApi'
        ])
      }
    }
</script>

<style scoped>

</style>
