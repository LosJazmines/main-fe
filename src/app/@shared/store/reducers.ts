import { ActionReducerMap } from '@ngrx/store';
import {
  leftSidebarReducer,
  LeftSidebarState,
} from '../components/sidebars/left-sidebar/store/reducers/left-sidebar.reducer';
import {
  rightSidebarReducer,
  RightSidebarState,
} from '../components/sidebars/right-sidebar/store/reducers/right-sidebar.reducer';

import { userReducer, UserState } from './reducers/user.reducer';
import { IStepperState, stepperReducer } from './reducers/stepper.reducer';
import { leftSidebarFilterReducer, LeftSidebarFiltersState } from '@shared/components/sidebars/left-sidebar-filters/store/reducers/left-sidebar-filters.reducer';

export interface AppState {
  leftSidebarFilters: LeftSidebarFiltersState;
  leftSidebar: LeftSidebarState;
  rightSidebar: RightSidebarState;
  stepper: IStepperState;
  currentUser: UserState;

}

export const reducers: ActionReducerMap<AppState> = {
  leftSidebarFilters: leftSidebarFilterReducer,
  leftSidebar: leftSidebarReducer,
  rightSidebar: rightSidebarReducer,
  stepper: stepperReducer,
  currentUser: userReducer,
};
