<template>
  <div class="app-container">
    <div class="card-container">
      <el-card
        ref="resetPwd"
        v-loading="listLoading"
        class="box-card"
        element-loading-text="Loading"
        :rules="resetPwdRules"
      >
        <el-divider content-position="left">重置密码</el-divider>
        <el-form
          ref="resetForm"
          :model="resetForm"
          :rules="resetPwdRules"
          label-width="100px"
        >
          <el-form-item label="旧密码：" prop="password">
            <el-input v-model="resetForm.password" type="password" auto-complete="off" />
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="resetForm.newPassword" type="password" auto-complete="off" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="repeatNewPassword">
            <el-input v-model="resetForm.repeatNewPassword" type="password" auto-complete="off" />
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="success" @click="resetPwd">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { updateUserPwd } from '@/api/user'

export default {
  data() {
    const validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      resetForm: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      },
      resetPwdRules: {
        password: [
          { required: true, trigger: 'blur', message: '旧密码不能为空！' },
          { pattern: /^\w+$/, trigger: 'blur', message: '密码只能包含英文字母、数字和下划线！' },
          { min: 6, max: 15, trigger: 'blur', message: '密码长度在 6 到 15 个字符之间！' }
        ],
        newPassword: [
          { required: true, trigger: 'blur', message: '新密码不能为空！' },
          { pattern: /^\w+$/, trigger: 'blur', message: '密码只能包含英文字母、数字和下划线！' },
          { min: 6, max: 15, trigger: 'blur', message: '密码长度在 6 到 15 个字符之间！' }
        ],
        repeatNewPassword: [
          { required: true, trigger: 'blur', validator: validateNewPwd }
        ]
      }
    }
  },
  methods: {
    resetPwd() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          updateUserPwd(this.resetForm).then(response => {
            const { result } = response.data
            if (result) {
              this.$message.success('修改成功，3秒后跳转到登录页！')
              setTimeout(() => {
                this.logout()
              }, 3000)
            } else {
              this.$message({
                message: '修改失败，请检查输入的旧密码是否正确',
                type: 'error'
              })
              return false
            }
          })
            .catch(() => {})
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>
  .card-container {
    display: flex;
    justify-content: space-around;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 70%;
  }
</style>
