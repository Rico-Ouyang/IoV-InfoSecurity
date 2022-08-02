export default {
    state: {
        isCollapse: false //state存储数据，这里是导航展开状态
    },
    mutations: {
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse  //mutations用于操作数据state
        }
    }
}
