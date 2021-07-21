import axios from 'axios';
import { environment } from '../environment.ts';

export class TodosService {

    getTodos() {
        return axios.get(environment.url+ 'todos').then(res => res.data);
    }

    deleteTodos(todos) {
        return axios.delete(environment.url+ 'todos/' + todos.id);
    }
}
