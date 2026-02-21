import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Restaurant } from './Restaurant';
import { Hotel } from './Hotel';
import { ReviewStatus } from '../enums/ReviewStatus';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  comment!: string;

  @Column('integer')
  rating!: number;

  @Column('datetime')
  date!: Date;

  @Column({
    type: 'varchar',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING
  })
  status!: ReviewStatus;

  @ManyToOne(() => User, (user: User) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.reviews, { nullable: true })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: Restaurant;

  @Column({ nullable: true })
  restaurantId?: number;

  @ManyToOne(() => Hotel, (hotel: Hotel) => hotel.reviews, { nullable: true })
  @JoinColumn({ name: 'hotelId' })
  hotel?: Hotel;

  @Column({ nullable: true })
  hotelId?: number;
}
