
class LocalStorage {
  constructor() {
    this.expired   = 60 * 60 * 24 * 7;
  }

  set(name, value, expired = this.expired) {
    if (typeof parseInt(expired) === 'number') {
      if (name && !_.isEmpty(value + '')) {
        const timestamp = parseInt(new Date().getTime() / 1000);
        let objData = {
          data: value,
          expired: parseInt(timestamp + expired),
        };
        objData = JSON.stringify(objData);
        localStorage.setItem(name, objData);
      }
    }
  }

  get(name) {
    const timestamp = parseInt(new Date().getTime() / 1000);
    let data = localStorage[name];
    try {
      data = JSON.parse(data);
    }
    catch (err) {
      data = {};
    }

    if (data.expired <= timestamp) {
      this.remove(name);
      return {};
    }
    return data;
  }

  remove(name) {
    localStorage.removeItem(name);
  }
}

export default new LocalStorage();