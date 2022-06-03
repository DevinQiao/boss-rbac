<template>
  <div class="app-container">
    <div class="operation-container">
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="用户角色：">
          <el-select v-model="searchForm.roles" placeholder="请选择用户角色" clearable multiple>
            <el-option label="admin" value="admin" />
            <el-option label="editor" value="editor" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="ListOfCurrentPage"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="(role,index) in scope.row.roles"
            :key="index"
            :type="role | statusFilter"
            style="margin-right: 5px"
          >{{ role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.isAdmin" @click="popDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="ListForTable.length/pageSize > 1"
      :current-page="pageNow"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="ListForTable.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <div>
      <el-dialog
        v-if="dialogVisible"
        title="分配角色"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="infoForm" :model="tempUserRoleInfo" label-width="100px" :rules="infoFormRules">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="tempUserRoleInfo.username" disabled />
          </el-form-item>
          <el-form-item label="用户角色：" prop="roles">
            <el-select v-model="tempUserRoleInfo.roles" clearable multiple>
              <el-option v-for="(item,index) in roleList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="updateUserRole">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserList, updateUserRole } from '@/api/user'
import { getRoles } from '@/api/role'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        admin: 'success',
        editor: 'primary'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // 从后端拿到的数据
      userRoleList: [],
      roleList: [],

      // 加载进度条
      listLoading: true,

      // 分页属性
      pageNow: 1,
      pageSize: 5,

      // 搜索条件
      searchForm: {
        roles: []
      },
      searchOptions: {
        roles: []
      },

      // 分配窗口相关属性
      dialogVisible: false,
      tempUserRoleInfo: {
        username: '',
        roles: []
      },
      infoFormRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空！' },
          { pattern: /^[A-Za-z0-9]+$/, trigger: 'blur', message: '用户名只能包含英文字母和数字！' },
          { min: 3, max: 18, trigger: 'blur', message: '用户名长度在 3 到 18 个字符之间！' }
        ],
        roles: [
          { required: true, trigger: 'change', message: '用户角色不能为空！' }
        ]
      }
    }
  },
  computed: {
    ListForTable() {
      return this.userRoleList.filter((userRole) => {
        return this.searchOptions.roles.every(role => {
          return userRole.roles.includes(role)
        })
      })
    },
    ListOfCurrentPage() {
      var start = (this.pageNow - 1) * this.pageSize
      var end = this.pageNow * this.pageSize
      return this.ListForTable.slice(start, end)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 从后端获取数据
    fetchData() {
      this.listLoading = true
      getUserList().then(response => {
        this.listLength = response.data.total
        const userList = response.data.items
        userList.forEach(user => {
          const { username, roles } = user
          const temp = { username, roles, isAdmin: false }
          if (roles.includes('admin')) { temp.isAdmin = true }
          this.userRoleList.push(temp)
        })
        this.listLoading = false
      })
      getRoles().then(response => {
        const roles = response.data.roles
        roles.forEach(role => {
          if (role.name !== 'admin') { this.roleList.push(role.name) }
        })
      })
    },

    // 查询按钮
    onSubmit() {
      this.searchOptions.roles = this.searchForm.roles

      this.$message({
        message: '查询成功',
        type: 'success'
      })
    },

    // 弹出角色分配对话框
    popDialog(tempData) {
      this.tempUserRoleInfo.username = tempData.username
      this.tempUserRoleInfo.roles = tempData.roles
      this.dialogVisible = true
    },

    // 取消角色分配操作
    cancel() {
      this.tempUserRoleInfo.username = ''
      this.tempUserRoleInfo.roles = []
      this.dialogVisible = false
    },

    // 修改用户角色
    updateUserRole() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          updateUserRole(this.tempUserRoleInfo).then(response => {
            const result = response.data.result
            if (result) {
              for (var index in this.userRoleList) {
                if (this.userRoleList[index].username === this.tempUserRoleInfo.username) {
                  this.userRoleList[index].roles = this.tempUserRoleInfo.roles
                }
              }
              this.tempUserRoleInfo.roles = []
              this.dialogVisible = false

              this.$message({
                message: '修改用户角色成功',
                type: 'success'
              })
            }
          })
        }
      })
    },

    // 分页函数
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageNow = val
    }
  }
}
</script>

<style>
  .content {
    margin-right: 20px;
  }
</style>
