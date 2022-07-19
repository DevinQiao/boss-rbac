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
      <el-form ref="form" :model="dept" label-width="100px" :rules="rules" :inline="true">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dept.name" clearable />
        </el-form-item>
      </el-form>
    </div>
  </system-dialog>
</template>

<script>
import SystemDialog from '@/components/System/SystemDialog.vue'

export default {
  name: 'DeptEdit',
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
      dept: this.initDept(),
      response: {
        message: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '部门名称不能为空！' }
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
    initDept() {
      return {
        id: '',
        name: ''
      }
    },
    onClose() {
      this.$emit('onClose')
    },

    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.dept.id) {
            this.$post('system/dept/add', { ...this.dept }).then((res) => {
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
            this.$put('system/dept/update', { ...this.dept }).then((res) => {
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

    setDept(val) {
      this.dept = { ...val }
    },
    reset() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.dept = this.initDept()
    }
  }
}
</script>

<style>
</style>
