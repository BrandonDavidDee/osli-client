export type StringOrNull = string | null;
export type NumberOrNull = number | null;

export interface TokenPayload {
  db_name: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  role_name: string;
  subscriber_id: number;
  subscriber_logo_url: string;
  subscriber_name: string;
  user_id: number;
  staff_member_id: number;
  username: string;
  is_admin: boolean;
}

export interface DecodedToken {
  exp: number;
  scopes: string[];
  sub: TokenPayload;
}
