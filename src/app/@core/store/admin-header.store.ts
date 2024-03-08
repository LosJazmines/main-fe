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
      console.log({ updateToggleSidebar });

      patchState(store, { headerTitle: updateToggleSidebar });

      console.log({ headerTitle: headerTitle() });
    },
  }))
);
