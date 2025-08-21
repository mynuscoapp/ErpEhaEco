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
app.use(express.json({ limit: '10mb' }));



app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const multer = require('multer');
const upload = multer({ dest: './amazon-file-upload', limits: { fileSize: 1 * 1000 * 1000 * 1000 /* bytes */ } }); 



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
//             if (err) {
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
    methods: ["PUT","GET","POST","DELETE"],
    responseHeader: ["Content-Type"],
    maxAgeSeconds: 3600
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
  if (!connection._connectCalled) {
    connection.connect();
  }
  // SQL query to retrieve data
  const sql = 'SELECT bs.id, s.storeId, bs.storeid as id_of_store, bp.NAME as productName, bp.preview_picture, bs.quantity, bs.quantityReserved FROM bitrix_store_stock_availablity bs ' +
    ' inner join bitrix_products bp ON bs.productId = bp.id ' +
    ' LEFT JOIN  store s ON bs.storeId = s.id' +
    ' WHERE bp.ACTIVE = "Y"';

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

// Add this code after your other endpoints

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (connection.state === 'disconnected') {
    connection.connect();
  }
  // Check if user exists with given email and password
  const sql = 'SELECT Email, Role FROM pulse_users WHERE Email = ? AND password = ? LIMIT 1';
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      // No user found or wrong password
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Login successful
    res.json({
      message: 'Login successful',
      success: true,
      user: {
        email: results[0].Email,
        role: results[0].Role,
      }
    });
  });
});

app.post('/verify-email', (req, res) => {
  const { email } = req.body;

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

app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const sql = 'UPDATE pulse_users SET PASSWORD = ? WHERE Email = ?';
  connection.query(sql, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Error resetting password:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

app.post('/amazonpaymentsupload', upload.array("AznPaymentsUpload",10), (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  
  if (!req.files || req.files.length === 0) {
    res.json({
      'message': 'No files Uploaded'
    });
    return;
  }
    req.files.forEach(file => {
      console.log(`File uploaded: ${file.filename}, Path: ${file.path}`);
      const csvFilePath = `${file.path}`;
      const records = [];

      fs.createReadStream(csvFilePath)
        .pipe(parse({ columns: true, skip_empty_lines: true })) // `columns: true` for header row mapping
        .on('data', (data) => records.push(data))
        .on('end', () => {
          console.log('CSV data parsed:', records);
          // Proceed to insert/update the database
          AznPaymentsImport(records);
          fs.unlinkSync(csvFilePath);
          res.json({
            'message': 'File uploaded successfully'
          });
        })
        .on('error', (err) => {
          console.error('Error parsing CSV:', err);
          res.json({
            'message': 'Error parsing CSV' + err
          });
          return;
        });

      // Perform operations with each file, e.g., save to database, process
    });

  
});

    app.get('/paymentSummary', async(req,res) => {
            
      const { startdateparam, enddateparam, intervals, groupby, filterby, filtervalue } = req.query;

  //console.log(req.query);

  const sql = `CALL GetPaymentSummary(?,?,?,?,?,?)`;
  const params = [startdateparam, enddateparam, intervals, groupby, filterby, filtervalue];

  //console.log("SQL params:", params);
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


    //   app.use(function (req, res, next) {
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