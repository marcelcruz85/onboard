const express = require('express')
const path = require('path')
const os = require('os');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const open = require('open');
const fs = require('fs');
const Sugar = require(path.join(__dirname, '/sugar'));
const Office = require(path.join(__dirname, '/office'));
const SendEmail = require(path.join(__dirname, '/email'));
const chromeLauncher = require('chrome-launcher');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')))
app.use('/static', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

let homeDir = os.homedir()
let userConfigOri = require(path.join(__dirname, '/public/configs/user.json'));
let userConfig = '';
let dataPath = '';

if (fs.existsSync(path.join(homeDir, 'onboard'))) {
    console.log(homeDir)
    dataPath = path.join(homeDir, 'onboard/users.json');
    userConfig = require(path.join(homeDir, 'onboard/user.json'));
} else {
    fs.mkdirSync(path.join(homeDir, 'onboard'));
    fs.writeFileSync(path.join(homeDir, 'onboard/users.json'), '{}', 'utf8', err => {
        if (err) {
            throw err;
        }
    });
    fs.copyFileSync(path.join(__dirname, '/public/configs/user.json'), path.join(homeDir, 'onboard/user.json'), (err) => {
        if (err) throw err;
    });

    dataPath = path.join(homeDir, 'onboard/users.json');
    userConfig = require(path.join(homeDir, 'onboard/user.json'));
}

const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8'
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8'
) => {
    fs.writeFile(filePath, fileData, encoding, err => {
      if (err) {
        throw err;
      }

      callback();
    });
};
  

app.get('/', (req, res) => {
    readFile(data => {
        res.render('users', { users: data} );
    }, true);
});

app.get('/users/add', (req, res) => {
    res.render('add', { data: userConfig} );
})

app.get('/users/edit/:id', (req, res) => {
    readFile(data => {
        const userId = req.params['id'];
        res.render('edit', { data: data[userId], config: userConfig} );
    }, true);
})

app.get('/users/:id', (req, res) => {
    readFile(data => {
        const userId = req.params['id'];
        res.render('view', { data: data[userId], config: userConfig} );
    }, true);
});

app.get('/users/email/:id', (req, res) => {
    readFile( async data => {
        const userId = req.params['id'];
        await SendEmail(data[userId]);
        console.log('email res');
        data[userId].alert = 'emailResponse'
        res.render('view', { data: data[userId], config: userConfig} );
    }, true);
});

app.get('/users/sugar/:id', (req, res) => {
    readFile( data => {
        const userId = req.params['id'];
        Sugar(data[userId]);
        console.log('email res');
        data[userId].alert = 'emailResponse'
        res.render('view', { data: data[userId], config: userConfig} );
    }, true);
});

app.get('/users/office/:id', (req, res) => {
    readFile( data => {
        const userId = req.params['id'];
        Office(data[userId]);
        data[userId].alert = 'emailResponse'
        res.render('view', { data: data[userId], config: userConfig} );
    }, true);
});

app.post('/users', (req, res) => {
    const newUserId = Date.now().toString();
    const dateCreated = new Date().toLocaleString()
    readFile(data => {
        req.body['id'] = newUserId;
        req.body['date_created'] = dateCreated;
        data[newUserId] = req.body;
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).redirect(`/users/${newUserId}`);
        });
    }, true);
});

app.post('/users/:id', (req, res) => {
    readFile(data => {
      const userId = req.params['id'];
      req.body['id'] = req.params['id'];
      data[userId] = req.body;
  
      writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).redirect(`/users/${userId}`);
      });
    }, true);
});


app.delete('/users/:id', (req, res) => {
    readFile(data => {
      const userId = req.params['id'];
      delete data[userId];
  
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} removed`);
      });
    }, true);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

open('http://localhost:3000');