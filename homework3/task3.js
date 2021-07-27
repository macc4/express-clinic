const fetch = require('node-fetch');

class Users {
  constructor(number) {
    this.number = number;
  }

  async getUsers() {
    const response = await fetch(
      `https://randomuser.me/api/?results=${this.number}&inc=gender,name,nat,phone&exc=login&noinfo`
    );
    const data = await response.json();

    data.results.forEach((element) => {
      console.log(element);
    });
  }
}

const users = new Users(10);
users.getUsers();
