<template>
  <div class="container">
    <el-alert
      type="success"
    >
      <!-- <p>账户ID: {{ accountId }}</p>
      <p>用户名: {{ userName }}</p> -->
      <!-- <div id="container1"></div> -->
      <div>
        <p v-if="currentAddress == ''" style="width: 400px">点击获取当前位置</p>
        <p v-else style="width: 400px">{{ currentAddress }}</p>
        <el-button size="mini" icon="el-icon-refresh" @click="getditu">刷新位置</el-button>
      </div>
    </el-alert>
    <!-- <div v-if="sellingList.length==0" style="text-align: center;">
      <el-alert
        title="查询不到数据"
        type="warning"
      />
    </div> -->
    <el-form ref="accidentForm" :inline="true" :model="accidentForm" :rules="rules" class="demo-form-inline">
      <el-form-item label="事故类型" prop="accidentType">
        <el-select v-model="accidentForm.accidentType" placeholder="事故类型">
          <el-option label="追尾" value=1></el-option>
          <el-option label="堵车" value=2></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事故地址" prop="address">
        <el-tooltip class="item" effect="light" :content="accidentForm.address" placement="bottom-start">
          <el-input
            v-model="accidentForm.address"
            placeholder="刷新获取当前位置">
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="事故报告人" prop="userID">
        <el-input v-model="accidentForm.userID" placeholder="事故报告人" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="time">
        <el-input v-model="accidentForm.userID" placeholder="事故报告人" :disabled="true"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitReport('accidentForm')">报告</el-button>
      </el-form-item>
    </el-form>

    <el-row v-loading="loading" :gutter="20">
      <!-- sellingList -->
      <el-col v-for="(val,index) in allAccidents" :key="index" :span="6" :offset="1">
        <el-card class="all-card">
          <div slot="header" class="clearfix">
            <span>交通事故</span>
          </div>
          <div class="item">
            <el-tag type="danger">事故类型： </el-tag>
            <span>{{ val.accident_type }}</span>
          </div>
          <div class="item">
            <el-tag type="warning">事故地址： </el-tag>
            <span>{{ val.address }}</span>
          </div>
          <div class="item" v-if="roles[0] == 'admin'">
            <el-tag type="success">事故ID： </el-tag>
            <span>{{ val.accident_id }}</span>
          </div>
          <div class="item" v-if="roles[0] == 'admin'">
            <el-tag type="warning">事故报告人ID： </el-tag>
            <span>{{ val.reporter_id }}</span>
          </div>
          <div class="item">
            <el-tag type="info">创建时间: </el-tag>
            <span>{{ val.time }}</span>
          </div>
          <div class="item">
            <el-tag v-if="val.helpNum == ''" effect="light">
              暂无人发现相同事故
            </el-tag>
            <el-tag v-else effect="light">
              已有{{ val.helpNum }}人发现事故
            </el-tag>
            <el-button
              v-if="roles[0] !== 'admin'"
              style="padding: 5px; margin: 0 10px;"
              type="primary"
              round
              icon="el-icon-s-help"
              @click="helpAccident(val)"
            >
              {{ helpState }}
            </el-button>
          </div>
          <!-- <div style="width:100%; margin-bottom: 10px; align-items: center;">
            <el-button v-if="roles[0] !== 'admin'" style="padding: 3px 0" type="text" icon="el-icon-s-help" @click="helpAccident(val)">帮他一下</el-button>
          </div> -->
          <div
            v-if="roles[0] !== 'admin'"
            style="margin: 30px 0 0 0"
          >
            <el-alert
              title="⚠️  道路千万条，安全第一条！⚠️请安全行车，注意行车规范!"
              type="error"
              :closable="false">
            </el-alert>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { queryRealEstateList } from '@/api/realEstate'
import { queryAllAccidents } from '@/api/accident2'
// import { querySellingList, createSellingByBuy, updateSelling } from '@/api/accident'
import MapLoader from '../../../utils/gaode'
import axios from 'axios'

export default {
  name: 'recentAccident',
  data() {
    return {
      loading: true,
      currentAddress: '',
      allAccidents: [],
      // 表单数据
      accidentForm: {
        userID: null,
        accidentType: null,
        address: null,
        time: null
      },
      helpState: '帮他一下',
      // 表单规则
      rules: {
        userID: [
          { required: true, trigger: 'blur' }
        ],
        accidentType: [
          { required: true, message: '请选择事故类型', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请刷新获取位置', trigger: 'blur' }
        ],
        time: [
          { required: true, trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
    ])
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getditu()
    this.getTime()
    // this.accidentForm.userID = this.accountId
  },
  methods: {
    getList() {
      this.loading = true
      axios.post('http://192.168.239.1:8089/user/accident/all').then(response => {
      if (response !== null) {
        this.allAccidents = response.data.items
        this.loading = false
      }
      })
      queryAllAccidents().then(response => {
      if (response !== null) {
        this.allAccidents = response.data.items
        this.loading = false
      }
      })
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getTime() {
      const dt = new Date()
      var y = dt.getFullYear()
      var mt = (dt.getMonth() + 1).toString().padStart(2, '0')
      var day = dt.getDate().toString().padStart(2, '0')
      var h = dt.getHours().toString().padStart(2, '0')
      var m = dt.getMinutes().toString().padStart(2, '0')
      var s = dt.getSeconds().toString().padStart(2, '0')
      this.accidentForm.time = y + '-' + mt + '-' + day + ' ' + h + ':' + m + ':' + s
      console.log('此刻时间', this.nowtime)
    },

    submitReport(accidentForm) {
      // this.getTime()
      // validate校验表单
      this.$refs[accidentForm].validate(valid => {
        // 验证通过就提交表单
        if (valid) {
          // postRequest postAccidentReport
          axios.post('https://ef559e4d-59b5-45b3-86af-a9391c4820b2.mock.pstmn.io/accidentReport', this.accidentForm)
            .then(response => {
              if (response !== null) {
              this.sellingList = response
            }
            this.loading = false
            }).catch(_ => {
              this.loading = false
            })
          console.log('submit!')
        } else {
            console.log('error submit!!')
            return false
          }
      })
    },
    //   postRequest('/accidentReport',this.formInline).then(response => {
    //     if (response !== null) {
    //     this.sellingList = response    //////////改到了这里            ！！！！！！！！！！！！！！！！
    //   }
    //   this.loading = false
    //   }).catch(_ => {
    //     this.loading = false
    //   })
    // },
    getditu() {
      let that = this;
      MapLoader().then(AMap => {
        // var map = new AMap.Map("container1", {
        //   resizeEnable: true
        // });
        AMap.plugin("AMap.Geolocation", function() {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：5s
            buttonPosition: "RB", //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
          });
          geolocation.getCurrentPosition(function(status, result) {
            if (status == "complete") {
              that.onComplete(result);//成功的结果
            } else {
              that.onError(result);
            }
          });
        });
      });
    },
    //解析定位结果
    onComplete(data) {
      var that = this;
      that.amaplist = data.position;
      that.getlist();//获取到经纬度调用.
    },
     //解析定位错误信息
    onError(data) {
      Toast(data.message);
    },
    getlist() {
      var that = this;
      let lng = that.amaplist.lng;
      let lat = that.amaplist.lat;
      this.amapvalie = lng + "," + lat;// 上面得到的是对象类型的 改为字符串
      console.log(this.amapvalie)
      axios.get("https://restapi.amap.com/v3/assistant/coordinate/convert?locations="+this.amapvalie+"&coordsys=gps&output=json&key=7687a8173c96cde78a9ef3cd1e534299")
        .then(function (response) {
          var data = response;
          console.log(data);
          var param = data.locations
          axios.get("https://restapi.amap.com/v3/geocode/regeo?output=jason&location=" + param + "&key=7687a8173c96cde78a9ef3cd1e534299&radius=1000&extensions=all")
          .then(function (response) {
            console.log(response)
            // var roads = response.regeocode.roads
            // console.log(roads);
            // that.currentAddress = roads[0]  // 道路列表的第一项
            that.currentAddress = response.regeocode.formatted_address
            that.accidentForm.address = that.currentAddress
          })
          .catch(function (error) {
            console.log(error);
          });
        }).catch(function (error) {
          console.log(error);
        })
    },

    helpAccident(val){
      this.helpState = '已帮忙'
    }
  }
}

</script>

<style>
  .demo-form-inline{
    margin: 20px 0 0px 0
  }
  #container1 {
    width: 300px;
    height: 300px;
  }
  .container{
    width: 100%;
    text-align: center;
    min-height: 100%;
    overflow: hidden;
  }
  .tag {
    float: left;
  }
  .item {
    font-size: 14px;
    margin-bottom: 18px;
    color: #999;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
  }
  .clearfix:after {
    clear: both
  }

  .all-card {
    width: 280px;
    height: 380px;
    margin: 18px;
  }
</style>
