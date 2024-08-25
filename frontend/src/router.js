import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/EnquiryList.vue'),
  },
  {
    path: '/enquiry-list',
    name: 'EnquiryList',
    component: () => import('@/pages/EnquiryList.vue'),
  },
  {
    path: '/enquiry',
    name: 'Enquiry',
    component: () => import('@/pages/Enquiry.vue'),
  },
  {
    path: '/enquiry/:id',
    name: 'EnquiryEdit',
    component: () => import('@/pages/Enquiry.vue'),
  },
  {
    path: '/enquiry/duplicate/:id',
    name: 'EnquiryDuplicate',
    component: () => import('@/pages/Enquiry.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/frontend'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await userResource.promise
  } catch (error) {
    isLoggedIn = false
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'EnquiryList' })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
