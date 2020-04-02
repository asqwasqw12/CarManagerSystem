<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false"  :title="title" append-to-body width="475px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"  style="width: 200px;" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile"  style="width: 200px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import store from '@/store'
  import { validEmail,isvalidPhone } from '@/utils/validate'
  export default {
    name: 'UpdateUser',
    props: {
      email: {
        type: String,
        required: true
      },
      mobile: {
        type: String,
        required: true
      }
    },
    data() {
      const validMail = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback(new Error('邮箱不能为空'))
        } else if (validEmail(value)) {
          callback()
        } else {
          callback(new Error('邮箱格式错误'))
        }
      }
      const validMobile = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback(new Error('手机号码不能为空'))
        } else if (isvalidPhone(value)) {
          callback()
        } else {
          callback(new Error('手机号码格式错误'))
        }
      }
      return {
        loading: false,
        dialogVisible: false,
        title: '修改用户信息',
        form: {
          email: '',
          mobile: ''
        },
        codeLoading: false,
        rules: {
          email: [
            { required: true, validator: validMail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, validator: validMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {

      doSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            updateEmail(this.form).then(res => {
              this.loading = false
              this.resetForm()
              this.$notify({
                title: '邮箱修改成功',
                type: 'success',
                duration: 1500
              })
              store.dispatch('GetInfo').then(() => {})
            }).catch(err => {
              this.loading = false
              console.log(err.response.data.message)
            })
          } else {
            return false
          }
        })
      },
    },
    mounted() {
      this.form.email = this.email
      this.form.mobile = this.mobile
    },
  }
</script>

<style scoped>

</style>
