<template>
  <el-dialog
    v-if="dialogVisible"
    title="更改头像"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <div class="avatars-container">
      <el-tabs>
        <el-tab-pane label="系统头像">
          <div class="grid">
            <el-radio v-for="avatar of localAvatars" :key="avatar" v-model="choosedAvatar" :label="avatar">
              <el-avatar :src="require('@/assets/avatars/'+avatar+'.png')" />
            </el-radio>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传头像">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :before-upload="beforeUploadAvatar"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-divider content-position="left">系统头像</el-divider> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="success" @click="changeAvatar">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import localAvatars from './local-avatars'

export default {
  name: 'ChangeAvatar',
  data() {
    return {
      localAvatars,
      fileList: [
        {
          name: 'rabbit.gif',
          url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
      ],
      dialogVisible: false,
      choosedAvatar: ''
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    showDialog() {
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.choosedAvatar = ''
    },
    changeAvatar() {
      if (this.choosedAvatar) {
        this.dialogVisible = false
        this.$emit('changeAvatar', this.choosedAvatar)
      } else {
        this.$message({
          message: '保存失败，没有选择任何头像',
          type: 'error'
        })
      }
    },
    beforeUploadAvatar(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      console.log(isJPGOrPNG)
      const isLessThan1M = file.size / 1024 / 1024 < 1
      if (!isJPGOrPNG) {
        this.$message({
          message: '上传的文件格式不符合要求',
          type: 'error'
        })
      }
      if (!isLessThan1M) {
        this.$message({
          message: '上传的文件大小超出限制',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatars-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  span {
      margin: 20px;
      text-align: right;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>

