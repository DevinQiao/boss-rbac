<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        type="success"
        style="float: right"
        icon="el-icon-circle-plus-outline"
        @click="popDialog({status: '启用'})"
      >新增角色
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="角色名称：">
          <el-input v-model="searchForm.name" clearable />
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
            <el-form-item label="角色名称">
              <span class="content">{{ scope.row.name }}</span>
            </el-form-item>
            <el-form-item label="角色描述">
              <span class="content">{{ scope.row.description }}</span>
            </el-form-item>
            <el-form-item label="当前已分配用户：">
              <span v-for="(user,index) in scope.row.users" :key="index" class="content">{{ user }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusFilter"
            style="margin-right: 5px"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="500px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改角色" placement="bottom">
            <el-button type="warning" @click="popDialog(scope.row)">修改</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
            <el-button type="danger" @click="deleteRole(scope.row.key)">删除</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="为角色分配用户" placement="bottom">
            <el-button type="primary" @click="beforeAssignUsers(scope.row)">分配用户</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="为角色分配权限" placement="top">
            <el-button type="primary" @click="beforeAssignPermissions(scope.row)">分配权限</el-button>
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

    <div class="oprationWindow">
      <el-dialog
        v-if="dialogVisible"
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="infoForm" :model="tempRoleInfo" label-width="100px" :rules="addAndUpdateRules">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="tempRoleInfo.name" clearable :disabled="treeVisible" />
          </el-form-item>
          <el-form-item v-show="!treeVisible" label="角色状态：" prop="status">
            <el-select v-model="tempRoleInfo.status" clearable :disabled="treeVisible">
              <el-option label="启用" value="启用" />
              <el-option label="禁用" value="禁用" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="!treeVisible" label="角色描述：" prop="description">
            <el-input v-model="tempRoleInfo.description" type="textarea" :disabled="treeVisible" />
          </el-form-item>
          <el-form-item v-show="treeVisible && isAssignUser" label="可分配用户：">
            <el-select v-model="tempRoleInfo.users" placeholder="请选择用户" clearable multiple>
              <el-option v-for="(user,index) in userList" :key="index" :label="user" :value="user" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="treeVisible && !isAssignUser" label="可分配权限：">
            <el-tree
              ref="tree"
              :check-strictly="checkStrictly"
              :data="routesData"
              :props="defaultProps"
              show-checkbox
              node-key="path"
              class="permission-tree"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForDialog">取 消</el-button>
          <el-button v-if="!treeVisible && isAdd" type="success" @click="addRole">新 增</el-button>
          <el-button v-if="!treeVisible && !isAdd" type="warning" @click="updateRole">修 改</el-button>
          <el-button v-if="treeVisible && isAssignUser" type="primary" @click="assignUsers">保 存</el-button>
          <el-button v-if="treeVisible && !isAssignUser" type="primary" @click="assignPermissions">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, updateRole, deleteRole, assignUsers, getRoutes, assignPermissions } from '@/api/role'

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
    return {
      // 从后端拿到的数据
      roleList: [],

      // 加载进度条
      listLoading: true,

      // 分页属性
      pageNow: 1,
      pageSize: 5,

      // 搜索条件
      searchForm: {
        name: ''
      },
      searchOptions: {
        name: ''
      },

      // 新增和修改窗口相关属性
      isAdd: true,
      dialogVisible: false,
      tempRoleInfo: {
        key: '',
        name: '',
        status: '',
        description: '',
        users: [],
        routes: []
      },
      addAndUpdateRules: {
        name: [
          { required: true, trigger: 'blur', message: '角色名称不能为空！' }
        ],
        status: [
          { required: true, trigger: 'blur', message: '角色状态不能为空！' }
        ],
        description: [
          { required: true, trigger: 'blur', message: '角色描述不能为空！' }
        ]
      },

      // 分配用户或者权限相关属性
      isAssignUser: true,
      treeVisible: false,
      userList: [],
      routes: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    ListForTable() {
      return this.roleList.filter((role) => {
        return role.name.indexOf(this.searchOptions.name) !== -1
      })
    },
    ListOfCurrentPage() {
      var start = (this.pageNow - 1) * this.pageSize
      var end = this.pageNow * this.pageSize
      return this.ListForTable.slice(start, end)
    },
    dialogTitle() {
      if (this.treeVisible) {
        if (this.isAssignUser) {
          return '为该角色分配用户'
        } else {
          return '为该角色分配权限'
        }
      } else {
        if (this.isAdd) {
          return '新增角色'
        } else {
          return '修改角色'
        }
      }
    },
    routesData() {
      return this.routes
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 从后端获取数据
    fetchData() {
      this.listLoading = true
      getRoutes().then(response => {
        this.serviceRoutes = response.data
        this.routes = this.generateRoutes(response.data)
      })
      getRoles().then(response => {
        this.listLength = response.data.total
        this.roleList = response.data.roles
        this.userList = response.data.users // 这里和后端对接要再修改
        this.listLoading = false
      })
    },

    // 查询按钮
    onSubmit() {
      this.searchOptions.name = this.searchForm.name

      this.$message({
        message: '查询成功',
        type: 'success'
      })
    },

    // 弹出新建或者修改的对话框
    popDialog(tempData) {
      this.tempRoleInfo.key = tempData.key
      this.tempRoleInfo.name = tempData.name
      this.tempRoleInfo.status = tempData.status
      this.tempRoleInfo.description = tempData.description
      this.tempRoleInfo.users = tempData.users
      this.tempRoleInfo.routes = tempData.routes
      var arr = Object.keys(tempData)
      if (arr.length === 1) {
        this.isAdd = true
      } else {
        this.isAdd = false
      }
      this.dialogVisible = true
    },

    // 取消新建或者修改操作
    cancelForDialog() {
      this.tempRoleInfo.name = ''
      this.tempRoleInfo.status = ''
      this.tempRoleInfo.description = ''
      this.dialogVisible = false
      this.treeVisible = false
    },

    // 新建角色
    addRole() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          const newRole = {
            name: this.tempRoleInfo.name,
            status: this.tempRoleInfo.status,
            description: this.tempRoleInfo.description
          }
          addRole(newRole).then(response => {
            const { result, key } = response.data
            if (result) {
              newRole.key = key
              this.roleList.push(newRole)
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

    // 修改角色
    updateRole() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          updateRole(this.tempRoleInfo).then(response => {
            const result = response.data.result
            if (result) {
              for (var index in this.roleList) {
                if (this.roleList[index].key === this.tempRoleInfo.key) {
                  this.roleList[index].name = this.tempRoleInfo.name
                  this.roleList[index].status = this.tempRoleInfo.status
                  this.roleList[index].description = this.tempRoleInfo.description
                }
              }
              this.tempRoleInfo.name = ''
              this.tempRoleInfo.status = ''
              this.tempRoleInfo.description = ''
            }
            this.$message({
              message: '修改角色成功',
              type: 'success'
            })
          })
        }
      })
    },

    // 删除角色
    deleteRole(key) {
      this.$confirm('确认删除这一条记录吗？', '提示', {
        type: 'danger'
      }).then(() => {
        deleteRole(key).then(response => {
          console.log(key)
          const result = response.data.result
          if (result) {
            for (var index in this.roleList) {
              if (this.roleList[index].key === key) {
                this.roleList.splice(index, 1)
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
    },

    // 为该角色分配用户
    // 用户列表是mock随机生成的，所以在跟后端接入的时候，要再次进行调整
    beforeAssignUsers(tempData) {
      this.treeVisible = true
      this.isAssignUser = true
      this.popDialog(tempData)
    },

    assignUsers() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          assignUsers(this.tempRoleInfo).then(response => {
            const result = response.data.result
            if (result) {
              for (var index in this.roleList) {
                if (this.roleList[index].key === this.tempRoleInfo.key) {
                  this.roleList[index].users = this.tempRoleInfo.users
                }
              }
              this.tempRoleInfo.users = []
            }
            this.$message({
              message: '分配角色成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.treeVisible = false
          })
        }
      })
    },

    beforeAssignPermissions(tempData) {
      this.treeVisible = true
      this.isAssignUser = false
      this.checkStrictly = true
      this.popDialog(tempData)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.tempRoleInfo.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
      this.popDialog(tempData)
    },

    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },

    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },

    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },

    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },

    async assignPermissions() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.tempRoleInfo.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      const response = await assignPermissions(this.tempRoleInfo)
      const result = response.data.result
      if (result) {
        for (let index = 0; index < this.roleList.length; index++) {
          if (this.roleList[index].key === this.tempRoleInfo.key) {
            this.roleList.splice(index, 1, Object.assign({}, this.tempRoleInfo))
            break
          }
        }
      }
      this.treeVisible = false
      this.dialogVisible = false
      this.$message({
        message: '分配权限成功',
        type: 'success'
      })
    }

  }
}
</script>

<style>
  .content {
    margin-right: 20px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
</style>
