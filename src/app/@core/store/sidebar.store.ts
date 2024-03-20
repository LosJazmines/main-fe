import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { map } from 'rxjs';

export interface ISidebarState {
  toggleSidebar: boolean;
}

const initialState: ISidebarState = {
  toggleSidebar: true,
};

export const SidebarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({ toggleSidebar, ...store }) => ({
    getToggleSidebar() {
      return toggleSidebar;
    },

    updateToggleSidebar(toggleSidebarTerm: boolean) {
      const updateToggleSidebar = toggleSidebarTerm;
      patchState(store, { toggleSidebar: updateToggleSidebar });
    },
  }))
);
