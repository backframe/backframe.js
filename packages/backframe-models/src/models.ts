export type BaseModel = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface AuthAccount extends BaseModel {
  id?: string;
  userID?: string;
  provider: string;
  providerID: string;
  providerAccountID: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user: AuthUser;
}

export interface AuthSession extends BaseModel {
  id?: string;
  userID: string;
  expires?: Date;
  sessionToken: string;
  accessToken: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: AuthUser;
}

export interface AuthUser extends BaseModel {
  id?: string;
  role?: string;
  email: string;
  emailVerified?: Date;
  name?: string;
  imageURL?: string;
  password?: string;
  accounts?: AuthAccount[];
  sessions?: AuthSession[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthVerificationRequest extends BaseModel {
  id?: string;
  identifier: string;
  token: string;
  expires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

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
