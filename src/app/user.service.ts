import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private DB_URL = import.meta.env['NG_APP_DB_URL'];
  private findAllApiUrl = this.DB_URL + '/document/findAll/users';
  private createOrUpdateApiUrl = this.DB_URL + '/document/createorupdate/users';

  private myHeaders = new Headers();

  constructor() {
    this.myHeaders.append("Content-Type", "application/json");
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const userList = await this.findAll();
      //console.log(result);
      const user = userList.find((userdata: any) => {
        if (userdata.email.toLowerCase() === email.toLowerCase()) {
          return userdata
        }
      });

      if (user) {
        return user;
      } else {
        console.log('Error: User not found');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findByIdAndPassword(_id: string, password: string): Promise<any> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.myHeaders
    };

    try {
      const findOneApiUrl = this.DB_URL + `/document/findOne/users/${_id}`;
      const response = await fetch(findOneApiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const user = result.data;

      if (user.password === password) {
        return user;
      } else {
        console.log('Error: User not found');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findById(_id: string): Promise<any> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.myHeaders
    };

    const findOneApiUrl = this.DB_URL + `/document/findOne/users/${_id}`;

    try {
      const response = await fetch(findOneApiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const userData = result.data;

      if (userData) {
        return userData;
      } else {
        console.log('Not user found');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findAll(): Promise<any> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.myHeaders
    };

    try {
      const response = await fetch(this.findAllApiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const userList = result['data'];

      if (userList) {
        return userList;
      } else {
        console.log('Not user found');
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createUser(userdata: any): Promise<any> {
    //console.log(userdata);
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: this.myHeaders,
      body: JSON.stringify({
        ...userdata
      })
    };

    try {
      const response = await fetch(this.createOrUpdateApiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async updateUser(userdata: any): Promise<any> {
    const updateOneApiUrl = this.DB_URL + `/document/updateOne/users/${userdata._id}`;
    // console.log(userdata);
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: this.myHeaders,
      body: JSON.stringify({
        ...userdata
      })
    };

    try {
      const response = await fetch(updateOneApiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async deleteUser(userdata: any): Promise<any> {
    const deleteOneApiUrl = this.DB_URL + `/document/deleteOne/users/${userdata._id}`;
    //console.log(userdata);
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: this.myHeaders
    };

    try {
      const response = await fetch(deleteOneApiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
}
