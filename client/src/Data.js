import config from './config';

export default class Data {
    //API data
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

 // GET request to get user on sign in 
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  

  //POST request to create user on sign up
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

// GET request to get all courses
  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
        return response.json().then((data) => data);
      } else {
            throw new Error();
        }
      
    }

// GET request to get course by id
    async getCourseById(id) {
        const response = await this.api(`/courses/${id}`, 'GET');
        if (response.status === 200) {
            return response.json().then((data) => data);
          } else {
                throw new Error();
            }
          
        }
    

    // POST request to handle creating course    
    async createCourse(username, password, body) {
        const response = await this.api('/courses', 'POST', body, true, { username, password });
        if (response.status === 201) {
            return [];
        } else if (response.status === 400) {
                return response.json().then(data => {
                  return data.errors;
                });
          } else {
                throw new Error();
            } 
        }
    

     // delete request to delete courses   
        async deleteCourse(username, password, id) {
            const response = await this.api(`/courses/${id}`, 'DELETE', null, true, { username, password });
            if (response.status === 204) {
                return [];
            } else {
                throw new Error();
            }
    
        }


     // PUT request to update course   
        async updateCourse(username, password, body, id) {
            const response = await this.api(`/courses/${id}`, 'PUT', body, true, { username, password });
            if (response.status === 204) {
                return [];
            }else if (response.status === 400) {
                    return response.json().then(data => {
                      return data.errors;
                    });
            } else {
                    throw new Error();
                } 
            }
    
    
    }

    
