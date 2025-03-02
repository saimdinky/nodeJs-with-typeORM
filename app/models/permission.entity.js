const {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} = require("typeorm");
const { Role } = require("./role.entity");

@Entity({ name: "permission" })
class Permission {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: "varchar", length: 500, nullable: false })
  name;

  @Column({ type: "varchar", length: 500, nullable: false })
  api;

  @Column({ type: "varchar", length: 100, nullable: false, default: "SYSTEM" })
  createdBy;

  @Column({ type: "boolean", default: true })
  enable;

  @Column({ type: "boolean", default: false })
  deleted;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = { Permission };
