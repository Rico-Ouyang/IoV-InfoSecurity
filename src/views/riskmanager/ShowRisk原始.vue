<template>
  <div class="myDiv">
      <div class="neojsshow">
        <div id="viz" class="neojs" />
      </div>
      Cypher query: <textarea rows="4" cols=100 id="cypher" v-model="cypher" placeholder="请输入cypher查询语句">
      </textarea><br>
      <input type="submit" value="Submit" id="reload" @click="submit">
      <input type="submit" value="Stabilize" id="stabilize" @click="stabilize">
      <br>
      MATCH p=(a:sources)-[r:RATE_TO]->(b:objects{name:"268"}) RETURN p
  </div>
</template>

<script>


export default {
  name: 'ShowRisk',
  data() {
    return {
      cypher: '',
      index: 0, // neo4j
      viz: null,
      config:  
      {
        container_id: "viz",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "123456789",
        labels: {
          "objects": {
              "caption": "name", // 用作节点的标题名的属性名
              "size": "pagerank",
              /* "community": "#c0a378", */
              "title_properties": [
                  "name",
                  "avgScore"
              ]
          },
          "sources": {
              "caption": "name",
              "size": "pagerank",
              /* "community": "community", */
              "title_properties": [
                  "name",
                  "score"
              ]
          }
        },
        relationships: {
            "RATE_TO": {
                "thickness": "light",
                "caption": "type"
            }
        },
        initial_cypher: "MATCH p=()-[r:RATE_TO]->(o:objects) WHERE o.avgScore > 8 RETURN p"
      },
      // {
      //   containerId: 'viz',
      //   neo4j: {
      //     serverUrl: 'bolt://127.0.0.1:7687',
      //     serverUser: 'neo4j',
      //     serverPassword: '123456789'
      //   },
      //   visConfig: { // 全局设置
      //     layout: {
      //       improvedLayout: true,
      //       clusterThreshold: 5000
      //     },
      //     nodes: {
      //       margin: 20,
      //       font: {
      //         size: 18,
      //         color: '#fff',
      //         background: 'none',
      //         strokeColor: 'transparent'
      //       },
      //       shape: 'circle', // 节点方式
      //       shapeProperties: {
      //         borderRadius: 80 // only for box shape
      //       },
      //       widthConstraint: { // 宽高
      //         minimum: 80,
      //         maximum: 80
      //       },
      //       heightConstraint: {
      //         minimum: 80
      //       }
      //     },
      //     physics: {
      //       barnesHut: {
      //         springConstant: 0.1,
      //         gravitationalConstant: -100000,
      //         centralGravity: 0.5,
      //         avoidOverlap: 1 // 节点不重复
      //       }
      //     },

      //     edges: {
      //       width: 0.1,
      //       arrows: {
      //         to: { enabled: true }
      //       },
      //       length: 300,
      //       font: {
      //         color: '#fff',
      //         size: 14, // px
      //         background: '#051f36',
      //         strokeWidth: 0 // px
      //       }
      //       // smooth: false // 直线, 设置为直线时会影响多线相连的问题
      //     }
      //   },
      //   initialCypher: 'MATCH p=()-->() RETURN p LIMIT 100'
      // },
      colorObj: [ // 一些默认的颜色
        {
          border: '#c0a378',
          background: '#d9c8ae'
        },
        {
          border: '#eb2728',//'#2870c2',
          background: '#4c8eda'
        },
        {
          border: '#eb2728',
          background: '#f16667'
        },
        {
          border: '#dd7c9f',
          background: '#ecb5c9'
        },
        {
          border: '#5db665',
          background: '#8dcc93'
        },
        {
          border: '#c0a378',
          background: '#d9c8ae'
        }
      ], // 颜色数组
    }
  },
  mounted() {
    this.neojs()
  },
  methods:{
      neojs() {
      const that = this
      const nodesArray = [] // 动态取出neo4j通过语句查询的节点集群
      const labelsArr = [] // 节点群
      const edgesArr = [] // 边对象
      this.viz = new NeoVis.default(this.config)
      window.slm = this.viz
      const eno4jObject = this.viz
      this.viz.render()
      that.viz.registerOnEvent('completed', (ab) => { // Your after render code here
        console.log(ab)
        /**
         * 处理节点拖到问题
         */
        this.viz.network.on('dragEnd', function(params) {
          for (var i = 0; i < params.nodes.length; i++) {
            var nodeId = params.nodes[i]
            eno4jObject.nodes.update({ id: nodeId, fixed: { x: true, y: true }})
            console.log('结束')
          }
        })
        eno4jObject.network.on('dragStart', function(params) {
          for (var i = 0; i < params.nodes.length; i++) {
            var nodeId = params.nodes[i]
            eno4jObject.nodes.update({ id: nodeId, fixed: { x: false, y: false }})
            console.log('开始')
          }
        })
        /**
         * 批量处理节点和边的问题
         */
        if (!this.config['labels']) {
          // nodes
          eno4jObject.nodes.forEach((a) => {
            if (nodesArray.indexOf(a.raw.labels[0]) === -1) {
              const color = Math.floor(Math.random() * 0xffffff).toString(16)
              this.colorObj.push(
                {
                  border: '#' + color + '6e',
                  background: '#' + color
                }
              )
              nodesArray.push(a.raw.labels[0])
              const hehe = a.raw.labels[0]
              
              const labels = {
                [hehe]: { // Application相当于一个集群组，节点组
                  [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                    function: {
                      title: (props) => NeoVis.objectToTitleHtml(props), // 鼠标移入显示的title
                      label: node => { // 节点中显示的label文字，用于截取
                        const label = `${node.properties.title ? node.properties.name : node.properties.name}`
                        return label.substring(0, 10) + '...'
                      }
                    },
                    static: { // 针对每一个节点组设置的样式或配置
                      borderWidth: 4, // 节点边框
                      borderWidthSelected: 4, // 点击或选中的节点边框
                      color: { // 自定义这个节点组的颜色
                        border: this.colorObj[this.index]['border'], // 边框颜色
                        background: this.colorObj[this.index]['background'], // 背景颜色
                        highlight: { // 点击时、选中
                          border: this.colorObj[this.index]['border'] // 点击时的边框
                        }
                      }
                    }
                  }
                }
              }
              labelsArr.push(labels) // 将对象加入到数组，方便统一管理
              this.index++ // 为了取颜色值
            }
          })
          // edges
          const edgesArrSmooth = []
          eno4jObject.edges.forEach((a, id) => {
            /**
             * 这段代码处理节点之间是直线或者是曲线问题
             */
            const wcm = `${a.to}, ${a.from}`
            const slm = eno4jObject.edges.get(a.id)
            if (edgesArrSmooth.indexOf(`${wcm}`) === -1) { // 等于-1，代表没有查找到数据，可以添加数据了
              edgesArrSmooth.push(wcm)
              slm.smooth = false // 并且允许直线的添加
            } else { // 如果有数据，则设置为动态的数据
              slm.smooth = true
            }
            eno4jObject.edges.setOptions({ // 使用setOptions()方法改变边的配置
              ...slm
            })
            /**
             * 下面是处理边（连线）上文字的描述显示和样式问题
             */
            const hehe = a.raw.type
            console.log(hehe)
            const relationships = { // 该配置是用于显示边上文字说明的配置
              [hehe]: {
                [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                  static: {
                    label: hehe,
                    font: {
                      align: 'middle'
                    }
                  }
                }
              }
            }
            edgesArr.push(relationships) // 将对象加入到数组，方便统一管理
          })

          this.config['labels'] = Object.assign(...labelsArr) // 动态节点组
          this.config['relationships'] = Object.assign(...edgesArr) // 动态边组
          console.log(window.slm.nodes, '哈哈渲染成功')
          // this.viz.clearNetwork()
          this.viz.reinit(this.config) // 重新加载新的配置
          // this.viz.reload() // 重绘
        } else {
          console.log('已发生重绘')
        }
      })
    },
    submit() {
      console.log(this.cypher)
      this.config.initial_cypher = this.cypher;
      console.log(this.config.initial_cypher)
      this.neojs();
    }
  }
}
</script>
<style lang="less" scoped>
.myDiv {
    width: 100%;
    height: 100%;
}
textarea {
    border: 1px solid lightgray;
    margin: 5px;
    border-radius: 5px;
}
#viz {
    width: 100%;
    height: 70vh;
    border: 1px solid #f1f3f4;
    font: 22pt arial;
    background-color: #ffffff7e;
}
input {
    border: 1px solid #ccc;
}
</style>


<!-- <template>
  <div class="about">
    <h1>This is a ShowRisk page</h1>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'ShowRisk',
};
</script> --
