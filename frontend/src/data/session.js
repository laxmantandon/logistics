import router from '@/router'
import { computed, reactive, defineEmits } from 'vue'
import { createResource } from 'frappe-ui'

import { userResource } from './user'

const emit = defineEmits(['login_error'])

export function sessionUser() {
  const cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
  let _sessionUser = cookies.get('user_id')
  if (_sessionUser === 'Guest') {
    _sessionUser = null
  }
  return _sessionUser
}

export const session = reactive({
  login: createResource({
    url: 'login',
    makeParams({ email, password }) {
      return {
        usr: email,
        pwd: password,
      }
    },
    onSuccess(data) {
      userResource.reload()
      session.user = sessionUser()
      session.login.reset()
      // router.replace(data.default_route || '/')
      router.push('/')
    },
  }),
  signup: createResource({
    url: 'logistics.logistcs.api.signup',
    makeParams({ email, full_name, new_password }) {
      return {
        email: email,
        full_name: full_name,
        new_password: new_password,
        redirect_to: "/frontend"
      }
    },
    onSuccess(data) {
      router.replace('/')
    },
  }),
  logout: createResource({
    url: 'logout',
    onSuccess() {
      userResource.reset()
      session.user = sessionUser()
      router.replace({ name: 'Login' })
    },
  }),
  user: sessionUser(),
  isLoggedIn: computed(() => !!session.user),
})
