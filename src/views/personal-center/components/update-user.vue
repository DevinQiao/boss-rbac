<template>
  <el-dialog
    v-if="dialogVisible"
    title="编辑个人信息"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form ref="infoForm" :model="tempUserInfo" label-width="100px" :rules="formRules">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="tempUserInfo.username" clearable />
      </el-form-item>
      <el-form-item label="年龄：" prop="age">
        <el-input v-model.number="tempUserInfo.age" clearable />
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="tempUserInfo.phone" clearable />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="tempUserInfo.address" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="success" @click="updateInfo">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validPhone } from '@/utils/validate'
export default {
  name: 'UpdateUser',
  props: {
    user: {
      type: Object,
      default: null
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
      dialogVisible: false,
      tempUserInfo: {
        username: '',
        age: '',
        phone: '',
        address: ''
      },
      formRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空！' },
          { pattern: /^[A-Za-z0-9]+$/, trigger: 'blur', message: '用户名只能包含英文字母和数字！' },
          { min: 3, max: 18, trigger: 'blur', message: '用户名长度在 3 到 18 个字符之间！' }
        ],
        age: [
          { required: true, trigger: 'blur', validator: validateAge }
        ],
        phone: [
          { required: true, trigger: 'blur', message: '电话号码不能为空！' },
          { trigger: 'blur', validator: validatePhone }
        ],
        address: [
          { required: true, trigger: 'blur', message: '地址不能为空！' }
        ]
      }
    }
  },
  mounted() {
    this.initTempUserInfo()
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    initTempUserInfo() {
      this.tempUserInfo.username = this.user.username
      this.tempUserInfo.age = this.user.age
      this.tempUserInfo.phone = this.user.phone
      this.tempUserInfo.address = this.user.address
    },
    cancel() {
      this.dialogVisible = false
      this.tempUserInfo.username = ''
      this.tempUserInfo.age = ''
      this.tempUserInfo.phone = ''
      this.tempUserInfo.address = ''
    },
    updateInfo() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.$emit('updateInfo', this.tempUserInfo)
          this.tempUserInfo.username = ''
          this.tempUserInfo.age = ''
          this.tempUserInfo.phone = ''
          this.tempUserInfo.address = ''
        }
      })
    }

  }
}
</script>

<style>

</style>
