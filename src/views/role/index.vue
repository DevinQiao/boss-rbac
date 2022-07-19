<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button type="success" style="float: right" icon="el-icon-circle-plus-outline" @click="roleAdd">新增角色
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="角色名称：">
          <el-input v-model="searchForm.roleName" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="info" plain @click="reset">
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="roleList"
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
      <el-table-column label="角色代码" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column
        label="角色状态"
        align="center"
        :filters="[{ text: $t('common.status.valid'), value: '0' }, { text: $t('common.status.invalid'), value: '1' }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter" style="margin-right: 5px">
            {{ transStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="500px">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改角色" placement="bottom">
            <el-button type="warning" @click="roleUpdate(row)">修改</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
            <el-button type="danger" @click="roleDelete(row.id)">删除</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="为角色分配权限" placement="top">
            <el-button type="primary" @click="assignPermissions">分配权限</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
    />

    <role-edit
      ref="edit"
      :visible="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @success="editSuccess"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import RoleEdit from './edit.vue'

export default {
  components: {
    Pagination,
    RoleEdit
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      roleList: [],
      total: 0,
      listLoading: true,
      pagination: {
        size: 5,
        num: 1
      },
      searchForm: {
        roleName: ''
      },
      dialog: {
        title: '',
        visible: false,
        width: 650,
        height: 150
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    transStatus(status) {
      switch (status) {
        case 1:
          return this.$t('common.status.valid')
        default:
          return this.$t('common.status.invalid')
      }
    },
    filterStatus(value, row) {
      return row.status === value
    },
    fetchData(params = {}) {
      this.listLoading = true
      params.pageSize = this.pagination.size
      params.pageNo = this.pagination.num
      this.$get('system/role/list', {
        ...params
      }).then(response => {
        this.total = response.data.data.total
        this.roleList = response.data.data.records
        this.listLoading = false
      })
    },
    search() {
      this.fetchData({
        ...this.searchForm
      })
    },
    reset() {
      this.searchForm = {}
      this.$refs.table.clearFilter()
      this.search()
    },
    onClose() {
      this.$refs.edit.reset()
      this.dialog.visible = false
    },

    roleAdd() {
      this.dialog.title = this.$t('common.add')
      this.dialog.visible = true
    },
    roleUpdate(row) {
      this.dialog.title = this.$t('common.edit')
      this.dialog.visible = true
      this.$refs.edit.setRole(row)
    },
    editSuccess() {
      this.$refs.edit.reset()
      this.search()
    },
    roleDelete(id) {
      this.loading = true
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.$delete(`system/role/delete/${id}`).then((res) => {
          const message = res.data.message
          const code = res.data.statusCode
          if (code === 200) {
            this.$message({
              message: message,
              type: 'success'
            })
          } else {
            this.$message({
              message: message,
              type: 'error'
            })
          }
          this.search()
        })
      })
    },
    assignPermissions() { }
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
