const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//mongodb://127.0.0.1:27017/thapatechnical


const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect('mongodb+srv://Shravanth_J:Jaga1979@cluster0.gtnryvj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Connection to MongoDB failed:', error);
    });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const User = mongoose.model('User', userSchema);

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10;
    User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                res.send('<script>alert("Email already exists"); window.location.href = "http://localhost:3000/register";</script>');
            } else {
                bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        const newUser = new User({
                            email,
                            password: hashedPassword,
                        });

                        newUser.save()
                            .then(() => {
                                console.log('User saved successfully');
                                console.log('User mail:', email);
                                console.log('Original password:', password);
                                res.send('<script>alert("Register Successful,Please login"); window.location.href = "http://localhost:3000/login";</script>');
                            })
                            .catch((error) => {
                                console.error('Error saving user:', error);
                                res.status(500).send('Internal Server Error');
                            });
                    }
                });
            }
        })
        .catch((error) => {
            console.error('Error finding user:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/bono', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bono.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
const userSchema1 = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});
const User1 = mongoose.model('Contact', userSchema1);
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
})
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    const newUser = new User1({
        name,
        email,
        message,
    })
    newUser.save()
        .then(() => {
            res.send('<script>alert("Data saved succesful in database"); window.location.href = "http://localhost:3000/contact";</script>');
        })
        .catch((e) => {
            res.send('<script>alert("Data storage failed"); window.location.href = "http://localhost:3000/contact";</script>');
        });

})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (req.cookies.token) {
        res.send('<script>alert("Another user is already logged in. Please log out before logging in again."); window.location.href = "http://localhost:3000/login";</script>');
        return;
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                res.send('<script>alert("Invalid email or password"); window.location.href = "http://localhost:3000/login";</script>');
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        res.status(500).send('Internal Server Error');
                    } else if (result) {
                        const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });
                        res.cookie('token', token, { maxAge: 36000000 });
                        res.send('<script>alert("Login Successful"); window.location.href = "http://localhost:3000/login";</script>');
                        console.log(token);
                    } else {
                        res.send('<script>alert("Invalid email or password"); window.location.href = "http://localhost:3000/login";</script>');
                    }
                });
            }
        })
        .catch((error) => {
            console.error('Error finding user:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/protected', verifyToken, (req, res) => {
    res.send('Protected route');
});

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send('Unauthorized');
    } else {
        jwt.verify(token, 'secret-key', (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).send('Token expired, please log in again');
                    console.log('expired');
                } else {
                    res.status(401).send('Unauthorized');
                }
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}



app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('<script>alert("Logged out successfully"); window.location.href = "http://localhost:3000/login";</script>');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
