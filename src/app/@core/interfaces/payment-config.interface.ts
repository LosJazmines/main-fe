export interface IPaymentConfig {
  active: boolean;
  created_at: string;
  data_config: {
    access_token?: string;
    public_key?: string;
    client_id?: string;
    [key: string]: any;
  };
  id: number;
  name: string;
  payment_provider: string;
  payment_provider_id: number;
  producer_id: number;
} 