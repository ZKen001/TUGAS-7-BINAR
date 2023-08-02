var bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken');
const pool = mysql.createPool({
  connectionLimit: 20,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chapter6'
})

class UserController {
  async loginPage(req, res) {


    if (req.session.User) {
      return res.redirect("/");
    }
    return res.render("login");

  }
  
  //gameRoom
  async gamePage(req, res) {


    if (req.session.User) {
      return res.redirect("/");
    }
    return res.render("room");

  }
  //register
  async registerPage(req, res) {
    if (req.session.User) {
      return res.redirect("/");
    }

    return res.render("register");
  }
  //Biodata
  async biodataPage(req, res) {
    let params = req.query.id;

    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * from user_game WHERE id = ?', [params], (err, rows) => {
        const dataBiodata = rows;
        connection.release() // return the connection to pool


        if (!err) {
          console.log(dataBiodata);
          // return dataBiodata ;
          return res.render("biodata", {
            dataBiodata,
          });
        }
        else {
          console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
      })
    })
  }
  //Edit 
  async editPage(req, res) {
    let params = req.query.id;

    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * from user_game WHERE id = ?', [params], (err, rows) => {
        const dataEdit = rows;
        connection.release() // return the connection to pool


        if (!err) {
          console.log(dataEdit);
          // return dataEdit ;
          return res.render("edit", {
            dataEdit,
          });
        }
        else {
          console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
      })
    })
  }

  //edit post
  async doEdit(req, res) {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);
      console.log(req.body);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {

    let params = req.body.id;
    let params2 = req.body.username;
    let params3 = req.body.password;
    let params4 = req.body.city;
    let params5 = req.body.gender;
    console.log(params, params2, params3, params4, params5);


    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('UPDATE user_game SET username = ?, password = ?,  city = ?, gender = ? WHERE id = ? ', [params2, params3, params4, params5, params], (err, rows) => {

        connection.release() // return the connection to pool


        if (!err) {
          // return dataEdit ;
          return res.redirect("/admin");
        }
        else {
          console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
      })
    })
  } else {
    // Access Denied
    return res.status(401).send(error);
  }
} catch (error) {
  // Access Denied
  return res.status(401).send(error);
}
  }
  
  async doLogin(req, res) {

    console.log(req.body);
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {

        const { username, password } = req.body;
        console.log(username, password);

        //db
        pool.getConnection((err, connection) => {
          if (err) throw err
          connection.query('SELECT * from user_game', (err, rows) => {
            const dataUser = rows;
            connection.release() // return the connection to pool


            if (!err) {
              const foundIndex = dataUser.findIndex((dataUser) => {
                return dataUser.username == username && dataUser.password == password;
              });
              console.log(foundIndex);
              if (foundIndex == -1) {
                return res.redirect("/login");
              }

              const userLogin = dataUser[foundIndex];
              // set session
              req.session.User = userLogin;

              // insert ke database

              if (userLogin.role == "superuser") {
                return res.redirect("/admin");
              } else if (userLogin.role == "user") {
                return res.redirect("/");
              }
            } else {
              console.log(err)
            }

            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
          })
        })
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } catch (error) {
      // Access Denied
      return res.status(401).send(error);
    }



  }

  async figthRoom(req, res) {

    console.log(req.body);
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {

        const { RoomNumber,player,option } = req.body;
        var namaPlayer
        var hasil
        console.log(RoomNumber,player,option)

        if (player == "player1") {
         namaPlayer = "player1"
        } 
        else {
          namaPlayer = "player2"
        }

        //db
        pool.getConnection((err, connection) => {
          if (err) throw err
          connection.query('SELECT * from user_game_history WHERE no_room = ?',[RoomNumber],  (err, rows) => {
            console.log(rows);
            if (rows[0]) {
              console.log("Data Ada");
              if (namaPlayer == "player1")  {
              pool.getConnection((err, connection) => {
                if (err) throw err
                connection.query('SELECT player1 from user_game_history WHERE no_room = ?',[RoomNumber],   (err, rows) => {
                  console.log(rows);
                  if (rows[0].player1 == null) {
                    console.log("Data ADAAAAAAAA",rows[0].player1);
                    pool.getConnection((err, connection) => {
                      if (err) throw err
                      connection.query('UPDATE user_game_history SET player1 = ?  WHERE no_room = ? ',[option,RoomNumber] ,   (err, rows) => {
                        console.log(rows);
                        if (rows) {
                          res.send("PLAYER 1 SUDAH BERMAIN")
                        }
                        else {
                          res.send("TIDAK DITEMUKAN")
                        }
                        
                        connection.release() // return the connection to pool
            
                      })
                    })
                  }
                  else {
                    console.log("PLAYER 1 SUDAH MAIN");
                    res.send("PLAYER 1 SUDAH MAIN")
                  }
                  
                  
                  connection.release() // return the connection to pool
      
                })
              })}
              else {
                pool.getConnection((err, connection) => {
                  if (err) throw err
                  connection.query('SELECT player2 from user_game_history WHERE no_room = ?',[RoomNumber],   (err, rows) => {
                    console.log(rows);
                    if (rows[0].player2 == null) {
                      console.log("Data Ada",rows[0].player1);
                      pool.getConnection((err, connection) => {
                        if (err) throw err
                        connection.query('UPDATE user_game_history SET player2 = ?  WHERE no_room = ? ',[option,RoomNumber] ,   (err, rows) => {
                          console.log(rows);
                          if (rows) {
                            pool.getConnection((err, connection) => {
                              if (err) throw err
                              connection.query('SELECT player1 from user_game_history WHERE no_room = ?',[RoomNumber],   (err, rows) => {
                                console.log(rows[0].player1);
                                if (rows[0].player1) {
                                    //MAIN LOGIC 
                                    switch (rows[0].player1 + option) {
                                      case "batugunting":
                                      case "kertasbatu":
                                      case "guntingkertas":
                                        hasil="P1 WIN";
                                        break ;
                                      case "kertasgunting":
                                      case "batukertas":
                                      case "guntingbatu":
                                        hasil="P2 WIN";
                                        break ;
                                      case "batubatu":
                                      case "kertaskertas":
                                      case "guntinggunting":
                                        hasil="DRAW";
                                        break;
                                  }       
                                  pool.getConnection((err, connection) => {
                                    if (err) throw err
                                    connection.query('UPDATE user_game_history SET skor  = ? WHERE no_room = ? ',[hasil,RoomNumber] ,   (err, rows) => {
                                      connection.release() 
                                    })
                                   }) 
                            }

                            
                                else {
                                  // res.send("TIDAK DITEMUKAN")
                                }
                                
                                connection.release() // return the connection to pool
                    
                              })
                            })
                                          
                          }
                          else {
                            res.send("TIDAK DITEMUKAN")
                          }
                          
                          connection.release() // return the connection to pool
              
                        })
                      })
                    }
                    else {
                      console.log("PLAYER 2 SUDAH MAIN");
                      res.send("PLAYER 2 SUDAH MAIN")
                    }
                    
                    
                    connection.release() // return the connection to pool
        
                  })
                })
              }
            }
            else {
              console.log("ROOM TIDAK DITEMUKAAANNN");
              res.send("ROOM TIDAK DITEMUKAN")
            }
            
            
            connection.release() // return the connection to pool

          })
        })
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } catch (error) {
      // Access Denied
      return res.status(401).send(error);
    }



  }

  //gameRoom2
  async doGame(req, res) {

    console.log(req.body);
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        console.log(req.body);

        var user1Choice=req.body.player1;
        var user2Choice=req.body.player2;
        var hasil 
        console.log(user1Choice+user2Choice);
          switch (user1Choice + user2Choice) {
          case "batugunting":
          case "kertasbatu":
          case "guntingkertas":
            hasil="p1 win";
            break ;
          case "kertasgunting":
          case "batukertas":
          case "guntingbatu":
            hasil="p2 win";
            break ;
          case "batubatu":
          case "kertaskertas":
          case "guntinggunting":
            hasil="draw";
            break;
      }
      console.log(hasil);
        return res.send(hasil);


     
        
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } catch (error) {
      // Access Denied
      return res.status(401).send(error);
    }



  }

  //deletePage
  async deletePage(req, res) {
    let params = req.query.id;

    console.log('masuk gan', params);
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('DELETE from user_game_biodata WHERE id = ?', [params], (err, rows) => {
        connection.release() // return the connection to pool


        if (!err) {
          res.send("BERHASIL DIHAPUS");
        }
        else {
          console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
      })
    })
  }
  //register DB

  async doregister(req, res) {
    

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);
      console.log(req.body);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {

        const { username, password, city, gender } = req.body;
        console.log(username, password, city, gender);
        const role = 'user'

        //db
        pool.getConnection((err, connection) => {
          if (err) throw err
          connection.query('INSERT INTO user_game SET username = ? , password = ? , role = ? , city = ? , gender = ?', [username, password, role, city, gender], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
              return res.redirect("/login");
            } else {
              if (err) {
                console.error('error connecting: ' + err.stack);
                return;
              }
            }
            console.log('The data from beer table are:11 \n', rows)
          })
         })
        } else {
          // Access Denied
          return res.status(401).send(error);
        }
      } catch (error) {
        // Access Denied
        return res.status(401).send(error);
      }
  }
        
  async userPage(req, res) {
    const { username, role } = req.session.User;

    return res.render("index", {
      username,
      role,
    });
  }

  async adminPage(req, res) {
    const { username, role } = req.session.User;
    if (role != "superuser") {
      return res.redirect("/login");
    }
    //DataBase admnin
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT user_game.id ,user_game.username, user_game.password , user_game_biodata.Skor , user_game_biodata.Last_Update FROM user_game LEFT JOIN user_game_biodata ON user_game.id=user_game_biodata.id', (err, rows) => {
        const dataUserBiodata = rows;
        console.log(dataUserBiodata, 'masuk gan');
        connection.release() // return the connection to pool


        if (!err) {
          console.log(dataUserBiodata[0].Username);
          return res.render("admin", {
            username,
            role,
            dataUserBiodata,
          });
        } else {
          console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', rows)
      })
    })

  }
  async gameRoom(req, res) {
    

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);
      console.log(req.body);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {

        const { RoomNumber } = req.body;  
        console.log(RoomNumber);
        const { skor,player1,player2} = null
        //db
        /pool.getConnection((err, connection) => {
          if (err) throw err
          connection.query('INSERT INTO user_game_history SET skor = ? , player1 = ? , player2 = ? , no_room = ?', [skor, player1, player2, RoomNumber], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
              return res.send('ROOM TELAH BERHASIL DIBUAT')
            } else {
              if (err) {
                console.error('error connecting: ' + err.stack);
                return;
              }
            }
            console.log('The data from beer table are:11 \n', rows)
          })
         })
        } else {
          // Access Denied
          return res.status(401).send(error);
        }
      } catch (error) {
        // Access Denied
        return res.status(401).send(error);
      }
  }

  async logout(req, res) {
    req.session.destroy(() => {
      // update ke table user login history dan set logoutAt = new Date where historyId
      return res.redirect("/login");
    });
  }
}

module.exports = UserController;
