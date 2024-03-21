import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface IAdminHeaderState {
  headerTitle: string;
}

const initialState: IAdminHeaderState = {
  headerTitle: '',
};

export const AdminHeaderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({ headerTitle, ...store }) => ({
    getHeaderTitle() {
      return headerTitle;
    },

    updateHeaderTitle(toggleSidebarTerm: string) {
      const updateToggleSidebar = toggleSidebarTerm;
      patchState(store, { headerTitle: updateToggleSidebar });
    },
  }))
);
