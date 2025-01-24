import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

const getUserFeatureState = createFeatureSelector<UserState>('currentUser');

export const selectUser = createSelector(
  getUserFeatureState,
  (state: UserState) => state.currentUser
);

export const selectUserRoles = createSelector(selectUser, (user) =>
  user ? user.info.roles : []
);

export const selectIsAdmin = createSelector(selectUserRoles, (roles) =>
  roles.includes('ADMIN')
);

export const selectIsRoot = createSelector(selectUserRoles, (roles) =>
  roles.includes('ROOT')
);

export const getUserState = createSelector(
  getUserFeatureState,
  (state) => state
);

export const getActiveProducer = createSelector(
  getUserFeatureState,
  (state) => state.activeProducer
);

export const getActiveProducerMembers = createSelector(
  getActiveProducer,
  (activeProducer) => (activeProducer ? activeProducer.members : [])
);

export const isProducerMember = createSelector(
  getActiveProducer, // Selector para obtener el `activeProducer`
  (activeProducer) => {
    if (!activeProducer || !activeProducer.members) {
      return false;
    }
    // Si existe un miembro cuyo nombre sea 'member', se considera miembro
    return activeProducer.members.some(
      (member: { name: string }) => member.name === 'member'
    );
  }
);

export const isProducerAdmin = createSelector(
  getActiveProducer, // Selector para obtener el `activeProducer`
  (activeProducer) => {
    if (!activeProducer || !activeProducer.members) {
      return false;
    }
    // Si existe un miembro cuyo nombre sea 'member', se considera miembro
    return activeProducer.members.some(
      (member: { name: string }) => member.name === 'admin'
    );
  }
);

export const isProducerOwner = createSelector(
  getActiveProducer, // Selector para obtener el `activeProducer`
  (activeProducer) => {
    if (!activeProducer || !activeProducer.members) {
      return false;
    }
    // Si existe un miembro cuyo nombre sea 'member', se considera miembro
    return activeProducer.members.some(
      (member: { name: string }) => member.name === 'owner'
    );
  }
);

export const getCurrentUser = createSelector(
  getUserFeatureState,
  (state) => state.currentUser
);

export const getActiveEvent = createSelector(getUserFeatureState, (state) => {
  return state.activeEvent;
});

export const selectIsAdminEvent = createSelector(getActiveEvent, (event) =>
  event.roles.includes('ADMIN')
);

export const selectIsOwnerEvent = createSelector(getActiveEvent, (event) =>
  event.roles.includes('OWNER')
);

export const getActiveEventRoles = createSelector(
  getActiveEvent,
  (activeEvent) => {
    return activeEvent && activeEvent.roles && activeEvent.roles.length > 0
      ? activeEvent.roles
      : [];
  }
);

export const getShoppingCart = createSelector(
  getUserFeatureState,
  (state) => state.shoppingCart
);
