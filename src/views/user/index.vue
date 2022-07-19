<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button type="success" style="float: right" icon="el-icon-circle-plus-outline" @click="userAdd()">新增用户
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="用户名：">
          <el-input v-model="searchForm.username" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="info" plain @click="reset">
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="selection.length>1" class="filter-item" type="danger" plain @click.native="batchDelete">
            {{ $t('table.delete') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="userList"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户ID">
              <span class="content">{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span class="content">{{ scope.row.username }}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span class="content">{{ scope.row.age }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span class="content">{{ scope.row.phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span class="content">{{ scope.row.email }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span class="content">{{ scope.row.address }}</span>
            </el-form-item>
          </el-form>
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
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        align="center"
        :filters="[{ text: $t('common.sex.male'), value: '0' }, { text: $t('common.sex.female'), value: '1' }, { text: $t('common.sex.secret'), value: '2' }]"
        :filter-method="filterSex"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.gender | sexFilter">
            {{ transSex(row.gender) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="账户状态"
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
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <el-button type="warning" icon="el-icon-edit" circle @click="userUpdate(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="danger" icon="el-icon-delete" circle @click="singleDelete(row)" />
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

    <user-edit
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
import UserEdit from './edit.vue'

export default {
  name: 'UserManage',
  components: {
    Pagination,
    UserEdit
  },
  filters: {
    sexFilter(status) {
      const map = {
        0: 'success',
        1: 'danger',
        2: 'info'
      }
      return map[status]
    },
    statusFilter(status) {
      const map = {
        1: 'success',
        0: 'danger'
      }
      return map[status]
    }
  },
  data() {
    return {
      userList: [],
      total: 0,
      listLoading: true,
      pagination: {
        size: 5,
        num: 1
      },
      searchForm: {
        username: ''
      },
      dialog: {
        title: '',
        visible: false,
        width: 650,
        height: 300
      },
      selection: []
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.account.user
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    transSex(sex) {
      switch (sex) {
        case 0:
          return this.$t('common.sex.male')
        case 1:
          return this.$t('common.sex.female')
        default:
          return this.$t('common.sex.secret')
      }
    },
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
    filterSex(value, row) {
      return row.gender === value
    },
    fetchData(params = {}) {
      params.pageSize = this.pagination.size
      params.pageNo = this.pagination.num
      this.listLoading = true
      this.$get('system/user/list', {
        ...params
      }).then(response => {
        this.total = response.data.data.total
        this.userList = response.data.data.records
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
      console.log(this.dialog)
      this.dialog.visible = false
      this.$refs.edit.reset()
    },
    onConfirm() {
      this.$refs.edit.setUser()
      this.dialog.visible = false
      this.$refs.edit.reset()
      this.search()
    },
    userAdd() {
      this.dialog.title = this.$t('common.add')
      this.dialog.visible = true
    },
    userUpdate(row) {
      this.dialog.visible = true
      this.$refs.edit.setUser(row)
      this.dialog.title = this.$t('common.edit')
    },
    editSuccess() {
      this.search()
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      let contain = false
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selection.forEach((u) => {
          if (u.id === this.currentUser.id) {
            contain = true
            return
          }
          ids.push(u.id)
        })
        if (contain) {
          this.$message({
            message: this.$t('tips.containCurrentUser'),
            type: 'warning'
          })
          this.clearSelections()
        } else {
          this.delete(ids)
        }
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    delete(ids) {
      this.loading = true
      this.$delete(`system/user/delete/${ids}`).then((res) => {
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
    }
  }
}
</script>

<style>
.content {
  margin-right: 20px;
}
</style>
