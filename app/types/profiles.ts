import type { Profile } from "./models";

export type CreateProfileDTO = Omit<
  Profile,
  "id" | "status" | "created_at" | "updated_at"
>;

export type UpdateProfileDTO = Partial<CreateProfileDTO>;

export type User = Omit<Profile, "created_at" | "updated_at">;
