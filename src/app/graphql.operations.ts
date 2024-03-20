import { gql } from 'apollo-angular';

const GET_ORDERS = gql`
  query {
    orders {
      id
      phone
      toName
      address
      addressNumber
      city
      PostalCode
      deliveryDate
      deliveryTime
      description
    }
  }
`;

export { GET_ORDERS };
