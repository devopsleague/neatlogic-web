const refresh = () => import('@/views/pages/common/refresh.vue');
const page404 = () => import('@/views/pages/common/404.vue');
const welcome = () => import('@/views/pages/common/welcome.vue');
const baseSettings = () => import('@/views/pages/dr/base-settings/base-settings.vue');
const serviceManage = () => import('@/views/pages/dr/service/service-manage.vue');
const serviceDetail = () => import('@/views/pages/dr/service/service-detail.vue');
const serviceAdd = () => import('@/views/pages/dr/service/service-add.vue');
const organizationalStructureManage = () => import('pages/dr/organizational-structure/organizational-structure-manage.vue');

import { $t } from '@/resources/init.js';

let routerArr = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      let defaultPage = '';
      try {
        const moduleList = JSON.parse(localStorage.getItem('moduleList'));
        defaultPage =
          moduleList.find(module => {
            return module.moduleId === MODULEID;
          }).defaultPage || '/welcome';
      } catch {
        defaultPage = '/welcome';
      }
      if (from.path === defaultPage) {
        //通过跳转到中间路由,并立刻返回原路由,实现刷新路由页面的效果
        next({ name: 'refresh', replace: true, query: { path: defaultPage } });
      } else {
        next({ path: defaultPage, replace: true });
      }
    }
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: refresh
  },
  {
    path: '/404',
    name: '404',
    component: page404,
    meta: {
      title: $t('page.pagenotvalid')
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/service-manage',
    name: 'service-manage',
    component: serviceManage,
    meta: {
      title: $t('router.dr.servicemanage'),
      ismenu: true,
      icon: 'tsfont-file-single',
      type: 'dr',
      authority: 'DR_BASE'
    }
  },
  {
    path: '/service-detail',
    name: 'service-detail',
    component: serviceDetail,
    meta: {
      title: $t('router.dr.servicedetail'),
      ismenu: false,
      type: 'dr',
      authority: 'DR_BASE'
    }
  },
  {
    path: '/service-add',
    name: 'service-add',
    component: serviceAdd,
    meta: {
      title: $t('router.dr.servicemanage'),
      ismenu: false,
      type: 'dr',
      authority: 'DR_BASE'
    }
  },
  {
    path: '/organizational-structure-manage',
    name: 'organizational-structure-manage',
    component: organizationalStructureManage,
    meta: {
      title: $t('term.dr.organizationalstructure'),
      ismenu: true,
      icon: 'tsfont-proxy',
      type: 'dr',
      authority: 'DR_BASE'
    }
  },
  {
    path: '/base-settings',
    name: 'base-settings',
    component: baseSettings,
    meta: {
      title: $t('router.dr.basicsetting'),
      ismenu: true,
      icon: 'tsfont-setting',
      type: 'dr',
      authority: 'DR_BASE'
    }
  }
];
export default routerArr;
