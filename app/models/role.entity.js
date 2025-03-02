const {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} = require("typeorm");
const { User } = require("./user.entity");
const { Permission } = require("./permission.entity");

@Entity({ name: "roles" })
class Role {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: "varchar", length: 500, nullable: false })
  name;

  @Column({ type: "varchar", length: 100, nullable: false, default: "SYSTEM" })
  createdBy;

  @Column({ type: "boolean", default: true })
  enable;

  @Column({ type: "boolean", default: false })
  deleted;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "roleId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  users;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "roleId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permissionId", referencedColumnName: "id" },
  })
  permissions;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = { Role };
