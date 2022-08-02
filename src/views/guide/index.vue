<template>
  <div class="app-container">
    <aside>
      基于区块链的车联网用户信息安全系统使用指南
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      显示指南
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
