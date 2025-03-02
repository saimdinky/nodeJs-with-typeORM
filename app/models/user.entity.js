const {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} = require("typeorm");
const { Role } = require("./role.entity");
const bcrypt = require("bcrypt");

@Entity({ name: "users" })
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  userName;

  @Column({ type: "varchar", length: 100, nullable: false })
  firstName;

  @Column({ type: "varchar", length: 100, nullable: false })
  lastName;

  @Column({ type: "varchar", length: 50, nullable: false, unique: true })
  email;

  @Column({ type: "varchar", length: 100, nullable: false, select: false })
  password;

  @Column({ type: "boolean", default: true })
  enable;

  @Column({ type: "boolean", default: false })
  deleted;

  @Column({ type: "varchar", length: 100, nullable: true })
  phone;

  @Column({ type: "varchar", length: 20, nullable: true })
  status;

  @ManyToMany(() => Role, (role) => role.users)
  roles;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }
}

module.exports = { User };
