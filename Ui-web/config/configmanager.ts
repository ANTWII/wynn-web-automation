interface Config {
  url: string;

}

let _config: Config = {
  url: '',

};

const PRODUCTION = 'PRODUCTION';
const TEST = 'TEST';
const ENVIRONMENT = process.env.ENVIRONMENT || PRODUCTION;

if (ENVIRONMENT.toUpperCase() === PRODUCTION) {

      _config.url = 'https://the-internet.herokuapp.com';

   
  }

else if (ENVIRONMENT.toUpperCase() === TEST) {

      _config.url = process.env.URL || 'https://the-internet.herokuapp.com';


    
  }


export default _config;