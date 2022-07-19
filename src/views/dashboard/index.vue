<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container" style="height: 120px">
          <div class="user-wrapper">
            <div class="user-header">
              <img alt="avatar" :src="avatar">
            </div>
            <div class="user-info">
              <div class="random-message">
                {{ welcomeMessage }}
              </div>
              <div class="user-dept">
                <span>{{ user.deptName ? user.deptName : $t('common.noDept') }}</span> | <span>{{ user.roleName ? user.roleName : $t('common.noRole') }}</span>
              </div>
              <div class="user-login-info">
                {{ $t('common.lastLoginTime') }}: <span id="last-login-time">{{ user.lastLoginTime ? user.lastLoginTime : $t('common.firstLogin') }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <el-table
            :data="server"
            border
            class="server-table"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="服务名"
            />
            <el-table-column
              prop="port"
              label="端口"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.id % 2 === 0 ? 'primary' : 'success'"
                  disable-transitions
                >
                  {{ scope.row.port }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述"
            />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import resize from '@/components/Charts/mixins/resize'

export default {
  name: 'Dashboard',
  filters: {
    portFilter(v) {
      const map = {
        0: 'danger',
        1: 'success'
      }
      return map[status]
    }
  },
  mixins: [resize],
  data() {
    return {
      server: [{
        id: 1,
        name: 'Boss-Server-System',
        port: '9170',
        description: '微服务子系统，系统模块'
      },
      {
        id: 2,
        name: 'Boss-Server-Test',
        port: '9180',
        description: '微服务子系统，部门模块'
      },
      {
        id: 3,
        name: 'Boss-Auth',
        port: '9270',
        description: '微服务认证服务器'
      },
      {
        id: 4,
        name: 'Boss-Gateway',
        port: '9370',
        description: '微服务网关'
      },
      {
        id: 5,
        name: 'Boss-Monitor-Admin',
        port: '9470',
        description: '微服务监控中心'
      }
      ],
      welcomeMessage: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.account.user
    },
    avatar() {
      return require(`@/assets/avatar/${this.user.avatar}.png`)
    }
  },
  mounted() {
    this.welcomeMessage = this.welcome()
  },
  methods: {
    resolveIcon(icon) {
      return require(`@/assets/icons/${icon}`)
    },
    welcome() {
      const date = new Date()
      const hour = date.getHours()
      const time = hour < 6 ? this.$t('common.goodMorning') : (hour <= 11 ? this.$t('common.goodMorning') : (hour <= 13 ? this.$t('common.goodAfternoon') : (hour <= 18 ? this.$t('common.goodAfternoon') : this.$t('common.goodEvening'))))
      const welcomeArr = [
        this.$t('common.randomMessage.a'),
        this.$t('common.randomMessage.b'),
        this.$t('common.randomMessage.c'),
        this.$t('common.randomMessage.d'),
        this.$t('common.randomMessage.e'),
        this.$t('common.randomMessage.f'),
        this.$t('common.randomMessage.g'),
        this.$t('common.randomMessage.h'),
        this.$t('common.randomMessage.i')
      ]
      const index = Math.floor((Math.random() * welcomeArr.length))
      return `${time}, ${this.user.username}, ${welcomeArr[index]}`
    }
  }
}
</script>
<style lang="scss">
  .main {
    .el-card {
      border: none;
      border-radius: 2px;
    }
    .el-table.server-table {
      th {
        height: 2.7rem;
        padding: 7px 0;
        border-right: none;
      }
      td {
        padding: 7px 0;
        border-right: none;
      }
    }
    .count-header {
      padding-left: 1rem;
      height: 120px;
      line-height: 120px;
      text-align: left;
      vertical-align: center;
      img {
        width: 3.8rem;
        margin-top: 1.8rem;
        vertical-align: top;
      }
      span {
        font-size: 15px;
        color: #606266;
        font-weight: 600;
        &.des {
          margin-left: 9px;
        }
      }
    }
    .todayIp {
      color: #27c6da !important;
    }
    .todayVisit {
      color: #fc573b !important;
    }
    .totalVisit {
      color: #be63f9 !important;
    }
  }
</style>
<style lang="scss" scoped>
  .main {
    padding: 10px;
    .app-container {
      margin: 0 0 10px 0;
    }
    .user-container {
      padding: 15px;
    }
    .user-wrapper {
      width: 100%;
      display: inline-block;
      .user-header {
        display: inline-block;
        vertical-align: middle;
        img {
          width: 5rem;
          margin: .5rem 1rem;
          border-radius: 50%
        }
      }
      .user-info {
        display: inline-block;
        vertical-align: middle;
        .random-message {
          font-size: 1rem;
          margin-bottom: .5rem;
          color: #333;
        }
        .user-dept, .user-login-info {
          color: rgba(0, 0, 0, 0.45);
          margin-bottom: .5rem;
          font-size: .9rem;
          line-height: 1.1rem;
        }
      }
    }
    .user-visits {
      text-align: center;
      padding-right: 2rem;
      margin-top: 1rem;
      vertical-align: middle;
      .num {
        font-weight: 600;
      }
    }
    .project-wrapper {
      padding: 0;
      .project-header {
        padding: 18px;
        margin-bottom: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        td {
          width: 50%;
          border-top: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
          padding: .7rem;
          .project-avatar-wrapper {
            display:inline-block;
            float:left;
            margin-right:.7rem;
            .project-avatar {
              color: #42b983;
              background-color: #d6f8b8;
            }
          }
          &:nth-child(odd) {
            border-right: 1px solid #f1f1f1;
          }
        }
      }
      .project-detail {
        display:inline-block;
        float:left;
        text-align:left;
        width: 75%;
        .project-name {
          font-size:.9rem;
          margin-top:-2px;
          font-weight:600;
        }
        .project-desc {
          color:rgba(0, 0, 0, 0.45);
          p {
            margin: 5px 0 0 0;
            font-size: .85rem;
            line-height: 1.4rem;
            white-space:normal;
          }
        }
      }
    }
    @media screen and (max-width: 1366px)
    {
      .user-info {
        max-width: 25rem;
      }
    }
    @media screen and (max-width: 1300px)
    {
      .user-info {
        max-width: 19rem;
      }
    }

    @media screen and (max-width: 1120px)
    {
      .user-info {
        max-width: 17rem;
      }
    }
  }
</style>
