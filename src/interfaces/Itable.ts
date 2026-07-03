export interface IUsersRoleTable {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber?: string | null;
  phone?: string | null;
  profileimageurl: string;
  role: string | null;
  _id?: string;
}

export interface ICarrerTable {
  _id: string;
  careerName: string;
  careerLogo?: string;
}

export interface IUserID {
  email: string;
  fullName: string | null;
  profileimageurl: string;
  id: string;
}

export interface ITeam {
  score: number;
  shortName: string;
  teamId: string;
}

export interface IMatchTable {
  _id: string;
  zone: string;
  round: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  homeTeam: ITeam;
  awayTeam: ITeam;
}
export interface IRoundScheduleTable {
  _id: string;
  roundname: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rounddate: string;
  roundorder: number;
}

export type complex =
  | IUsersRoleTable
  | IFaqTable
  | ICarrerTable
  | IMatchTable
  | IRoundScheduleTable;

export interface Itable {
  limit?: number;
  selectedCategory?: string;
  headData: string[];
  dataShow?: complex[]; // Mark as optional
  pages?: number; // Mark as optional
  currPage?: number; // Mark as optional
  changePage?: (pageNumber: number) => void; // Mark as optional
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  role?: any;
}

export interface ICustomModelSettingstable {
  limit?: number;
  headData: string[];
  pages?: number;
  currPage?: number;
  changePage?: (pageNumber: number) => void;
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  statuss?: string;
  onClickCheckBox?: any;
  items?: object;
  setitems: any;
}
export interface commonItable {
  title?: string;
  limit?: number;
  selectedCategory?: string;
  searchTerm?: string; // Mark as optional
  headData: Record<string, string>;
  changePage?: (pageNumber: number) => void; // Mark as optional
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  deleteMessage?: string;
  handleDelete?: (id: string) => void;
  searchChange?: (term: string) => void;
  slug?: string;
}
export interface IFaqTable {
  _id: string;
  question: string;
  createdAt: any;
}
export interface roundItable {
  headData: string[];
  bodyData: complex[];
}

export interface IServiceTable {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  planId: {
    name: string;
    price: number;
    interval: string;
  };
}
