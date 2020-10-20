import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user-entity";
import { ConversationEntity } from "./conversation-entity";

export enum status {
    SEEN = "seen",
    SENT = "sent"
}

@Entity("message")
export class MessageEntity {

    @PrimaryGeneratedColumn() id: number;

    @Column({length: 256}) content: string;

    @Column({default: status.SENT})
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) date: Date;

    @ManyToOne(type => UserEntity, user => user.sent_messages ,{ onDelete: 'CASCADE' })
    sender: UserEntity;

    @ManyToOne(type => UserEntity, user => user.recieved_messages ,{ onDelete: 'CASCADE' })
    reciever: UserEntity;

    @ManyToOne(type => ConversationEntity, conversation => conversation.messages, { onDelete: 'CASCADE' })
    conversation: ConversationEntity;

}