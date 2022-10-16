import { BaseEntity, 
        Entity, 
        PrimaryGeneratedColumn, 
        Column, 
        CreateDateColumn, 
        UpdateDateColumn,
        } from "typeorm";

@Entity()
export class file extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
        length: 260
    })
    name: string;

    @Column({
        length: 25
    })
    storedName: string;

    @Column({
        length: 255
    })
    type: string;
  
    @Column({
        length: 260
    })
    path: string;

    @Column()
    delete: boolean;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}