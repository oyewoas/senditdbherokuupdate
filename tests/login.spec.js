/* eslint-disable no-undef */
import chai from 'chai';
import bcrypt from 'bcrypt';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../server';
import pool from '../app/db/pool';
import {
  createAllTables,
} from '../app/db/db';

// createAllTables();


dotenv.config();

const {
  expect,
} = chai;
chai.use(chaiHttp);

const title = 'Here is a title';
const description = 'Here is a sample description';
const email = 'test@gmail.com';
const password = 'testingtesting';
const username = 'test';

// Generating token for testing
const token = jwt.sign({
    email: 'test@gmail.com',
    userId: 1,
  },
  'secret', {
    expiresIn: '1h',
  });
beforeEach(() => {
  pool.query('TRUNCATE TABLE users CASCADE',
    (err) => {
      if (err) {
        // console.log(err);
      }
      //  pool.end;()
    });
  pool.query('TRUNCATE TABLE parcels CASCADE',
    (err) => {
      if (err) {
        // console.log(err);
      }
      //  pool.end;()
    });
});

// Authentication
describe('/POST new user', () => {
  it('it should not CREATE a user without email or password field only', (done) => {
    const user = {
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        // console.log(err)
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user without email or username field only', (done) => {
    const user = {
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user without username or password field only', (done) => {
    const user = {
      email: 'testing@gmail.com',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user with empty email or password field only', (done) => {
    const user = {
      username: 'ayooluwa',
      password: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user with empty email or username field only', (done) => {
    const user = {
      password: 'password',
      username: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user with empty username or password field only', (done) => {
    const user = {
      email: 'testing@gmail.com',
      username: '',
      password: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if user already exists', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'ayooluwa',
    };
    pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)', ['test@gmail.com', 'password', 'ayooluwa'], () => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body.message).equals('User Already Exists');
          expect(res.body.status).equals('409');
          done(err);
        });
    });
  });


  it('it should not POST a user, if email is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'password',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if password is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'pass',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if password is empty spaces', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: '         ',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should  POST a user', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('User Created Successfully');
        expect(res.body.status).equals('201');
        done(err);
      });
  });
});

// LogIn testing
describe('/POST Log user in', () => {
  it('it should not log a user in without email field', (done) => {
    const user = {
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not Log a user in without password field', (done) => {
    const user = {
      email: 'testing@gmail.com',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not Log a user in, if password is empty spaces', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: '         ',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not Log a user in, if email is empty', (done) => {
    const user = {
      email: '',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not Log a user in, if email is incorrect', (done) => {
    const user = {
      email: 'test.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not Log a user in, if password is substandard', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'pass',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not LOG a user in if user does not exist', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('User does not exist');
        expect(res.body.status).equals('401');
        done(err);
      });
  });

  it('it should LOG a user in', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
    };
    let logInpassword;
    bcrypt.hash('password', 10, (error, hash) => {
      logInpassword = hash;
      pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)', ['test@gmail.com', logInpassword, 'ayooluwa'], () => {
        chai.request(server)
          .post('/api/v1/auth/login')
          .send(user)
          .end((err, res) => {
            expect(res.body.message).equals('User Logged In Successfully');
            expect(res.body.status).equals('200');
            done(err);
          });
      });
    });
  });
});

describe('/GET/ user profile', () => {
  it('it should not GET profile if there is no auth token', (done) => {
    chai.request(server)
      .get('/api/v1/user/profile')
      .end((err, res) => {
        expect(res.body.message).equals('Auth failed');
        expect(res.status).equals(401);
        done(err);
      });
  });

  it('it should not GET profile if user does not exist', (done) => {
    chai.request(server)
      .get('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('User Does not exist');
        expect(res.status).equals(404);
        done(err);
      });
  });

  it('it should GET an entry by id', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // const id = 1;
        chai.request(server)
          .get('/api/v1/user/profile')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            // console.log(JSON.stringify(res.body, undefined, 3));
            expect(res.body.user).to.be.an('Object');
            expect(res.status).equal(200);
            expect(res.body.message).equal('User Returned Successfully');
            done(err);
          });
      }
    });
  });
});
