export interface IStorageConfig {
  routes?: {
    route: string;
    fileKey: string;
  }[];
  destination?: string;
  engine?: "local" | "s3" | "gcs";
}

// TODO: Handle upload many
export const DEFAULT_CONFIG: IStorageConfig = {
  routes: [
    {
      route: "/upload",
      fileKey: "file",
    },
  ],
  destination: "uploads",
  engine: "local",
};
