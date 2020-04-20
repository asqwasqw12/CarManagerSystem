<template>
    <div>
      <div v-for="post in posts">
        <h1>{{ post.title}}</h1>
        <slot :data="post">
          <p>{{ post.summary }}</p>
        </slot>
      </div>
      <slot name="test"><p>默认文字</p></slot>
    </div>
</template>

<script>
    export default {
        name: "ScopeDemo",
      props:{
        posts:{
          type:Array,
          required:true
        }
      }
    }
</script>

<style scoped>

</style>
