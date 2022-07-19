<template>
  <system-dialog
    :title="title"
    :visible.sync="isVisible"
    :width="width"
    :height="height"
    @onClose="onClose"
    @onConfirm="onConfirm"
  >
    <div slot="content">
      <el-form ref="form" :model="user" label-width="100px" :rules="rules" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" clearable />
        </el-form-item>
        <el-form-item v-show="user.id === ''" :label="$t('table.user.password')" prop="password">
          <el-tooltip class="item" effect="dark" :content="$t('tips.defaultPassword')" placement="top-start">
            <el-input value="1234qwer" type="password" readonly />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model.number="user.realName" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model.number="user.nickName" clearable />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="user.age" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.user.sex')" prop="gender">
          <el-select v-model="user.gender" value="" placeholder="" style="width:100%">
            <el-option :value="0" :label="$t('common.sex.male')" />
            <el-option :value="1" :label="$t('common.sex.female')" />
            <el-option :value="2" :label="$t('common.sex.secret')" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" clearable />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="user.address" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.user.status')" prop="status">
          <el-radio-group v-model="user.status">
            <el-radio :label="1">{{ $t('common.status.valid') }}</el-radio>
            <el-radio :label="0">{{ $t('common.status.invalid') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </system-dialog>
</template>

<script>
import SystemDialog from '@/components/System/SystemDialog.vue'
import { validPhone } from '@/utils/validate'

export default {
  name: 'UserEdit',
  components: {
    SystemDialog
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 250
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('电话号码格式不正确'))
      } else {
        callback()
      }
    }
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 0 || value > 120) {
            callback(new Error('年龄应该在 1 到 120 岁之间'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      user: this.initUser(),
      response: {
        message: '',
        code: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空！' },
          { pattern: /^[A-Za-z0-9]+$/, trigger: 'blur', message: '用户名只能包含英文字母和数字！' },
          { min: 3, max: 18, trigger: 'blur', message: '用户名长度在 3 到 18 个字符之间！' }
        ],
        realName: [
          { required: true, trigger: 'blur', message: '真实姓名不能为空！' }
        ],
        nickName: [
          { required: true, trigger: 'blur', message: '昵称不能为空！' }
        ],
        status: [
          { required: true, trigger: 'change', message: '账户状态不能为空！' }
        ],
        gender: [
          { required: true, trigger: 'change', message: '性别不能为空！' }
        ],
        age: [
          { required: true, trigger: 'blur', validator: validateAge }
        ],
        phone: [
          { required: true, trigger: 'blur', message: '电话号码不能为空！' },
          { trigger: 'blur', validator: validatePhone }
        ]
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set() {
        this.onClose()
        this.reset()
      }
    }
  },
  methods: {
    initUser() {
      return {
        id: '',
        username: '',
        password: '1234qwer',
        realName: '',
        nickName: '',
        age: null,
        gender: '',
        phone: '',
        email: '',
        address: '',
        status: 1
      }
    },
    onClose() {
      this.$emit('onClose')
    },

    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.user.id) {
            this.$post('system/user/add', { ...this.user }).then((res) => {
              console.log(res)
              this.response.message = res.data.message
              this.response.code = res.data.statusCode
              if (this.response.code === 200) {
                this.$message({
                  message: this.response.message,
                  type: 'success'
                })
                this.isVisible = false
                this.$emit('success')
              } else {
                this.$message({
                  message: this.response.message,
                  type: 'error'
                })
              }
            })
          } else {
            this.$put('system/user/update', { ...this.user }).then((res) => {
              this.response.message = res.data.message
              this.response.code = res.data.statusCode
              if (this.response.code === 200) {
                this.$message({
                  message: this.response.message,
                  type: 'success'
                })
                this.isVisible = false
                this.$emit('success')
              } else {
                this.$message({
                  message: this.response.message,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },

    setUser(val) {
      this.user = { ...val }
    },
    reset() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
    }
  }
}
</script>

<style>
</style>
