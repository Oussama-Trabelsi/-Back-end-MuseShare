import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { MessageEntity } from "./message-entity";
import { UserEntity } from "./user-entity";

@Entity("conversation")
export class ConversationEntity {

    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(type => UserEntity, user => user.conversations ,{ onDelete: 'CASCADE' })
    first_user: UserEntity;

    @ManyToOne(type => UserEntity, user => user.conversations ,{ onDelete: 'CASCADE' })
    second_user: UserEntity;

    @OneToMany(type => MessageEntity, message => message.conversation,  { onDelete: 'CASCADE' })
    messages: MessageEntity[];
    
}