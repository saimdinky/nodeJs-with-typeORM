const { Entity, Column, PrimaryGeneratedColumn } = require("typeorm");

@Entity({ name: "client_token" })
class ClientToken {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: "varchar", length: 255, unique: true })
  token;

  @Column({ type: "varchar", length: 100 })
  clientName;

  @Column({ type: "boolean", default: true })
  active;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt;
}

module.exports = { ClientToken };
