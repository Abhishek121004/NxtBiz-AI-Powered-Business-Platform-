import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log('NxtBiz database connected');
}
