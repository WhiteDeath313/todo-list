import { State } from "./state";

export class Task {
    _id!: string;
    title!: string;
    description!: string;
    due_date!: Date;
    state!: State;
    idUser!: string;
}