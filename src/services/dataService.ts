import { Vue } from "vue-property-decorator";
class DataService {
  private usernamepassword: { [key: string]: string } = {}; // this will all be in data base

  constructor() {
    Vue.set(this.usernamepassword, "admin", "admin");
  }

  created() {}

  // Fake database call to check username and password
  public async checkLogin(username: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        var canLogin = false;
        if (username && password) {
          canLogin = this.usernamepassword[username] === password;
        }
        resolve(canLogin);
      }, 3000); // artificial delay
    });
  }
}

export const dataService = new DataService();
