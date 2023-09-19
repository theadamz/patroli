export enum Actor {
  OPERATOR = "operator",
  OFFICER = "officer",
  CITIZEN = "citizen",
}

export type UserInfo = {
  public_id: string;
  email: string;
  name: string;
  actor: Actor;
  role_code: string;
  role_name: string;
};

export interface AuthState {
  user: UserInfo | null;
  _rt: string | null; // refresh token
  _at: string | null; // access token
  _cf: string | null; // csrf token
}

enum Platform {
  WEB = "web",
  MOBILE = "mobile",
}

export type LoginRequest = {
  email: string;
  password: string;
  platform: Platform;
};

export type LoginResponse = {
  public_id: string;
  email: string;
  name: string;
  actor: Actor;
  role_code: string;
  role_name: string;
  token: {
    refresh?: string | null;
    access?: string | null;
    csrf?: string | null;
  };
};
