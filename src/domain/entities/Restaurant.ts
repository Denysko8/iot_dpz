import { Entity, Column, ChildEntity, OneToMany } from 'typeorm';
import { ReviewableEntity } from './ReviewableEntity';
import { Review } from './Review';

@ChildEntity()
export class Restaurant extends ReviewableEntity {
  @Column()
  cuisineType!: string;

  @Column()
  menuLink!: string;

  @OneToMany(() => Review, (review: Review) => review.restaurant)
  reviews!: Review[];
}
