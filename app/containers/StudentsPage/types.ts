export type Student = {
  age: number | null;
  email: string | null;
  firstName: string;
  lastName: string;
  grade: string | null;
  _id: string | null;
};
export type Pagination = {
  limit: number;
  index: number;
  pageNum: number;
};

export type Sort = {
  direction: 'ASC' | 'DESC';
  column: 'fullName';
};

export type ErrorFields<T> = Partial<Record<keyof T, string | any>>;

export type Filter = 'age' | undefined;
