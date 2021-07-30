const fetch = require('node-fetch');

class Users {
  constructor(number) {
    this.number = number;
    this.url = 'https://randomuser.me/api/';
  }

  async getUsers() {
    const response = await fetch(`${this.url}?results=${this.number}`);
    const data = await response.json();

    data.results.forEach((element) => {
      console.log(`Person: ${element.name.title}. ${element.name.first} ${element.name.last}
Gender: ${element.gender}
Phone: ${element.phone}
Nationality: ${element.nat}\n`);
    });
  }
}

const users = new Users(10);
users.getUsers();
