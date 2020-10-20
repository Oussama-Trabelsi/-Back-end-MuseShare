import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable, RelationCount } from "typeorm";
import { UserEntity } from "./user-entity";
import { PostEntity } from "./post-entity";

@Entity("comment")
export class CommentEntity {

    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(type => UserEntity, user => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn() user: UserEntity;

    @Column({length: 256}) content: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) date: Date;

    @ManyToOne(type => PostEntity, post => post.comments, { onDelete: 'CASCADE' })
    post: PostEntity;

    @ManyToMany(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinTable()
    likes: UserEntity[];

    @RelationCount((comment: CommentEntity) => comment.likes)
    likesCount: number;

}