<template>
  <el-dialog
    v-if="dialogVisible"
    title="分配角色"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form ref="infoForm" :model="permission" label-width="100px">
      <el-form-item label="路径：">
        <el-input v-model="permission.path" disabled />
      </el-form-item>
      <el-form-item label="标题：">
        <el-input v-model="permission.title" disabled />
      </el-form-item>
      <el-form-item label="可分配角色：">
        <el-select v-model="selectedRoles" placeholder="请选择角色" clearable multiple>
          <el-option v-for="(role,index) in roles" :key="index" :label="role.name" :value="role.name" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="success" @click="assignRoles">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoles } from '@/api/role'
export default {
  name: 'AssignRole',
  props: {
    permission: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      roles: [],
      selectedRoles: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const response = await getRoles()
      const { roles } = response.data
      this.roles = roles
    },
    showDialog() {
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.selectedRoles = []
    },
    assignRoles() {
      this.dialogVisible = false
      this.$emit('assign-roles', this.selectedRoles)
    }
  }
}
</script>

<style>

</style>
