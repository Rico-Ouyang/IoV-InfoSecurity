<!-- <template>
  <div>
    <BarChart title="Bar Chart" xKey="name" yKey="amount" :data="barChartData"/>
  </div>
</template>

<script>
import BarChart from "../../components/BarChart.vue";

export default {
  name: "AccessControl",
  components: {
    BarChart
  },
  data: () => ({
    barChartData: [
      {
        name: "张三",
        amount: 25
      },
      {
        name: "李四",
        amount: 40
      },
      {
        name: "老王",
        amount: 15
      },
      {
        name: "老赖",
        amount: 9
      }
    ]
  })
};
</script>

<style>
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #282f36;
  margin-top: 30px;
}
</style> -->

<template>
  <!-- 操作员管理：当前页面非登录用户的操作员权限管理 -->
  <div>
    <div>
      <!-- 搜索框 -->
      <div style="display:flex; justify-content: center; margin-top: 10px">
        <el-input placeholder="通过用户名搜索用户"
                    prefix-icon="el-icon-search"
                    style="width:400px;margin-right: 10px;"
                    v-model="keywords">
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      </div>
    </div>
    <div class="admin-container">
    <!-- 操作员卡片 -->
      <el-card class="admin-card" v-for="(admin, index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{admin.name}}</span>
          <el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete"
                      @click="deleteAdmin(admin)">
          </el-button>
       </div>
        <div>
          <div class="img-container">
            <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userface-img">
          </div>
        </div>
        <div class="userinfo-container">
          <div>用户名: {{admin.name}}</div>
          <div>手机号码： {{admin.phone}}</div>
          <div>电话号码： {{admin.telephone}}</div>
          <div>地址： {{admin.address}}</div>
          <div>用户状态： 
            <el-switch
                  v-model="admin.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="enabledChange(admin)"
                  ctive-text="启用"
                  inactive-text="禁用">
            </el-switch>
          </div>
          <div>
            用户角色： 
              <el-tag type="success" v-for="(role, index) in admin.roles" :key="index"
                style="margin-right: 4px">{{role.nameZh}}</el-tag>
              <!-- 弹出框显示角色列表 -->
              <el-popover
                placement="bottom"
                title="角色列表"
                width="200"
                @show="showPop(admin)"
                @hide="hidePop(admin)"
                trigger="click">
                <!-- 选择器选择角色列表进行修改,value是选中的数据
                  multiple启用多选，v-model绑定当前选中值组成的数组
                  selectedRoles存的是角色的id   ：value绑定的id :label="r.nameZh绑定显示的选项名字-->
                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                  <el-option
                    v-for="(r, index) in allRoles"
                        :key="index"
                        :label="r.nameZh"
                        :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
              </el-popover>
          </div>
          <div>
              备注： {{admin.remark}}
          </div>
        </div>
      </el-card>
    </div>
  </div> 
</template>
<script>
// @ is an alias to /src
export default {
  name: 'AccessControl',
  data() {
        return {
            // 所有操作员
            admins: [],
            // 绑定搜索输入框内容
            keywords: '',
            // 所有的角色
            allRoles: [],
            // 角色选中数组
            selectedRoles: []
        }
    },
    methods: {
        // 弹出框消失时触发
        hidePop(admin) {
            // roles中拿去存拷贝的一个个的角色对象
            let roles = [];
            // 拷贝admin.roles到roles数组
            Object.assign(roles, admin.roles)
            // flag为true时,角色有进行过修改
            let flag = false;
            // 判断拥有的角色数量是否与选中的角色相同
            if (roles.length != this.selectedRoles.length) {
                // 数量不同,flag设为true
                flag = true;
            } else {
                // 数量相同,再进行比较是否id相同
                for (let i =0; i < roles.length; i++) {
                    // 单独拿出用户角色对象与选中的角色对象挨个比较
                    let role = roles[i];
                    for (let j =0; j < this.selectedRoles.length; j++) {
                        let sr = this.selectedRoles[j]
                        if (role.id == sr) {
                            // 如果相同,就从roles删除
                            roles.splice(i, 1);
                            // 避免删除角色后出现遗漏的判断
                            i--;
                            break;
                        }
                    }
                }
                // roles数量和selectedRoles数量相同时,上面的循环会删除roles中与selectedRoles重复的角色,
                // 如果没删完,说明选中的角色还有与原来角色不一样的角色,flag设为true,提交修改角色请求
                if (roles.length != 0) {
                    flag = true;
                }
            }

            // 更新角色提交请求
            if (flag) {
                // 根据选中项,拼接请求地址
                let url = '/system/admin/role?adminid='+admin.id;
                this.selectedRoles.forEach ( sr => {
                    url += '&rids=+sr'
                })
                // 地址完成后发送修改请求
                this.putRequest(url).then( resp => {
                    if (resp) {
                        this.initAdmins()
                    }
                })
            }
        },
        // 展示当前角色列表，及所有可选角色,弹出框展示时触发
        showPop(admin) {
            this.initAllRoles();
            // 拿到当前操作员所有的角色，是一个对象
            let roles = admin.roles;
            this.selectedRoles = []
            roles.forEach(r => {
                this.selectedRoles.push(r.id)                
            });
        },
        // 初始化获取角色列表
        initAllRoles() {
            this.getRequest('/system/admin/roles').then( resp => {
                if (resp) {
                    this.allRoles = resp;
                }
            })
        },
        enabledChange(admin) {
            this.putRequest('/system/admin/',admin).then( resp => {
                if (resp) {
                    this.initAdmins()
                }
            })
        },
        deleteAdmin(admin) {
            /* 防止误操作 */
            this.$confirm('此操作将永久删除操作员:'+'“'+admin.name+'”'+', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            /* 发送删除请求 */
            this.deleteRequest('/system/admin/'+admin.id).then(resp=>{
                if (resp) {
                /* 初始化更新职位 */
                this.initAdmins()
                }
            })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // 搜索具体是在后端进行
        doSearch() {
            this.initAdmins()
            /* this.keywords = '' */
        },
        initAdmins() {
            this.getRequest('/system/admin/?keywords='+this.keywords).then(resp => {
                if (resp) {
                    this.admins = resp;
                }
            })
        }
    },
    mounted() {
        this.initAdmins()
    }
}
</script>

<style>
.admin-container {
    display: flex;
    justify-content: space-around;
    /* 自动换行 */
    flex-wrap: wrap;
    margin-top: 15px;
}
.admin-card {
    width: 350px;
    margin-bottom: 20px;
}
.userface-img {
    width: 72px;
    height: 72px;
    border-radius: 72px;
}
.img-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
.userinfo-container {
    font-size: 14px;
    color: cornflowerblue;
}
</style>
