<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        type="success"
        style="float: right"
        icon="el-icon-circle-plus-outline"
        @click="popDialog({status: '启用'})"
      >新增用户
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="用户名：">
          <el-input v-model="searchForm.username" clearable />
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
              <span class="content">{{ scope.row.id }}</span>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账户状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusFilter"
            style="margin-right: 5px"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <el-button type="warning" icon="el-icon-edit" circle @click="popDialog(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="ListForTable.length / pageSize > 1"
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
          <el-form-item label="账户状态：" prop="status">
            <el-select v-model="tempUserInfo.status" clearable>
              <el-option label="启用" value="启用" />
              <el-option label="禁用" value="禁用" />
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
        '启用': 'success',
        '禁用': 'danger'
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
        username: ''
      },
      searchOptions: {
        username: ''
      },

      // 新增和修改窗口相关属性
      isAdd: true,
      dialogVisible: false,
      tempUserInfo: {
        id: '',
        username: '',
        password: '',
        status: '',
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
        status: [
          { required: true, trigger: 'change', message: '账户状态不能为空！' }
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
  computed: {
    ListForTable() {
      return this.userList.filter((user) => {
        return user.username.indexOf(this.searchOptions.username) !== -1
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

      this.$message({
        message: '查询成功',
        type: 'success'
      })
    },

    // 弹出新建或者修改的对话框
    popDialog(tempData) {
      this.tempUserInfo.id = tempData.id
      this.tempUserInfo.username = tempData.username
      this.tempUserInfo.password = tempData.password
      this.tempUserInfo.status = tempData.status
      this.tempUserInfo.age = tempData.age
      this.tempUserInfo.phone = tempData.phone
      this.tempUserInfo.address = tempData.address
      var arr = Object.keys(tempData)
      if (arr.length === 1) {
        this.isAdd = true
      } else {
        this.isAdd = false
      }
      this.dialogVisible = true
    },

    // 取消新建或者修改操作
    cancel() {
      this.tempUserInfo.id = ''
      this.tempUserInfo.username = ''
      this.tempUserInfo.password = ''
      this.tempUserInfo.status = ''
      this.tempUserInfo.age = ''
      this.tempUserInfo.phone = ''
      this.tempUserInfo.address = ''
      this.dialogVisible = false
    },

    // 新建用户
    addUser() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.tempUserInfo.id = new Date().getTime()
          const newUserInfo = {
            id: this.tempUserInfo.id,
            username: this.tempUserInfo.username,
            password: this.tempUserInfo.password,
            status: this.tempUserInfo.status,
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
        }
      })
    },

    // 修改用户
    updateUser() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          updateUser(this.tempUserInfo).then(response => {
            const result = response.data.result
            if (result) {
              for (var index in this.userList) {
                if (this.userList[index].id === this.tempUserInfo.id) {
                  this.userList[index].username = this.tempUserInfo.username
                  this.userList[index].password = this.tempUserInfo.password
                  this.userList[index].status = this.tempUserInfo.status
                  this.userList[index].age = this.tempUserInfo.age
                  this.userList[index].phone = this.tempUserInfo.phone
                  this.userList[index].address = this.tempUserInfo.address
                }
              }
              this.tempUserInfo.id = ''
              this.tempUserInfo.username = ''
              this.tempUserInfo.password = ''
              this.tempUserInfo.status = ''
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
        }
      })
    },

    // 删除用户
    deleteUser(id) {
      this.$confirm('确认删除这一条记录吗？', '提示', {
        type: 'danger'
      }).then(() => {
        deleteUser(id).then(response => {
          const result = response.data.result
          if (result) {
            for (var index in this.userList) {
              if (this.userList[index].id === id) {
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
