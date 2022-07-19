<template>
  <div id="loginLayout">
    <div class="login_page">
      <div class="login_page_right" />
      <div class="login_page_form">
        <div class="login_page_form_title">
          <img class="login_page_form_title_logo" src="../../assets/logo.svg" alt="">
          <p class="login_page_form_title_p"> {{ $t('login.title') }}</p>
          <lang-select class="set-language" />
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" autocomplete="off" label-position="left">
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              prefix-icon="el-icon-user"
              name="username"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-key"
              type="password"
              :placeholder="$t('login.password')"
              name="password"
              autocomplete="off"
              :show-password="true"
            />
          </el-form-item>
          <el-form-item prop="code" class="code-input">
            <el-input
              ref="code"
              v-model="loginForm.code"
              prefix-icon="el-icon-lock"
              :placeholder="$t('login.code')"
              name="code"
              type="text"
              autocomplete="off"
              style="width: 60%"
              class="left"
              @keyup.enter.native="handleLogin"
            />
            <img
              v-if="imageCode"
              :src="imageCode"
              width="38%"
              height="100%"
              alt="请输入验证码"
              class="right"
              @click="getCodeImage()"
            >
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;" @click.native.prevent="handleLogin">
            {{ $t('login.logIn') }}
          </el-button>
        </el-form>
      </div>
      <div class="login_page_foot">
        <div class="copyright">&copy; {{ curYear }} <a target="_blank" href="https://gitee.com/qiao-jinbin/boss-rbac-cloud">DevinJoe</a> - BOSS</div>
      </div>
    </div>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import db from '@/utils/localstorage'
import { randomNum } from '@/utils'
import axios from 'axios'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    return {
      curYear: 0,
      codeUrl: `${process.env.VUE_APP_BASE_API}auth/captcha`,
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        password: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        code: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
      },
      loading: false,
      randomId: randomNum(24, 16),
      imageCode: ''
    }
  },
  created() {
    this.curYear = new Date().getFullYear()
  },
  mounted() {
    db.clear()
    this.getCodeImage()
  },
  methods: {
    getCodeImage() {
      axios({
        method: 'GET',
        url: `${this.codeUrl}?key=${this.randomId}`,
        responseType: 'arraybuffer'
      }).then(res => {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then((res) => {
        this.imageCode = res
      }).catch((e) => {
        if (e.toString().indexOf('429') !== -1) {
          this.$message({
            message: this.$t('tips.tooManyRequest'),
            type: 'error'
          })
        } else {
          this.$message({
            message: this.$t('tips.getCodeImageFailed'),
            type: 'error'
          })
        }
      })
    },
    handleLogin() {
      let username_c = false
      let password_c = false
      let code_c = false
      this.$refs.loginForm.validateField('username', e => { if (!e) { username_c = true } })
      this.$refs.loginForm.validateField('password', e => { if (!e) { password_c = true } })
      this.$refs.loginForm.validateField('code', e => { if (!e) { code_c = true } })
      if (username_c && password_c && code_c) {
        this.loading = true
        const that = this
        this.$login('auth/oauth/token', {
          ...that.loginForm,
          key: this.randomId
        }).then((r) => {
          const data = r.data
          this.saveLoginData(data)
          this.getUserDetailInfo()
        }).catch((error) => {
          console.error(error)
          that.loading = false
          that.getCodeImage()
        })
      }
    },
    saveLoginData(data) {
      this.$store.commit('account/setAccessToken', data.access_token)
      this.$store.commit('account/setRefreshToken', data.refresh_token)
      const current = new Date()
      const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
      this.$store.commit('account/setExpireTime', expireTime)
    },
    getUserDetailInfo() {
      this.$get('auth/user').then((r) => {
        this.$store.commit('account/setUser', r.data.principal)
        this.$message({
          message: this.$t('tips.loginSuccess'),
          type: 'success'
        })
        this.loading = false
        this.$router.push('/')
      }).catch((error) => {
        this.$message({
          message: this.$t('tips.loginFail'),
          type: 'error'
        })
        console.error(error)
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
#loginLayout {
  .el-input--suffix .el-input__inner {
    padding-right: 30px;
    height: 42px !important;
    font-size: 14px;
  }
  .el-input__inner {
    height: 42px !important;
    line-height: 42px;
  }
}
</style>
<style lang="scss" scoped>
@import "login";
</style>
