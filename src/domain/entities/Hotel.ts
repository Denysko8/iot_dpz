import { Entity, Column, ChildEntity, OneToMany } from 'typeorm';
import { ReviewableEntity } from './ReviewableEntity';
import { Review } from './Review';

@ChildEntity()
export class Hotel extends ReviewableEntity {
  @Column('integer')
  stars!: number;

  @OneToMany(() => Review, (review: Review) => review.hotel)
  reviews!: Review[];
}
