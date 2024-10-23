// logged-in.dto.ts
import { Role } from "src/users/entities/user.entity";

export class LoggedInDto {
  id: number;
  username: string
  role: Role;
  sub?: number;
}
