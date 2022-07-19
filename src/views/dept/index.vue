<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button type="success" style="float: right" icon="el-icon-circle-plus-outline" @click="deptAdd()">新增部门
      </el-button>
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="部门名称：">
          <el-input v-model="searchForm.name" clearable />
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
      :data="deptList"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column label="部门ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <el-button type="warning" icon="el-icon-edit" circle @click="deptUpdate(row)" />
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

    <dept-edit
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
import DeptEdit from './edit.vue'

export default {
  components: {
    Pagination,
    DeptEdit
  },
  data() {
    return {
      deptList: [],
      total: 0,
      listLoading: true,
      pagination: {
        size: 5,
        num: 1
      },
      searchForm: {
        name: ''
      },
      dialog: {
        title: '',
        visible: false,
        width: 400,
        height: 100
      },
      selection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(params = {}) {
      params.pageSize = this.pagination.size
      params.pageNo = this.pagination.num
      this.listLoading = true
      this.$post('system/dept/list', {
        ...params
      }).then(response => {
        console.log(response)
        this.total = response.data.data.total
        this.deptList = response.data.data.records
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

    onConfirm() {
      this.$refs.edit.reset()
      this.$refs.edit.setDept()
      this.dialog.visible = false
      this.search()
    },
    deptAdd() {
      this.dialog.title = this.$t('common.add')
      this.dialog.visible = true
    },
    deptUpdate(row) {
      this.dialog.visible = true
      this.$refs.edit.setDept(row)
      this.dialog.title = this.$t('common.edit')
    },

    editSuccess() {
      this.$refs.edit.reset()
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
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selection.forEach((u) => {
          ids.push(u.id)
        })
        this.delete(ids)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    delete(ids) {
      this.loading = true
      this.$delete(`system/dept/delete/${ids}`).then((res) => {
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
