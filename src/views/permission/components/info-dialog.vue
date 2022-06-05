<template>
  <el-dialog
    v-if="dialogVisible"
    :title="isadd ? '新建权限' : '修改权限'"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form ref="infoForm" :model="tempPermission" label-width="100px" :rules="addAndUpdateRules">
      <el-form-item label="路径：" prop="path">
        <el-input v-model="tempPermission.path" clearable />
      </el-form-item>
      <el-form-item label="标题：" prop="title">
        <el-input v-model="tempPermission.title" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="isadd" type="success" @click="addPermission">新 增</el-button>
      <el-button v-if="!isadd" type="warning" @click="updatePermission">修 改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'InfoDialog',
  props: {
    isadd: {
      type: Boolean,
      default: true
    },
    permission: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      tempPermission: {
        path: '',
        title: ''
      },
      addAndUpdateRules: {
        path: [
          { required: true, trigger: 'blur', message: '路径不能为空' }
        ],
        title: [
          { required: true, trigger: 'blur', message: '标题不能为空' }
        ]
      }
    }
  },
  methods: {
    // initTempPermision() {
    //   this.tempPermission.path = this.permission.path
    //   this.tempPermission.title = this.permission.title
    // },
    showDialog() {
      this.tempPermission.path = this.permission.path
      this.tempPermission.title = this.permission.title
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.tempPermission.path = ''
      this.tempPermission.title = ''
    },
    addPermission() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.$emit('add', this.tempPermission)
        }
      })
    },
    updatePermission() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.$emit('update', this.tempPermission)
        }
      })
    }
  }
}
</script>

<style>

</style>
