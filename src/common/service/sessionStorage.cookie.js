
class SessionStorage {
  constructor() {
    this.expired   = 60 * 60 * 24 * 7;
  }
  set(name, value, expired = this.expired) {
    if (name && value) {
      const timestamp = parseInt(new Date().getTime() / 1000);
      let objData = {
        data: value,
        expired: parseInt(timestamp + expired),
      };
      objData = JSON.stringify(objData);
      sessionStorage.setItem(name, objData);
    }
  }

  get(name) {
    const timestamp = parseInt(new Date().getTime() / 1000);
    let data = sessionStorage[name];
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
    sessionStorage.removeItem(name);
  }

}

export default new SessionStorage();