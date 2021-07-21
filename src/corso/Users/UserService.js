import axios from 'axios';
import { environment } from '../environment.ts';

export class UserService {

    getUsers() {
      return axios.get(environment.url + 'users').then(res => res.data);
    }
}
