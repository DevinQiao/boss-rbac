<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        type="success"
        style="float: right"
        icon="el-icon-circle-plus-outline"
        @click="popDialog({})"
      >新增用户
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="用户名：">
          <el-input v-model="searchForm.username" clearable />
        </el-form-item>
        <el-form-item label="用户角色：">
          <el-select v-model="searchForm.roles" placeholder="请选择用户角色" clearable>
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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户ID">
              <span class="content">{{ scope.row.token }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span class="content">{{ scope.row.username }}</span>
            </el-form-item>
            <el-form-item label="密码">
              <span class="content">{{ scope.row.password }}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span class="content">{{ scope.row.age }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span class="content">{{ scope.row.phone }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span class="content">{{ scope.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.token }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.roles | statusFilter">{{ scope.row.roles }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <el-button type="warning" icon="el-icon-edit" circle @click="popDialog(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.token)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
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
        :title="isAdd ? '新建用户' : '修改用户'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="infoForm" :model="tempUserInfo" label-width="100px" :rules="addAndUpdateRules">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="tempUserInfo.username" clearable />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="tempUserInfo.password" clearable />
          </el-form-item>
          <el-form-item label="用户角色：" prop="roles">
            <el-select v-model="tempUserInfo.roles" clearable>
              <el-option label="admin" value="admin" />
              <el-option label="editor" value="editor" />
            </el-select>
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
          <el-button v-if="isAdd" type="success" @click="addUser">新 增</el-button>
          <el-button v-if="!isAdd" type="warning" @click="updateUser">修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserList, addUser, updateUser, deleteUser } from '@/api/user'
import { validPhone } from '@/utils/validate'

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
      // 从后端拿到的数据
      userList: [],

      // 加载进度条
      listLoading: true,

      // 分页属性
      pageNow: 1,
      pageSize: 5,

      // 搜索条件
      searchForm: {
        username: '',
        roles: ''
      },
      searchOptions: {
        username: '',
        roles: ''
      },

      // 新增和修改窗口相关属性
      isAdd: true,
      dialogVisible: false,
      tempUserInfo: {
        token: '',
        username: '',
        password: '',
        roles: '',
        age: 20,
        phone: '',
        address: ''
      },
      addAndUpdateRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空！' },
          { pattern: /^[A-Za-z0-9]+$/, trigger: 'blur', message: '用户名只能包含英文字母和数字！' },
          { min: 3, max: 18, trigger: 'blur', message: '用户名长度在 3 到 18 个字符之间！' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空！' },
          { pattern: /^\w+$/, trigger: 'blur', message: '密码只能包含英文字母、数字和下划线！' },
          { min: 6, max: 15, trigger: 'blur', message: '密码长度在 6 到 15 个字符之间！' }
        ],
        roles: [
          { required: true, trigger: 'change', message: '用户角色不能为空！' }
        ],
        age: [
          // { required: true, trigger: 'blur', message: '年龄不能为空！' }
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
  computed: {
    ListForTable() {
      return this.userList.filter((user) => {
        return user.username.indexOf(this.searchOptions.username) !== -1
      }).filter((user) => {
        return user.roles.indexOf(this.searchOptions.roles) !== -1
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
        this.userList = response.data.items
        this.listLoading = false
      })
    },

    // 查询按钮
    onSubmit() {
      this.searchOptions.username = this.searchForm.username
      this.searchOptions.roles = this.searchForm.roles

      this.$message({
        message: '查询成功',
        type: 'success'
      })
    },

    // 弹出新建或者修改的对话框
    popDialog(tempData) {
      this.tempUserInfo.token = tempData.token
      this.tempUserInfo.username = tempData.username
      this.tempUserInfo.password = tempData.password
      this.tempUserInfo.roles = tempData.roles
      this.tempUserInfo.age = tempData.age
      this.tempUserInfo.phone = tempData.phone
      this.tempUserInfo.address = tempData.address
      var arr = Object.keys(tempData)
      if (arr.length === 0) {
        this.isAdd = true
      } else {
        this.isAdd = false
      }
      this.dialogVisible = true
    },

    // 取消新建或者修改操作
    cancel() {
      this.tempUserInfo.token = ''
      this.tempUserInfo.username = ''
      this.tempUserInfo.password = ''
      this.tempUserInfo.roles = ''
      this.tempUserInfo.age = ''
      this.tempUserInfo.phone = ''
      this.tempUserInfo.address = ''
      this.dialogVisible = false
    },

    // 新建用户
    addUser() {
      this.$refs.infoForm.clearValidate()
      this.tempUserInfo.token = new Date().getTime()
      const newUserInfo = {
        token: this.tempUserInfo.token,
        username: this.tempUserInfo.username,
        password: this.tempUserInfo.password,
        roles: this.tempUserInfo.roles,
        age: this.tempUserInfo.age,
        phone: this.tempUserInfo.phone,
        address: this.tempUserInfo.address
      }
      addUser(newUserInfo).then(response => {
        const result = response.data.result
        if (result) {
          this.userList.push(newUserInfo)
          this.dialogVisible = false
          this.$message({
            message: '添加用户成功',
            type: 'success'
          })
        }
      })
      this.$refs.infoForm.clearValidate()
    },

    // 修改用户
    updateUser() {
      updateUser(this.tempUserInfo).then(response => {
        const result = response.data.result
        if (result) {
          for (var index in this.userList) {
            if (this.userList[index].token === this.tempUserInfo.token) {
              this.userList[index].username = this.tempUserInfo.username
              this.userList[index].password = this.tempUserInfo.password
              this.userList[index].roles = this.tempUserInfo.roles
              this.userList[index].age = this.tempUserInfo.age
              this.userList[index].phone = this.tempUserInfo.phone
              this.userList[index].address = this.tempUserInfo.address
            }
          }
          this.tempUserInfo.token = ''
          this.tempUserInfo.username = ''
          this.tempUserInfo.password = ''
          this.tempUserInfo.roles = ''
          this.tempUserInfo.age = ''
          this.tempUserInfo.phone = ''
          this.tempUserInfo.address = ''
          this.dialogVisible = false

          this.$message({
            message: '修改用户成功',
            type: 'success'
          })
        }
      })
    },

    // 删除用户
    deleteUser(token) {
      this.$confirm('确认删除这一条记录吗？', '提示', {
        type: 'danger'
      }).then(() => {
        deleteUser(token).then(response => {
          const result = response.data.result
          if (result) {
            for (var index in this.userList) {
              if (this.userList[index].token === token) {
                this.userList.splice(index, 1)
              }
            }

            this.$message({
              message: '删除用户成功',
              type: 'success'
            })
          }
        })
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
