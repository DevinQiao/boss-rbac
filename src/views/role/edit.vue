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
      <el-form ref="form" :model="role" label-width="100px" :rules="rules" :inline="true">
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="role.roleCode" clearable />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" clearable />
        </el-form-item>
        <el-form-item label="角色描述" prop="introduction">
          <el-input v-model="role.introduction" clearable />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="role.status">
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

export default {
  name: 'RoleEdit',
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
    return {
      role: this.initRole(),
      response: {
        message: '',
        code: ''
      },
      rules: {
        roleCode: [
          { required: true, trigger: 'blur', message: '角色代码不能为空！' }
        ],
        roleName: [
          { required: true, trigger: 'blur', message: '角色名称不能为空！' }
        ],
        introduction: [
          { required: true, trigger: 'blur', message: '角色描述不能为空！' }
        ],
        status: [
          { required: true, trigger: 'change', message: '角色状态不能为空！' }
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
    initRole() {
      return {
        id: '',
        roleCame: '',
        roleName: '',
        introduction: '',
        status: 1
      }
    },
    onClose() {
      this.$emit('onClose')
    },

    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.role.id) {
            this.$post('system/role/add', { ...this.role }).then((res) => {
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
            this.$put('system/role/update', { ...this.role }).then((res) => {
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

    setRole(val) {
      this.role = { ...val }
    },
    reset() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.role = this.initRole()
    }
  }
}
</script>

<style>
</style>
