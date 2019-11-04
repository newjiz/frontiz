import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router-dom';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles';
import {Container, Paper, Typography, TextField, Button, IconButton, AppBar, Toolbar, Grid, Menu, MenuItem} from '@material-ui/core';
import {MenuIcon} from '@material-ui/icons/Menu';

import 'typeface-roboto';
import './index.css';
import { getThemeProps } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3, 2),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paperButton: {
        textAlign: 'justify'
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const URL = "http://0.0.0.0:5000";
let TOKEN = undefined;
// const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiNWRiZjNjMTdmMTJjYWNhZmU0NGU0YTI0In0.NsDTZGPT-kqzWu8wNkUBHeJZ-CtyG16tmf9NbqPMCNUV1eLUa1M89gkSyYa5S0e3U6zgLfAri9RFs8cyISVcHw";

const Nav = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        jiz
                    </Typography>
                    <Button aria-controls="navMenu"i aria-haspopup="true" onClick={handleClick}>
                        go to
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem><Button component={Link} to={"/"}>home</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/login"}>login</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/register"}>register</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/submit"}>submit</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/user"}>profile</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/ranking"}>ranking</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/ranking2"}>ranking2</Button></MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const User = () => {
    const [user, setUser] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const headers = new Headers({
            "Authorization": TOKEN
        });

        const init = {
          method: "GET",
          headers: headers,
          mode: "cors",
        };

        const request = new Request(URL + "/", init);
        const r = await fetch(request);
        const r_data = await r.json();

        let user_data = {
            user: r_data.data.user,
            content: r_data.data.content
        };

        setUser(user_data);
    }

    return ([
        <Nav />,
        <Container maxwidth="sm" classname="root">
            <Typography variant="h2" component="h2">
            Hi, <b>{user.user && user.user.username}</b>!
            </Typography>
            {user.content && user.content.map(c => (
                <Paper className={classes.root}>
                <Typography component="p">
                "{c.content.data}"
                - <i>{new Date(c.created.$date).toDateString()}, {user.user.username}</i>
                </Typography>
                </Paper>
            ))}
        </Container>]
    );
};

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getRanking();
    }, []);

    async function getRanking() {
        const r = await fetch(URL + "/ranking");
        const ranking = await r.json();
        setRanking(ranking.data);
    }


    return ([
        <Nav />,
        <Container maxwidth="sm">
        <Typography variant="h2" component="h2">JizLO &copy;</Typography>
        {ranking.map(r => (
            <div>
            <Paper className={classes.root}>
            <Typography variant="h5" component="h3">
            <b>{r.votes.elo.toFixed(2)}</b>
            </Typography>
            <Typography variant="h5" component="h2">
            "{r.content.data}"
            </Typography>
            <Typography component="p">
            by <i>{r.user_id.$oid}</i>
            </Typography>
            </Paper>
            <br></br>
            </div>
        ))}
        </Container>
    ]);
};

const Ranking2 = () => {
    const [ranking, setRanking] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getRanking();
    }, []);

    async function getRanking() {
        const r = await fetch(URL + "/ranking2");
        const ranking = await r.json();
        setRanking(ranking.data);
    }


    return ([
        <Nav />,
        <Container maxwidth="sm">
        <Typography variant="h2" component="h2">Votiz &copy;</Typography>
        {ranking.map(r => (
            <div>
            <Paper className={classes.root}>
            <Typography variant="h5" component="h3">
            <b>{r.score_p.toFixed(2)} ({r.score_v})</b> 
            </Typography>
            <Typography variant="h5" component="h2">
            "{r.content.data}"
            </Typography>
            <Typography component="p">
            by <i>{r.user_id.$oid}</i>
            </Typography>
            </Paper>
            <br></br>
            </div>
        ))}
        </Container>
    ]);
};

const Login = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: "",
        password: "",
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const data = {
            "username": values.username,
            "password": values.password
        };

        const headers = {"Content-Type": "application/json"};

        const init = {
            method: "POST",
            headers: headers,
            mode: "cors",
            body: JSON.stringify(data)
          };
  
        const request = new Request(URL + "/login", init);
        const r = await fetch(request);
        const r_data = await r.json();
  
        TOKEN = r_data.token;
    };

    return ([
        <Nav />,
        <Container maxWidth="sm">
        <Typography variant="h2" component="h2">Login</Typography>
        <form className={classes.container} onSubmit={(e) => handleSubmit(e)}>
            <TextField
                id="username"
                label="Name"
                className={classes.textField}
                onChange={handleChange("username")}
                margin="normal"
            />
            <TextField
                id="password"
                type="password"
                label="Password"
                className={classes.textField}
                onChange={handleChange("password")}
                margin="normal"
            />
            <Button label="Submit" type="submit" variant="contained" className={classes.button}>
                Login
            </Button>
        </form>
        </Container>
    ]);
};

const Register = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: "",
        description: "",
        email: "",
        password: "",
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const data = {
            "username": values.username,
            "description": values.description,
            "email": values.email,
            "password": values.password
        };

        const headers = {"Content-Type": "application/json"};

        const init = {
            method: "POST",
            headers: headers,
            mode: "cors",
            body: JSON.stringify(data)
          };
  
        const request = new Request(URL + "/register", init);
        const r = await fetch(request);
        const r_data = await r.json();
  
        TOKEN = r_data.token;
    };

    return ([
        <Nav />,
        <Container maxWidth="sm">
        <Typography variant="h2" component="h2">Register</Typography>
        <form className={classes.container} onSubmit={(e) => handleSubmit(e)}>
            <TextField
                id="username"
                label="Name"
                className={classes.textField}
                onChange={handleChange("username")}
                margin="normal"
            />
            <TextField
                id="email"
                label="Email"
                className={classes.textField}
                onChange={handleChange("email")}
                margin="normal"
            />
            <TextField
                id="description"
                label="Description"
                className={classes.textField}
                onChange={handleChange("description")}
                margin="normal"
            />
            <TextField
                id="password"
                type="password"
                label="Password"
                className={classes.textField}
                onChange={handleChange("password")}
                margin="normal"
            />
            <Button label="Submit" type="submit" variant="contained" className={classes.button}>
                Register
            </Button>
        </form>
        </Container>
    ]);
};

const SubmitContent = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        content: "",
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const data = {
            "content": values.content,
        };

        const headers = {
            "Authorization": TOKEN,
            "Content-Type": "application/json"
        };

        const init = {
            method: "POST",
            headers: headers,
            mode: "cors",
            body: JSON.stringify(data)
          };
  
        const request = new Request(URL + "/content", init);
        const r = await fetch(request);
        const r_data = await r.json();
        
        console.log(r_data.body);
    };

    return ([
        <Nav />,
        <Container maxWidth="sm">
        <Typography variant="h2" component="h2">Submit content</Typography>
        <form className={classes.container} onSubmit={(e) => handleSubmit(e)}>
            <TextField
                id="content"
                label="Content"
                className={classes.textField}
                onChange={handleChange("content")}
                margin="normal"
            />
            <Button label="Submit" type="submit" variant="contained" className={classes.button}>
                Submit
            </Button>
        </form>
        </Container>
    ]);
};

const Home = () => {
    const [stack, setStack] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getStack();
    }, []);

    async function getStack() {
        const headers = new Headers({
            "Authorization": TOKEN
        });

        const init = {
          method: "GET",
          headers: headers,
          mode: "cors",
        };

        const request = new Request(URL + "/stack", init);
        const r = await fetch(request);
        const r_data = await r.json();

        setStack(r_data.data);
    }

    async function handleChoice(event, choice) {
        event.preventDefault();

        console.log(`User selected: ${choice}`);

        const other = (choice == 0) ? 1 : 0;
        const vote = {
            "win": stack[choice]._id.$oid,
            "los": stack[other]._id.$oid
        }

        const headers = new Headers({
            "Authorization": TOKEN,
            "Content-Type": "application/json"
        });

        const init = {
          method: "POST",
          headers: headers,
          mode: "cors",
          body: JSON.stringify(vote)
        };

        const request = new Request(URL + "/vote", init);
        const r = await fetch(request);
        const r_data = await r.json();

        console.log(r_data.message);

        getStack();
    };

    return ([
        <Nav />,
        <Container maxwidth="sm" className="root">
        <Typography variant="h2" component="h1">
        If u wanna get rich, u better vote bitx!
        </Typography>
        <br></br>
        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            {stack.map((s, i) =>
                <Grid item xs>
                    <Paper className={classes.paper} onClick={(e) => handleChoice(e, i)} component={Button} to={"/"}>
                        <Typography component="p">
                            <b>{s.content.data}</b>
                        </Typography>
                    </Paper> 
                </Grid>
            )}
        </Grid>
    </Container>
    ]);
};

ReactDOM.render(
    <Router>
        <Route exact path="/" component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/user" component={User}/>
        <Route path="/submit" component={SubmitContent}/>
        <Route path="/ranking" component={Ranking}/>
        <Route path="/ranking2" component={Ranking2}/>
    </Router>,
    document.getElementById('root')
);
