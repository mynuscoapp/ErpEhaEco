const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const mysql = require('mysql');
const { error } = require('console');
const bodyParser = require("body-parser");
const multipart = require('connect-multiparty');
const fs = require('fs');
const { parse } = require('csv-parse');
const multipartMiddleware = multipart({
  uploadDir: './amazon-file-upload'
});
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const multer = require('multer');
        const upload = multer({ dest: './amazon-file-upload' }); 

MYSQL_USER = 'erp_eha'
MYSQL_PASSWORD = 'EhaERP@12345'
MYSQL_HOST = '147.93.29.200'

MYSQL_DATABASE = 'erp_eha'
MYSQL_PORT = '3306'
// Database connection configuration
const connection = mysql.createConnection({
  host: MYSQL_HOST, // Your MySQL host
  user: MYSQL_USER, // Your MySQL username
  password: MYSQL_PASSWORD, // Your MySQL password
  database: MYSQL_DATABASE // The name of your database
});

// Connect to the database
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database: ' + err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database as id ' + connection.threadId);

//     // SQL query to retrieve data
//     const sql = 'SELECT bs.storeId, bs.productId, bp.NAME, bs.quantity, bs.quantityReserved FROM bitrix_store_stock_availablity bs inner join bitrix_products bp ON bs.productId = bp.id;'; // Replace with your table name

//     // Execute the query
//     connection.query(sql, (error, results, fields) => {
//         if (error) {
//             console.error('Error executing query: ' + error.stack);
//             return;
//         }
//         console.log('Data retrieved:');
//         console.log(results); // 'results' contains the retrieved rows

    //         // Close the connection
    //         connection.end((err) => {
    //             if (err) {S
    //                 console.error('Error closing the connection: ' + err.stack);
    //                 return;
    //             }
    //             console.log('Connection closed.');
    //         });
    //     });
    // });
    
    const server = require('http').createServer(app);
    const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
        }
    });
    
    app.get('/bitrixstock', (req, res) => {
        // connection.connect((err) => {
        //     if (err) {
        //         console.error('Error connecting to the database: ' + err.stack);
        //         return;
        //     }
        res.header("Access-Control-Allow-Origin", "*");
            console.log('Connected to MySQL database as id ' + connection.threadId);
            if(!connection._connectCalled ) 
              {
              connection.connect();
              }
            // SQL query to retrieve data
            const sql = 'SELECT bs.id, s.storeId, bs.storeid as id_of_store, bp.NAME as productName, bp.preview_picture, bs.quantity, bs.quantityReserved FROM bitrix_store_stock_availablity bs ' +
                ' inner join bitrix_products bp ON bs.productId = bp.id ' +
                ' LEFT JOIN  store s ON bs.storeId = s.id' +
                ' WHERE bp.ACTIVE = "Y"' ;
    
            // Execute the query
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error('Error executing query: ' + error.stack);
                    return;
                }
                console.log('Data retrieved:');
                res.send(results); // 'results' contains the retrieved rows
    
                // Close the connection
                // connection.end((err) => {
                //     if (err) {
                //         console.error('Error closing the connection: ' + err.stack);
                //         return;
                //     }
                //     console.log('Connection closed.');
                // });
            //});
        });
      });

app.get('/overallstock', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'select productId , SUM(quantity ) as overallQuantity, SUM(quantityReserved) as overallreserved from bitrix_store_stock_availablity group BY productId ;';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.get('/productslist', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'select id, name as productName, PREVIEW_PICTURE ,CASE WHEN VAT_INCLUDED = "Y" THEN PRICE ELSE (PRICE * 1.18) END as RRP, 18 as vat_per, VAT_INCLUDED, substring(tax_rate, LOCATE("-", tax_rate) + 1) as tax_rate from bitrix_products  WHERE ACTIVE = "Y"';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.get('/pipelinelist', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'SELECT id, name FROM deal_pipeline dp where dp.status = "Yes";';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.get('/pulseusers', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'select * from pulse_users;';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.get('/bitrixapiurl', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'SELECT API_URL FROM pulse_api_urls WHERE KEY_NAME = "bitrix_api_url";';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.put('/pulseusers/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  const sql = `
          UPDATE pulse_users SET
          Employee = ?,
          Email = ?,
          Mobile = ?,
          Department = ?,
          Position = ?,
          Date_of_birth = ?,
          Gender = ?
          WHERE ID = ?
       `;

  const params = [
    updatedUser.Employee,
    updatedUser.Email,
    updatedUser.Mobile,
    updatedUser.Department,
    updatedUser.Position,
    updatedUser.Date_of_birth,
    updatedUser.Gender,
    userId
  ];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }
    console.log('Update result:', result); // Log the result for debugging
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

app.post('/pulseusers', (req, res) => {
  const { Employee, Email, Mobile, Department, Position, Date_of_birth, Gender, FirstName, LastName } = req.body;

  // Step 1: Get MAX ID
  const getMaxIdQuery = 'SELECT MAX(ID) AS maxId FROM pulse_users';

  connection.query(getMaxIdQuery, (err, results) => {
    if (err) {
      console.error('Error getting max ID:', err);
      return res.status(500).json({ error: 'Failed to retrieve max ID' });
    }

    const maxId = results[0].maxId || 0;
    const newId = maxId + 1;

    // Step 2: Insert user with new ID
    const insertQuery = `
            INSERT INTO pulse_users 
            (ID, Employee, Email, Mobile, Department, Position, Date_of_birth, Gender, First_name, Last_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

    const params = [
      newId,
      Employee,
      Email,
      Mobile,
      Department,
      Position,
      Date_of_birth,
      Gender,
      FirstName,
      LastName,
    ];

    connection.query(insertQuery, params, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Failed to add user' });
      }

      console.log('User added successfully with ID:', newId);
      res.status(201).json({ message: 'User added successfully', insertedId: newId });
    });
  });
});




app.get('/customerlist', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'SELECT id, name FROM customer_company cc';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});

app.get('/storelist', (req, res) => {
  // connection.connect((err) => {
  //     if (err) {
  //         console.error('Error connecting to the database: ' + err.stack);
  //         return;
  //     }
  res.header("Access-Control-Allow-Origin", "*");
  console.log('Connected to MySQL database as id ' + connection.threadId);
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'select id, s.storeid  as name from store s ;';

  // Execute the query
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Data retrieved:');
    res.send(results); // 'results' contains the retrieved rows

    // Close the connection
    // connection.end((err) => {
    //     if (err) {
    //         console.error('Error closing the connection: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connection closed.');
    // });
    //});
  });
});



app.listen(port, () => {
  connection.connect();
  console.log(`Express server listening at https://localhost:${port}`);
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (connection.state === 'disconnected') {
    connection.connect();
  }

 const sql = 'SELECT ID, Email, password, allowlogin, Role FROM pulse_users WHERE Email = ? LIMIT 1';
connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    if (user.allowlogin === 0 || user.allowlogin === false) {
      return res.status(403).json({ error: 'Access denied. Login not allowed for this user.' });
    }
// Debugging logs
console.log("Entered email:", email);
console.log("Entered password:", password);
console.log("DB record:", user);


    // ✅ Use bcrypt to compare hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log("Password match result:", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      success: true,
      user: {
        email: user.Email,
        role: user.Role,
        id: user.ID
      }
    });
  });
});
// Note: The login endpoint is now using bcrypt to compare the password securely.

      // Add this code after your other endpoints

      // app.post('/login', (req, res) => {
      //   const { email, password } = req.body;
      //   if (connection.state === 'disconnected') {
      //     connection.connect();
      //   }
      //   // Check if user exists with given email and password
      //   const sql = 'SELECT Email, allowlogin FROM pulse_users WHERE Email = ? AND password = ? LIMIT 1';
      //   connection.query(sql, [email, password], (err, results) => {
      //     if (err) {
      //       console.error('Error during login:', err);
      //       return res.status(500).json({ error: 'Database error' });
      //     }
      //     if (results.length === 0) {
      //       // No user found or wrong password
      //       return res.status(401).json({ error: 'Invalid email or password' });
      //     }

      //     const user = results[0];

      //     if (user.allowlogin === 0 || user.allowlogin === false) { 
      //       return res.status(403).json({ error: 'Access denied. Login not allowed for this user.' });
      //     }
      //     // Login successful
      //     res.json({
      //       message: 'Login successful',
      //       success: true,
      //       user: {
      //         email: user.Email,
              
      //       }
      //     });
      //   });
      // });

// app.post('/verify-email', (req, res) => {
//   const { email } = req.body;

//   const sql = 'SELECT * FROM pulse_users WHERE Email = ? LIMIT 1';
//   connection.query(sql, [email], (err, results) => {
//     if (err) {
//       console.error('Email verification error:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (results.length > 0) {
//       res.json({ exists: true, userId: results[0].ID });
//     } else {
//       res.json({ exists: false });
//     }
//   });
// });
    app.post('/verify-email', (req, res) => {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const sql = 'SELECT * FROM pulse_users WHERE Email = ? LIMIT 1';
      connection.query(sql, [email], (err, results) => {
        if (err) {
          console.error('Email verification error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
          res.json({ exists: true, userId: results[0].ID });
        } else {
          res.json({ exists: false });
        }
      });
    });



    //   app.post('/reset-password', (req, res) => {
    //     const { email, newPassword } = req.body;
    //     const sql = 'UPDATE pulse_users SET PASSWORD = ? WHERE Email = ?';
    //     connection.query(sql, [newPassword, email], (err, result) => {
    //       if (err) {
    //         console.error('Error resetting password:', err);
    //         return res.status(500).json({ error: 'Database error' });
    //       }
    //       if (result.affectedRows > 0) {
    //         res.json({ success: true, message: 'Password updated successfully' });
    //       } else {
    //         res.status(404).json({ success: false, message: 'User not found' });
    //       }
    //     });
    // });

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: "business22.web-hosting.com", // ✅ use this
  port: 465,                             // SSL
  secure: true,                          // upgrade later with STARTTLS
  debug: true,                           // show debug output
  logger: true,                          // true for 465, false for 587
  auth: {
    user: "noreply@mynusco.com",         // full email
    pass: "Srinath@!@#$"                 // email password
  }
});
// const transporter = nodemailer.createTransport({
//   service: 'smtp.mynusco.com',
//   auth: {
//     user: 'noreply@mynusco.com',
//     pass: 'Srinath@!@#$'
//   }
// });

// 1. Request password reset
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log('Received forgot-password request for:', email);
  const sqlCheck = 'SELECT * FROM pulse_users WHERE Email = ? LIMIT 1';
  connection.query(sqlCheck, [email], (err, results) => {
    if (err) {
      console.error('DB error in email check:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      console.log('Email not found:', email);
      return res.status(404).json({ error: 'Email not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    const sqlUpdate = 'UPDATE pulse_users SET reset_code = ?, reset_code_expiry = ? WHERE Email = ?';
    connection.query(sqlUpdate, [resetCode, expiryTime, email], (err2) => {
      if (err2) {
        console.error('DB error updating reset code:', err2);
        return res.status(500).json({ error: 'Database error' });
      }

      const mailOptions = {
        from: 'noreply@mynusco.com',
        to: email,
        subject: 'Your Password Reset Code',
        html: `<p>Your password reset code is: <b>${resetCode}</b></p><p>This code will expire in 15 minutes.</p>`
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Reset code sent to:', email);
        res.json({ message: 'Reset code sent to your email' });
      });
    });
  });
});


// 2. Verify reset code
app.post('/verify-reset-code', (req, res) => {
  const { email, resetCode } = req.body;
  console.log("Incoming verify request:", { email, resetCode });

  const sql = 'SELECT reset_code_expiry, reset_code FROM pulse_users WHERE Email = ? LIMIT 1';
  connection.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ error: 'Email not found' });

    console.log("DB row:", results[0]);

    if (results[0].reset_code !== resetCode) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }
    if (new Date() > new Date(results[0].reset_code_expiry)) {
      return res.status(400).json({ error: 'Code expired' });
    }

    res.json({ success: true, message: 'Code verified' });
  });
});


// 3. Reset password
app.post('/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required' });
    }

    // Promisify query to use async/await
    const query = (sql, params) => new Promise((resolve, reject) => {
      connection.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // 1️⃣ Check if reset code exists and is valid
    const selectSql = 'SELECT reset_code_expiry FROM pulse_users WHERE Email = ? AND reset_code = ? LIMIT 1';
    const results = await query(selectSql, [email, resetCode]);

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid reset code or email' });
    }

    const expiry = results[0].reset_code_expiry;
    if (new Date() > new Date(expiry)) {
      return res.status(400).json({ error: 'Reset code expired' });
    }

    // 2️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Update password in DB
    const updateSql = 'UPDATE pulse_users SET PASSWORD = ?, reset_code = NULL, reset_code_expiry = NULL WHERE Email = ?';
    const updateResult = await query(updateSql, [hashedPassword, email]);

    if (updateResult.affectedRows > 0) {
      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }

  } catch (err) {
    console.error('Reset password error:', err);  // <-- full error logging
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get permissions for a given user
app.get('/api/user-permissions/:id', (req, res) => {
  const userId = req.params.id; // pulse_users.ID

  // Step 1: Fetch user role
  const userQuery = 'SELECT Role FROM pulse_users WHERE ID = ?';
  connection.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error('Error fetching user role:', err);
      return res.status(500).json({ message: 'Error fetching user role' });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = userResult[0].Role;

    // Step 2: Fetch permissions for that role
    const permQuery = 'SELECT menu_label, route_path FROM role_permissions WHERE role_name = ?';
    connection.query(permQuery, [role], (err, permResult) => {
      if (err) {
        console.error('Error fetching permissions:', err);
        return res.status(500).json({ message: 'Error fetching permissions' });
      }

      res.json({
        role: role,
        permissions: permResult
      });
    });
  });
});


// app.post('/reset-password', async (req, res) => {
//   const { email, resetCode, newPassword } = req.body;
//   if (!email || !resetCode || !newPassword) {
//     return res.status(400).json({ error: 'Email, reset code, and new password are required' });
//   }

//   const sqlSelect = 'SELECT reset_code_expiry FROM pulse_users WHERE Email = ? AND reset_code = ? LIMIT 1';
//   connection.query(sqlSelect, [email, resetCode], async (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     if (results.length === 0) return res.status(400).json({ error: 'Invalid reset code or email' });

//     const expiry = results[0].reset_code_expiry;
//     if (new Date() > new Date(expiry)) return res.status(400).json({ error: 'Reset code expired' });

//     try {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       const sqlUpdate = 'UPDATE pulse_users SET PASSWORD = ?, reset_code = NULL, reset_code_expiry = NULL WHERE Email = ?';
//       connection.query(sqlUpdate, [hashedPassword, email], (err2, result) => {
//         if (err2) return res.status(500).json({ error: 'Database error' });
//         if (result.affectedRows > 0) {
//           res.json({ success: true, message: 'Password updated successfully' });
//         } else {
//           res.status(404).json({ error: 'User not found' });
//         }
//       });
//     } catch (hashErr) {
//       return res.status(500).json({ error: 'Error updating password' });
//     }
//   });
// });

// app.post('/verify-reset-code', (req, res) => {
//   const { email, resetCode } = req.body;

//   const sql = 'SELECT reset_code_expiry FROM pulse_users WHERE Email = ? AND reset_code = ? LIMIT 1';
//   connection.query(sql, [email, resetCode], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (results.length === 0) {
//       return res.status(400).json({ error: 'Invalid code or email' });
//     }

//     const expiry = results[0].reset_code_expiry;
//     if (new Date() > new Date(expiry)) {
//       return res.status(400).json({ error: 'Code expired' });
//     }

//     res.json({ success: true, message: 'Code verified' });
//   });
// });


// const bcrypt = require('bcrypt');

// app.post('/reset-password', async (req, res) => {
//   const { email, resetCode, newPassword } = req.body;

//   if (!email || !resetCode || !newPassword) {
//     return res.status(400).json({ error: 'Email, reset code, and new password are required' });
//   }

//   // Check if code matches and not expired
//   const sqlSelect = 'SELECT reset_code_expiry FROM pulse_users WHERE Email = ? AND reset_code = ? LIMIT 1';
//   connection.query(sqlSelect, [email, resetCode], async (err, results) => {
//     if (err) {
//       console.error('DB error:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (results.length === 0) {
//       return res.status(400).json({ error: 'Invalid reset code or email' });
//     }

//     const expiry = results[0].reset_code_expiry;
//     if (new Date() > new Date(expiry)) {
//       return res.status(400).json({ error: 'Reset code expired' });
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       const sqlUpdate = 'UPDATE pulse_users SET password = ?, reset_code = NULL, reset_code_expiry = NULL WHERE Email = ?';
//       connection.query(sqlUpdate, [hashedPassword, email], (err2, result) => {
//         if (err2) {
//           console.error('DB error:', err2);
//           return res.status(500).json({ error: 'Database error' });
//         }
//         if (result.affectedRows > 0) {
//           res.json({ success: true, message: 'Password updated successfully' });
//         } else {
//           res.status(404).json({ error: 'User not found' });
//         }
//       });
//     } catch (hashErr) {
//       console.error('Hashing error:', hashErr);
//       return res.status(500).json({ error: 'Error updating password' });
//     }
//   });
// });


    //   app.use(function (req, res, next) {

    //     cors({origin: '*'});
    //     // Website you wish to allow to connect
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    
    //     // Request methods you wish to allow
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    //     // Request headers you wish to allow
    //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    //     res.setHeader('Access-Control-Allow-Credentials', true);
    
    //     // Pass to next layer of middleware
    //     next();
    // });
    app.get('/paymentSummary', async(req,res) => {
            
      const { startdateparam, enddateparam, intervals, groupby, filterby, filtervalue } = req.query;

  console.log(req.query);

  const sql = `CALL GetPaymentSummary(?,?,?,?,?,?)`;
  const params = [
    startdateparam || '',
    enddateparam || '',
    intervals || '',
    groupby || " ",
    filterby || " ",
    filtervalue || " "
  ];

  console.log("SQL params:", params);
        // Execute the query
      connection.query(sql, params ,(error, results) => {
          
        if (error) {
            console.error('Error executing query: ' + error);
            //return res.status(500).json(error: error.message, stack: error.stack );
             return res.status(500).json({ error: error.message, stack: error.stack });
          }

          console.log('Data retrieved:', results);
          res.json(results[0]);
          //res.send(results); // 'results' contains the retrieved rows
        });
    });


  app.get("/filter-values", async(req, res) => {
  const filterBy = req.query.filterby; // "Category" or "Product"

  let column = "Category"; 
  if (filterBy === "Product" || filterBy === "product"){
    column = "product";
  } 
  if  (filterBy === "SKU" || filterBy === "sku")
    {
      column = "SKU";
    } 
  if(filterBy === "None") {
    column = "";
  }
  if (!column) {
    return res.send([]); // nothing selected
  }
  const sql = `SELECT DISTINCT ${column} AS value FROM sku_info`;
  console.log("Executing SQL:", sql);
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    //res.json(results.map(r => r.value));
    const values = results.map(r => r.value);
    res.json(values);
   //res.send(values);
  });
});

function AznPaymentsImport(records) {
      records.forEach(record => {
        const query = `INSERT INTO azn_payments (date, settlement_id, type, order_id, Sku, description, quantity, marketplace, account_type, fulfillment, order_city, order_state, order_postal, product_sales, shipping_credits, gift_wrap_credits, promotional_rebates, tax_liable, TCS_CGST, TCS_SGST, TCS_IGST, TDS, selling_fees, fba_fees, other_fees, other, total, last_updated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
    date = VALUES(date),
    settlement_id = VALUES(settlement_id),
    type = VALUES(type),
    order_id = VALUES(order_id),
    Sku = VALUES(Sku),
    description = VALUES(description),
    quantity = IF(VALUES(quantity) > 0, VALUES(quantity), 0),
    marketplace = VALUES(marketplace),
    account_type = VALUES(account_type),
    fulfillment = VALUES(fulfillment),
    order_city = VALUES(order_city),
    order_state = VALUES(order_state),
    order_postal = VALUES(order_postal),
    product_sales = VALUES(product_sales),
    shipping_credits = VALUES(shipping_credits),
    gift_wrap_credits = VALUES(gift_wrap_credits),
    promotional_rebates = VALUES(promotional_rebates),
    tax_liable = VALUES(tax_liable),
    TCS_CGST = VALUES(TCS_CGST),
    TCS_SGST = VALUES(TCS_SGST),
    TCS_IGST = VALUES(TCS_IGST),
    TDS = VALUES(TDS),
    selling_fees = VALUES(selling_fees),
    fba_fees = VALUES(fba_fees),
    other_fees = VALUES(other_fees),
    other = VALUES(other),
    total = VALUES(total),
    last_updated = VALUES(last_updated);`;
        const values = [record.date,
        record.settlement_id,
        record.type,
        record.order_id,
        record.Sku,
        record.description,
        record.quantity == '' ? 0 : record.quantity, 
        record.marketplace,
        record.account_type,
        record.fulfillment,
        record.order_city,
        record.order_state,
        record.order_postal,
        record.product_sales,
        record.shipping_credits,
        record.gift_wrap_credits,
        record.promotional_rebates,
        record.tax_liable,
        record.TCS_CGST,
        record.TCS_SGST,
        record.TCS_IGST,
        record.TDS,
        record.selling_fees,
        record.fba_fees,
        record.other_fees,
        record.other,
        record.total,
        record.last_updated
        ]; // Map CSV columns to DB columns
    
        connection.query(query, values, (err, result) => {
          if (err) {
            console.error('Error inserting/updating record:', err);
            return;
          }
          console.log('Record processed:', result);
        });
      });
    }