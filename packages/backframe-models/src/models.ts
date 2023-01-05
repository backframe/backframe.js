export interface AuthUser {
  id?: string;
  role?: string;
  email: string;
  name?: string;
  provider?: string;
  providerID?: string;
  passwordHash?: string;
}

// model used to store authenticated users
export type User = {
  id: string;
  role: string;
  email: string;
  name?: string;
  provider?: string;
  providerID?: string;
  passwordHash?: string;
};

// model used to store user sessions
export type Session = {
  id: string;
  userID: string;
  expires: Date;
  sessionToken: string;
  accessToken: string;
  accessTokenExpires: Date;
};

// model used for storing logs
export type Log = {
  id: string;
  userID: string;
  type: string;
  message: string;
  timestamp: Date;
};

// model for storing env vars
export type Env = {
  id: string;
  key: string;
  value: string;
};

// model for storing server analytics
export type Analytics = {
  id: string;
  timestamp: Date;
  type: string;
  data: string;
};
