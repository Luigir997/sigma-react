import axios from 'axios';
import { environment } from '../environment.js';

export class UserService {

    getUsers() {
      return axios.get(environment.url + 'users').then(res => res.data);
    }
}
