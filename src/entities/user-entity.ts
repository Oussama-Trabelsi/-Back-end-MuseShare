import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Unique, ManyToMany, OneToMany, JoinTable, RelationCount } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Length, IsNotEmpty } from "class-validator";
import { PostEntity } from "./post-entity";
import { CommentEntity } from "./comment-entity";
import { MessageEntity } from "./message-entity";
import { ConversationEntity } from "./conversation-entity";

export enum UserRole {
    FREE = "free_user",
    PREMIUM = "premium_user"
}

@Entity("user")
@Unique(["username", "user_email"])
export class UserEntity {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column({
        length: 100
    })
    user_firstName: string;

    @Column({
        length: 100
    })
    user_lastName: string;

    @Column('varchar', {
        length: 100
      })
    user_email: string;

    @Column({
        length: 100
    })
    user_password: string;

    @Column({
        length: 100,
        default: ""
    })
    user_bio: string;

    @Column({default: "trash.jpg"})
    profileImgUrl: string;

    @Column({
        default: UserRole.FREE}
    )
    role: string;

    @Column({default: false})
    isPrivate: boolean;

    @Column({default: false})
    isOnline: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) last_login: Date;


    @ManyToMany(type => UserEntity, user => user.following, {
        cascade: ["insert"]})
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(type => UserEntity, user => user.followers, {
        cascade: ["insert"]})
    following: UserEntity[];


    @OneToMany(type => PostEntity, post => post.user, { onDelete: 'CASCADE' })
    posts: PostEntity[];

    @OneToMany(type => CommentEntity, comment => comment.user, { onDelete: 'CASCADE' })
    comments: CommentEntity[];

    @OneToMany(type => MessageEntity, message => message.sender, { onDelete: 'CASCADE' })
    sent_messages: MessageEntity[];

    @OneToMany(type => MessageEntity, message => message.sender, { onDelete: 'CASCADE' })
    recieved_messages: MessageEntity[];

    @OneToMany(type => ConversationEntity, conversation => {conversation.first_user, conversation.second_user}  , { onDelete: 'CASCADE' })
    conversations: ConversationEntity[];

    @RelationCount((user: UserEntity) => user.followers)
    followersCount: number;
    
    @RelationCount((user: UserEntity) => user.following)
    followingCount: number;

    @RelationCount((user: UserEntity) => user.posts)
    postsCount: number;

    @BeforeInsert()
    async hashPassword() {
    this.user_password = await bcrypt.hash(this.user_password, 10);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.user_password);
    }
}