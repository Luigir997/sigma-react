import axios from 'axios';
import { environment } from '../environment.js';

export class TodosService {

    getTodos() {
        return axios.get(environment.url+ 'todos').then(res => res.data);
    }

    deleteTodo(todos) {
        return axios.delete(environment.url+ 'todos/' + todos.id);
    }

    deleteMultiTodos(multiTodos) {
        return axios.delete(environment.url+ 'todos?' + multiTodos);
    }
}
