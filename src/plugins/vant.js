import {
  // Button,
  Tab,
  Tabs,
  Icon,
  PullRefresh,
  ShareSheet,
  List,
  Dialog,
  Cell,
  CellGroup,
  Divider,
  ActionSheet ,
  // Empty ,
  Area ,
  Search ,
  Popover ,
} from 'vant'

const components = [
  // Button,
  Tab,
  Tabs,
  Icon,
  PullRefresh,
  ShareSheet,
  List,
  Dialog,
  Cell,
  CellGroup,
  Divider,
  ActionSheet ,
  // Empty ,
  Area ,
  Search ,
  Popover 
]


/** 按需引入`vant` */
export function useVant(app) {
  // 全局注册组件
  components.forEach((component) => {
    app.component(component.name, component);
  });
}