import Vue from 'vue'
import Router from 'vue-router'

// 使用router
Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '',
    redirect: '/profile'
  },
  {
    path: '/home',
    component: () => import('views/home/Home'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/community',
    component: () => import('../views/community/Community'),
    meta: {
      title: '社区',
    }
  },
  {
    path: '/message',
    component: () => import('views/message/Message'),
    meta: {
      title: '会话'
    },
    children: [
      {
        path: '',
        redirect: 'attention'
      },
      {
        path: 'attention',
        component: () => import("views/message/Attention")
      },
      {
        path: 'chatlist',
        component: () => import("views/message/ChatList")
      },
      {
        path: 'notification',
        component: () => import("views/message/Notification")
      },
    ]
  },
  {
    path: '/profile',
    component: () => import('views/profile/Profile'),
    meta: {
      title: '个人'
    },
    children: [
      {
        path: '',
        redirect: 'main'
      },
      {
        path: 'main',
        component: () => import('views/profile/Main')
      },
      {
        path: 'login',
        component: () => import('views/profile/Login')
      },
      {
        path: 'register',
        component: () => import('views/profile/Register')
      },
      {
        path: 'account',
        component: () => import('views/profile/Account')
      }
    ]
  },
  {
    path: '/chat',
    component: () => import("views/chat/Chat"),
    meta: {
      title: '即时聊天'
    }
  },
  {
    path: '/works',
    component: () => import('views/home/Work'),
    meta: {
      title: '创作'
    }
  },
  {
    path: '/checkout',
    component: () => import('views/home/See'),
    meta: {
      title: '查看资料'
    }
  }
]

const router = new Router({
  routes,
  mode: 'history'
})

// 导出router
export default router

// 前置钩子
router.beforeEach(function (to, from, next) {
  document.title = to.matched[0].meta.title;
  next();
})

