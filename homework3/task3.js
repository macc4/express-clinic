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
      console.log(`Person: ${element.name.title}. ${element.name.first} ${element.name.last}
Gender: ${element.gender}
Phone: ${element.phone}
Nationality: ${element.nat}\n`);
    });
  }
}

const users = new Users(10);
users.getUsers();
