<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        type="success"
        style="float: right"
        icon="el-icon-circle-plus-outline"
        @click="popAddDialog"
      >新增权限
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="权限标题：">
          <el-input v-model="searchForm.title" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="ListOfCurrentPage"
      style="width: 100%;margin-bottom: 20px;"
      row-key="path"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="path" label="路径">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="component" label="组件" width="180">
        <template slot-scope="scope">
          {{ scope.row.component }}
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="icon" label="图标" width="180">
        <template slot-scope="scope">
          {{ scope.row.meta.icon }}
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" @click="popUpdateDialog(scope.row)">修改</el-button>
          <el-button type="danger" @click="deletePermission(scope.row.path)">删除</el-button>
          <el-button type="primary" @click="popAssignRole(scope.row)">分配角色</el-button>
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

    <InfoDialog v-if="showInfoDialog" ref="infoDialog" :isadd="isAdd" :permission="tempPermision" @add="addPermission" @update="updatePermission" />
    <AssignRole v-if="showAssignRole" ref="assignRole" :permission="tempPermision" @assign-roles="assignRoles" />
  </div>
</template>

<script>
import path from 'path'
import { getRoutes } from '@/api/role'
import { addPermission, updatePermission, deletePermission, assignRoles } from '@/api/permission'
import InfoDialog from './components/info-dialog.vue'
import AssignRole from './components/assign-role.vue'
export default {
  components: { InfoDialog, AssignRole },
  data() {
    return {
      routeList: [],

      listLoading: true,

      pageNow: 1,
      pageSize: 5,

      searchForm: {
        title: ''
      },
      searchOptions: {
        title: ''
      },

      isAdd: true,
      showInfoDialog: false,
      tempPermision: {
        path: '',
        title: ''
      },

      showAssignRole: false
    }
  },
  computed: {
    ListForTable() {
      return this.routeList.filter((route) => {
        return route.title.indexOf(this.searchOptions.title) !== -1
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
    // 从后端获得数据
    fetchData() {
      this.listLoading = true
      getRoutes().then(response => {
        this.routeList = this.generateRoutes(response.data)
        this.listLoading = false
      })
    },

    // 分页函数
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageNow = val
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

    popAddDialog() {
      this.showInfoDialog = true
      this.isAdd = true
      this.tempPermision = {}
      this.$nextTick(() => {
        this.$refs.infoDialog.showDialog()
      })
    },

    async addPermission(tempData) {
      const response = await addPermission()
      const { result } = response.data
      if (result) {
        const newPermission = {}
        newPermission.path = tempData.path
        newPermission.title = tempData.title
        this.routeList.push(newPermission)
        this.showInfoDialog = false
        this.$message({
          message: '新增权限成功',
          type: 'success'
        })
      }
    },

    popUpdateDialog(tempData) {
      this.showInfoDialog = true
      this.isAdd = false
      this.tempPermision.path = tempData.path
      this.tempPermision.title = tempData.title
      this.$nextTick(() => {
        this.$refs.infoDialog.showDialog()
      })
    },

    async updatePermission(tempData) {
      const response = await updatePermission()
      const { result } = response.data
      if (result) {
        for (var index in this.routeList) {
          if (this.routeList[index].path === this.tempPermision.path) {
            this.routeList[index].path = tempData.path
            this.routeList[index].title = tempData.title
          }
        }
        this.showInfoDialog = false
        this.$message({
          message: '修改权限成功',
          type: 'success'
        })
      }
    },

    async deletePermission(path) {
      await this.$confirm('确认删除这个权限吗', '确认操作', {
        type: 'danger'
      })
      const response = await deletePermission()
      const { result } = response.data
      if (result) {
        for (var index in this.routeList) {
          if (this.routeList[index].path === path) {
            this.routeList.splice(index, 1)
          }
        }

        this.$message({
          message: '删除权限成功',
          type: 'success'
        })
      }
    },

    popAssignRole(tempData) {
      this.showAssignRole = true
      this.tempPermision.path = tempData.path
      this.tempPermision.title = tempData.title
      this.$nextTick(() => {
        this.$refs.assignRole.showDialog()
      })
    },

    async assignRoles() {
      const response = await assignRoles()
      const { result } = response.data
      if (result) {
        this.showAssignRole = false
        this.$message({
          message: '分配角色成功',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style>

</style>
