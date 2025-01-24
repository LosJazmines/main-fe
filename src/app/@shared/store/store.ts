import { ActionReducerMap } from '@ngrx/store';
import {
  leftSidebarReducer,
  LeftSidebarState,
} from '../components/sidebars/left-sidebar/store/reducers/left-sidebar.reducer';
import {
  rightSidebarReducer,
  RightSidebarState,
} from '../components/sidebars/right-sidebar/store/reducers/right-sidebar.reducer';
import {
  leftSidebarAdminReducer,
  LeftSidebarAdminState,
} from '../components/sidebars/left-sidebar-filters/store/reducers/left-sidebar-admin.reducer';
import { userReducer, UserState } from './reducers/user.reducer';

export interface AppState {
  leftSidebarAdmin: LeftSidebarAdminState;
  leftSidebar: LeftSidebarState;
  rightSidebar: RightSidebarState;
  currentUser: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  leftSidebarAdmin: leftSidebarAdminReducer,
  leftSidebar: leftSidebarReducer,
  rightSidebar: rightSidebarReducer,
  currentUser: userReducer,
};
