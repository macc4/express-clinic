export default class QueueModel {
  constructor() {
    this.apiURL = 'http://localhost:8080/api/v1/queue';
  }

  async enqueue(name, timeToLive) {
    if (timeToLive === '') {
      timeToLive = -1;
      await axios
        .post(`${this.apiURL}`, {
          name: name,
          timeToLive: timeToLive,
        })
        .catch(function (error) {
          // error is being handled in the Model and in the Controller
          // with axios error in the Controller is not initiated somehow
          // doesn't seem right
          console.log(error.response.data);
        });
    } else {
      await axios
        .post(`${this.apiURL}`, {
          name: name,
          timeToLive: parseInt(timeToLive),
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
    }
  }

  async peek(id) {
    const response = await axios.get(`${this.apiURL}/${id}`);
    return response.data.data.patient;
  }

  async dequeue(id) {
    await axios.delete(`${this.apiURL}/${id}`);
  }
}
