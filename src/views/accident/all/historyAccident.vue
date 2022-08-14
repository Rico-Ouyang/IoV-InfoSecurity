<template>
  <div class="app-container" style="margin: 30px;">
    <!-- 过滤搜索  -->
    <div class="filter-container">
      <!-- 按事故类型查找 -->
      <el-select v-model="listQuery.accident_name" class="filter-item"  style="width: 130px" placeholder="事故类型" clearable>
        <el-option v-for="item in accidentOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 按事故地区查找 -->
      <el-select v-model="listQuery.address" class="filter-item" style="width: 130px; margin-left: 10px;" placeholder="事故地区" clearable>
        <el-option v-for="item in addressOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px; margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <!-- 按关键词查找 -->
      <el-input v-model="listQuery.user_id" placeholder="用户ID" style="width: 150px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- 按事故事件范围查找 -->
      <el-date-picker
        v-model="pickedDate"
        class="filter-item"
        style="margin-left: 10px; width: 300px"
        type="monthrange"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        value-format="yyyy-MM"
        @change="updatelistQueryDate(pickedDate)"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.search_date"
        class="filter-item"
        style="margin-left: 10px; width: 200px"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="按日期查找">
      </el-date-picker>
      <!-- 提交搜索 -->
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="historyAccidents"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="事故ID" prop="accident_id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.accident_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故日期" width="150px" align="center" prop="time" sortable="custom">
        <template slot-scope="{row}">
          <!-- <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故类型" prop="accident_type" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.accident_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故地址" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.address_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故报告人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态更新时间" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.update_time }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="事故处理" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->
          <el-button v-if="row.status!='已出警'" size="mini" type="warning" @click="handleModifyStatus(row,'已出警')">
            出警
          </el-button>
          <el-button v-if="row.status!='待处理'" size="mini" type="success" >
            已出警
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// 格式化时间parseTime，转为string格式
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { queryAllAccidents, updateStatus } from '@/api/accident'
// import { queryAllAccidents, updateStatus } from '@/api/accident2'


export default {
  name: 'historyAccident',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        已出警: 'success',
        待处理: 'danger'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      historyAccidents: [], // 用于从接口获取历史事故信息 
      pickedDate: '',  // 用于选择事件范围，拿去提取开始时间和结束时间
      // 时间选择器选项
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 表格的key
      tableKey: 0,
      // 事件总数
      total: 0,
      listLoading: true,
      // 查询的参数表
      listQuery: {
        page: 1,
        limit: 20,
        address: '',
        accident_name: '',
        sort: '+time',
        start_month: '',
        end_month: '',
        search_date: '',
        user_id: ''
      },
      // 搜索框事故类型选项
      accidentOptions: ['超车事故', '直行事故', '追尾事故', '其他事故'],
       // 搜索框地址选项
      addressOptions : [
        { key: '南岸区', display_name: '南岸区' },
        { key: '渝中区', display_name: '渝中区' },
        { key: '沙坪坝区', display_name: '沙坪坝区' },
        { key: '渝北区', display_name: '渝北区' },
        { key: '九龙坡区', display_name: '九龙坡区' }
      ],
      // sortOptions: [{ label: '时间升序', key: '+time' }, { label: '时间降序', key: '-time' }],
      // 控制出警确认按钮的dialog显示
      dialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    // 获取历史事故列表
    this.getList()
  },
  methods: {
    // 时间范围选择器change事件时触发，刷新查询列表的开始时间和结束时间
    updatelistQueryDate() {
      // 时间选择器选择的时间
      this.listQuery.start_month = this.pickedDate[0]
      this.listQuery.end_month = this.pickedDate[1]
    },
    // 获取所有事故信息和事故总数
    getList() {
      this.listLoading = true
      queryAllAccidents(this.listQuery).then(response => {
        this.historyAccidents = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 提交搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 出警按钮，更改出警状态
    handleModifyStatus(row, status) {
      this.$confirm('是否已对发生在 [ ' + row.address + ' ] 的' + row.accident_name + '出警？(事故ID:' + row.id + ')', '确认出警信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus({ accident_id: row.accident_id, status: status }).then( response => {
            if (response != '') {
              this.$message({
                type: 'success',
                message: '处理成功!'
              });
              // 变更改变之后的出警状态
              row.status = status
            } else {
              this.$message({
                type: 'danger',
                message: '出现错误！'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },

    // 排序按钮改变时触发
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'time') {
        this.sortByTime(order)
      }
    },
    sortByTime(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+time'
      } else {
        this.listQuery.sort = '-time'
      }
      // 提交搜索请求，刷新表格
      this.handleFilter()
    },

    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['time', 'accident_id', 'accident_name', 'address', 'user_id', 'status']
        const filterVal = ['time', 'accident_id', 'accident_name', 'address', 'user_id', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '交通事故列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.historyAccidents.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
