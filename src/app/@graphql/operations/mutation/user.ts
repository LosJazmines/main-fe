import gql from 'graphql-tag';
import { USER_FRAGMENT } from '../fragment/user';

export const LOGIN_MUTATE = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        fullName
        email
        birthday
        roles
        isActive
      }
    }
  }
`;

// export const REGISTER_USER = gql
//   mutation addUser($user: UserInput!, $include: Boolean!) {
//     register(user: $user) {
//       status
//       message
//       user {
//         ...UserObject
//       }
//     }
//   }
//   ${USER_FRAGMENT}
// ;

// export const UPDATE_USER = gql
//   mutation updateUser($user: UserInput!, $include: Boolean!) {
//     updateUser(user: $user) {
//       status
//       message
//       user {
//         ...UserObject
//       }
//     }
//   }
//   ${USER_FRAGMENT}
// ;

// export const BLOCK_USER = gql
//   mutation blockUser($id: ID!, $unblock: Boolean, $admin: Boolean) {
//     blockUser(id: $id, unblock: $unblock, admin: $admin) {
//       status
//       message
//     }
//   }
// ;

// export const ACTIVE_EMAIL_USER = gql
//   mutation activarEmailUser($id: ID!, $email: String!) {
//     activeUserEmail(id: $id, email: $email) {
//       status
//       message
//     }
//   }
// ;

// export const ACTIVE_USER = gql
//   mutation activeUser($id: ID!, $birthday: String!, $password: String!) {
//     activeUserAction(id: $id, birthday: $birthday, password: $password) {
//       status
//       message
//     }
//   }
// ;
