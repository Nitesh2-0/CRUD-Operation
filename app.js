const connection = require('./DBConnection')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Create
app.post('/users', (req, res) => {
  try {
    let newUser = req.body;
    let isExist = 'SELECT id FROM users WHERE name = ?';
    let sql = 'INSERT INTO users SET ?';

   connection.query(isExist, [newUser.name], (err, result) => {
      if (err) {
        return res.status(500).send({ msg: 'Error checking user existence', error: err.message });
      }

      if (result.length > 0) {
        return res.status(400).send({ msg: 'User already exists' });
      } else {
       connection.query(sql, newUser, (err, result) => {
          if (err) {
            return res.status(500).send({ msg: 'Error adding user', error: err.message });
          }
          res.status(201).send({ msg: 'User added successfully', user: newUser });
        });
      }
    });
  } catch (error) {
    res.status(500).send({ msg: 'Server error', error: error.message });
  }
});

//Get 
app.get('/users', (req,res) => {
  try {
    let user = 'SELECT * FROM users'
    connection.query(user, (err,result) => {
      if(err) return res.send({msg:'Data is not avilable'})
        res.status(200).json({msg:'Data founded successfully', users:result})
    })
  } catch (error) {
    res.send({msg:'Internal Server Error.', error:error.message});
  }
})

//delete
app.delete('/users/:id', (req, res) => {
  try {
    const deletedUser = `DELETE FROM users WHERE id = ?`; 
    connection.query(deletedUser, [req.params.id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      console.log("User deleted successfully.");
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.error("Exception caught:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update
app.put('/users/update/:id', (req,res) => {
  try {
    const {name, salary} = req.body; 
    let updateUser = `UPDATE users SET name=?, salary=? WHERE id=?`; 
    connection.query(updateUser,[name, salary, req.params.id], (err, result) => {
      if(err) {
        return res.status(500).json('Internal Server Error');
      }
      if(result.affectedRows==0){
        return res.status(404).send('User is not found');
      }
      res.status(201).json({msg:'User updated successfully', user:result})
    })
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


