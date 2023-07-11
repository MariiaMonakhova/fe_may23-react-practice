import { Category } from './Category';
import { User } from './User';

export interface Product {
  id: number,
  name: string,
  categoryId: number,

  user?: User,
  category?: Category,
}
