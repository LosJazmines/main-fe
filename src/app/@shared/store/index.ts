import { ActionReducerMap } from '@ngrx/store';
import * as fromUser from './reducers/user.reducer';
import * as fromOrder from './reducers/order.reducer';
import * as fromLeftSidebar from '../components/sidebars/left-sidebar/store/reducers/left-sidebar.reducer';
import * as fromRightSidebar from '../components/sidebars/right-sidebar/store/reducers/right-sidebar.reducer';
import * as fromLeftSidebarFilters from '../components/sidebars/left-sidebar-filters/store/reducers/left-sidebar-filters.reducer';

export interface AppState {
  currentUser: fromUser.State;
  order: fromOrder.OrderState;
  leftSidebar: fromLeftSidebar.LeftSidebarState;
  rightSidebar: fromRightSidebar.RightSidebarState;
  leftSidebarFilters: fromLeftSidebarFilters.LeftSidebarFiltersState;
}

export const reducers: ActionReducerMap<AppState> = {
  currentUser: fromUser.userReducer,
  order: fromOrder.orderReducer,
  leftSidebar: fromLeftSidebar.leftSidebarReducer,
  rightSidebar: fromRightSidebar.rightSidebarReducer,
  leftSidebarFilters: fromLeftSidebarFilters.leftSidebarFilterReducer
};

export * from './store';

export * as UserActions from './actions/user.actions';
