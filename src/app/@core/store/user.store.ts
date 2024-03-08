import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface IUserState {
  currentUser: any;
}

const initialState: IUserState = {
  currentUser: '',
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({ currentUser, ...store }) => ({
    //
    addcurrentUser(currentUser: any) {
      const updateCurrentUser = currentUser;
      patchState(store, { currentUser: updateCurrentUser });
    },
  }))
);
