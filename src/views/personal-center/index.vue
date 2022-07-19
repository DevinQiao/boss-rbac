<template>
  <div class="app-container">
    <div class="card-container">
      <el-card
        v-loading="listLoading"
        class="box-card"
        element-loading-text="Loading"
      >
        <el-divider content-position="left">个人基本信息</el-divider>
        <el-row>
          <el-col :span="6">
            <div style="margin: 50px; text-align: center;">
              <el-row>
                <el-avatar :size="88" :src="require('@/assets/avatar/'+userInfo.avatar+'.png')" />
              </el-row>
              <el-row style="margin: 0 auto">
                <el-tooltip class="item" effect="dark" content="点击更改头像" placement="bottom">
                  <el-button circle icon="el-icon-camera-solid" @click="showChangeAvatarPane" />
                </el-tooltip>
              </el-row>
            </div>
            <div style="margin: 50px; text-align: center;">
              <el-button type="text" icon="el-icon-edit" @click="showUpdateUserPane">编辑个人资料</el-button>
            </div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-row :gutter="12" style="margin-top:20px;">
                <el-col :span="8"><div style="text-align:right;"><span>用户ID：</span></div></el-col>
                <el-col :span="16">{{ userInfo.id }}</el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>用户名：</span></div></el-col>
                <el-col :span="16">{{ userInfo.username }}</el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>年龄：</span></div></el-col>
                <el-col :span="16">{{ userInfo.age }}</el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>电话：</span></div></el-col>
                <el-col :span="16">{{ userInfo.phone }}</el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>地址：</span></div></el-col>
                <el-col :span="16">{{ userInfo.address }}</el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>账号状态：</span></div></el-col>
                <el-col :span="16">
                  <el-tag
                    :type="userInfo.status | statusFilter"
                  >{{ userInfo.status }}</el-tag>
                </el-col>
              </el-row>
              <el-row :gutter="12" style="margin-top:30px;">
                <el-col :span="8"><div style="text-align:right;"><span>角色：</span></div></el-col>
                <el-col :span="16">
                  <el-tag
                    v-for="(role,index) in userInfo.roles"
                    :key="index"
                    :type="role | roleFilter"
                    style="margin-right: 5px"
                  >{{ role }}</el-tag>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <ChangeAvatar v-if="showChangeAvatar" ref="changeAvatar" @changeAvatar="changeAvatar" />
    <UpdateUser v-if="showUpdateUser" ref="updateUser" :user="userInfo" @updateInfo="updateUser" />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import ChangeAvatar from './components/change-avatar.vue'
import UpdateUser from './components/update-user.vue'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '启用': 'success',
        '禁用': 'danger'
      }
      return statusMap[status]
    },
    roleFilter(role) {
      const roleMap = {
        'admin': 'success',
        'editor': 'primary'
      }
      return roleMap[role]
    }
  },
  components: { ChangeAvatar, UpdateUser },
  data() {
    return {
      userInfo: {
        avatar: 'a-ziyuan80'
      },
      listLoading: true,
      showChangeAvatar: false,
      showUpdateUser: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const token = await getToken()
      const response = await getInfo(token)
      this.userInfo = { ...(response.data) }
      this.listLoading = false
    },
    showChangeAvatarPane() {
      this.showChangeAvatar = true
      this.$nextTick(() => {
        this.$refs.changeAvatar.showDialog()
      })
    },
    showUpdateUserPane() {
      this.showUpdateUser = true
      this.$nextTick(() => {
        this.$refs.updateUser.showDialog()
      })
    },
    updateUser(tempUser) {
      this.userInfo.username = tempUser.username
      this.userInfo.age = tempUser.age
      this.userInfo.phone = tempUser.phone
      this.userInfo.address = tempUser.address
      this.$message({
        message: '修改信息成功',
        type: 'success'
      })
    },
    changeAvatar(choosedAvatar) {
      this.userInfo.avatar = choosedAvatar
      this.$message({
        message: '修改头像成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .card-container {
    display: flex;
    justify-content: space-around;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 70%;
  }
</style>
