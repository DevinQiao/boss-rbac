<template>
  <div class="permission">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="title" placeholder="权限标题" class="filter-item search-item" />
            <el-button class="filter-item" type="primary" plain @click="search">
              {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" type="success" plain @click="reset">
              {{ $t('table.reset') }}
            </el-button>
            <el-dropdown trigger="click" class="filter-item">
              <el-button>
                {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteMenu">{{ $t('table.delete') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <template v-if="finished">
            <el-tree
              ref="permissionTree"
              :data="permissionTree"
              :check-strictly="true"
              :props="{label: 'title'}"
              show-checkbox
              accordion
              node-key="id"
              highlight-current
              :filter-node-method="filterNode"
              @node-click="nodeClick"
            />
          </template>
          <template v-else>
            <el-skeleton :rows="6" animated />
          </template>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ permission.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form ref="form" :model="permission" :rules="rules" label-position="right" label-width="100px">
              <el-form-item :label="$t('table.menu.parentId')" prop="parentId">
                <treeselect
                  v-model="permission.parentId"
                  :multiple="false"
                  :options="permissionTree"
                  :props="{label: 'title'}"
                  :clear-value-text="$t('common.clear')"
                  placeholder=" "
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item :label="$t('table.menu.menuName')" prop="title">
                <el-input v-model="permission.title" />
              </el-form-item>
              <el-form-item :label="$t('table.menu.type')" prop="type">
                <el-radio-group v-model="permission.type" :disabled="permission.id !== ''">
                  <el-radio label="0">{{ $t('common.menu.menu') }}</el-radio>
                  <el-radio label="1">{{ $t('common.menu.button') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="permission.type === '0'" :label="$t('table.menu.icon')" prop="icon">
                <el-input v-model="permission.icon">
                  <el-button slot="append" icon="el-icon-brush" style="padding-left: 0;" @click="chooseIcons" />
                </el-input>
              </el-form-item>
              <el-form-item v-show="permission.type === '0'" :label="$t('table.menu.path')" prop="path">
                <el-input v-model="permission.path" />
              </el-form-item>
              <el-form-item :label="$t('table.menu.perms')" prop="code">
                <el-input v-model="permission.code" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ permission.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <Icons
      :dialog-visible="iconVisible"
      @close="iconVisible = false"
      @choose="chooseIcon"
    />
  </div>
</template>
<script>
import Icons from './Icons'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'MenuManage',
  components: { Icons, Treeselect },
  data() {
    return {
      iconVisible: false,
      finished: false,
      buttonLoading: false,
      selection: [],
      permissionTree: [],
      title: '',
      permission: this.initPermission(),
      rules: {
        title: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 2, max: 10, message: this.$t('rules.range2to10'), trigger: 'blur' }
        ],
        path: { max: 100, message: this.$t('rules.noMoreThan100'), trigger: 'blur' },
        code: { max: 50, message: this.$t('rules.noMoreThan50'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.initPermissionTree()
  },
  methods: {
    initPermissionTree() {
      this.finished = false
      this.$get('system/permission').then((r) => {
        this.permissionTree = r.data.data
        this.finished = true
      })
    },
    initPermission() {
      return {
        id: '',
        parentId: null,
        title: '',
        label: '',
        type: '0',
        icon: '',
        path: '',
        code: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    nodeClick(data, node, v) {
      this.permission.parentId = data.parentId
      if (this.permission.parentId === '0') {
        this.permission.parentId = null
      }
      this.permission.type = data.type
      this.permission.code = data.code
      this.permission.path = data.path
      this.permission.icon = data.icon
      this.permission.title = data.title
      this.permission.label = data.title
      this.permission.id = data.id
      this.$refs.form.clearValidate()
    },
    chooseIcons() {
      this.iconVisible = true
    },
    chooseIcon(icon) {
      this.permission.icon = icon
      this.iconVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          this.permission.label = this.permission.title
          if (this.permission.id) {
            this.$put('system/permission/update', { ...this.permission }).then(() => {
              this.buttonLoading = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.reset()
            })
          } else {
            this.$post('system/permission/add', { ...this.permission }).then(() => {
              this.buttonLoading = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.reset()
            })
          }
        } else {
          return false
        }
      })
    },
    reset() {
      this.initPermissionTree()
      this.title = ''
      this.resetForm()
    },
    search() {
      this.$refs.permissionTree.filter(this.title)
    },
    add() {
      this.resetForm()
      this.$message({
        message: this.$t('tips.createTips'),
        type: 'info'
      })
    },
    deleteMenu() {
      const checked = this.$refs.permissionTree.getCheckedKeys()
      if (checked.length === 0) {
        this.$message({
          message: this.$t('tips.noNodeSelected'),
          type: 'warning'
        })
      } else {
        this.$confirm(this.$t('tips.confirmDeleteNode'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.permission.ids = checked.join(',')
          this.$delete(`system/permission/delete/${this.permission.ids}`).then(() => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.reset()
          })
        }).catch(() => {
          this.$refs.permissionTree.setCheckedKeys([])
        })
      }
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.permission = this.initPermission()
    }
  }
}
</script>
<style lang="scss" scoped>
  .permission {
    margin: 10px;
    .app-container {
      margin: 0 0 10px 0 !important;
    }
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card {
    border-radius: 0;
    border: none;
    .el-card__header {
      padding: 10px 20px !important;
      border-bottom: 1px solid #f1f1f1 !important;
    }
  }
</style>
