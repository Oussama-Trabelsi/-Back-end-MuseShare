import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Unique, ManyToOne, ManyToMany, OneToMany, JoinTable, RelationCount } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Length, IsNotEmpty } from "class-validator";
import { UserEntity } from "./user-entity";
import { CommentEntity } from "./comment-entity";

@Entity("post")
export class PostEntity {

    @PrimaryGeneratedColumn() id: number;

    @Column({length: 256}) description: string;

    @Column() trackUrl: string;

    @Column() iconUrl: string;

    @Column() trackname: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) date: Date;

    @ManyToOne(type => UserEntity, user => user.posts ,{ onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToMany(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinTable()
    likes: UserEntity[];

    @OneToMany(type => CommentEntity, comment => comment.post,  { onDelete: 'CASCADE' })
    comments: CommentEntity[];

    @RelationCount((post: PostEntity) => post.likes)
    likesCount: number;

    @RelationCount((post: PostEntity) => post.comments)
    commentsCount: number;

}